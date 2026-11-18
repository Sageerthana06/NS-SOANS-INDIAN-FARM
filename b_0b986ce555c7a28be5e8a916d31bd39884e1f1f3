// ============================================================================
// NS SOANS INDIAN FARM — EXCEL (.XLSX / .XLS) & CSV PRICE-ONLY PARSER & MATCHER
// Strictly parses and matches product variant prices without modifying any
// non-price product fields. Supports:
//   1. Multi-sheet Matrix Excel workbooks (matching 'products details.xlsx')
//   2. Single-sheet Matrix Excel/CSV tables
//   3. Flat Row-per-Variant Excel/CSV tables (Product ID / SKU, Name, Weight, Price)
// ============================================================================

// Known category divider rows in 'products details.xlsx'
const KNOWN_CATEGORY_HEADERS = new Set([
  'PRODUCTS',
  'PRODUCT',
  'PRODUCT NAME',
  'ITEM NAME',
  'BEVERAGES',
  'VEG',
  'NON VEG',
  'PASTE',
  'GHEE',
  'OIL',
  'ATTA',
  'NATURAL / SWEETENER',
  'NATURAL/SWEETENER',
  'IMMUNITY SUPPORT',
  'RICE',
  'BREAKFAST & SNACKS',
  'BREAKFAST AND SNACKS',
  'GRAIN AND PULSES',
  'GRAINS AND PULSES'
]);

/**
 * Normalize product name for exact matching (handles XML entities & multiple spaces
 * present in 'products details.xlsx' such as 'HONEYMOON  BADAM POWDER').
 */
export function normalizeProductName(name) {
  if (!name && name !== 0) return '';
  return String(name)
    .replace(/&amp;/gi, '&')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

/**
 * Normalize weight strings to a canonical key for variant matching.
 * E.g. "250 GRAMS", "250 Gram", "250g", "250 gm" -> "250g"
 *      "1 KG", "1 Kg", "1kg", "1000g" -> "1kg"
 */
export function normalizeWeightKey(weightStr) {
  if (!weightStr && weightStr !== 0) return '';
  const cleaned = String(weightStr)
    .toLowerCase()
    .replace(/,/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Match number + unit
  const match = cleaned.match(/^(\d+(?:\.\d+)?)\s*(grams?|gms?|gm|g|kilograms?|kilos?|kgs?|kg|ml|l|litres?|liters?)$/i);
  if (match) {
    const num = parseFloat(match[1]);
    const unitRaw = match[2].toLowerCase();
    if (['gram', 'grams', 'gm', 'gms', 'g'].includes(unitRaw)) {
      if (num === 1000) return '1kg';
      if (num === 2000) return '2kg';
      if (num === 5000) return '5kg';
      if (num === 10000) return '10kg';
      return `${num}g`;
    }
    if (['kilogram', 'kilograms', 'kilo', 'kilos', 'kg', 'kgs'].includes(unitRaw)) {
      return `${num}kg`;
    }
    if (['ml'].includes(unitRaw)) {
      if (num === 1000) return '1l';
      return `${num}ml`;
    }
    if (['l', 'litre', 'litres', 'liter', 'liters'].includes(unitRaw)) {
      return `${num}l`;
    }
  }

  if (cleaned === 'pack of 30' || cleaned === 'packof30') {
    return 'packof30';
  }

  return cleaned.replace(/\s+/g, '');
}

/**
 * Check if a header string represents a weight column (e.g., "150 GRAM", "250 GRAMS", "1 KG")
 */
export function isWeightColumnHeader(str) {
  if (!str) return false;
  const key = normalizeWeightKey(str);
  return /^\d+(?:\.\d+)?(g|kg|ml|l)$/.test(key);
}

/**
 * Parse a raw price cell value strictly.
 * Returns:
 *  - { status: 'EMPTY', value: null } if blank/empty
 *  - { status: 'VALID', value: number } if valid positive number
 *  - { status: 'INVALID', value: null, raw } if non-numeric, zero, or negative
 */
export function parseStrictPriceCell(rawVal) {
  if (rawVal === null || rawVal === undefined) {
    return { status: 'EMPTY', value: null };
  }
  const str = String(rawVal).trim();
  if (str === '' || str === '-' || str === '—') {
    return { status: 'EMPTY', value: null };
  }

  // Strip currency symbol (₹, INR, Rs., commas, spaces) if present
  const cleaned = str
    .replace(/^(?:INR|Rs\.?|₹)\s*/i, '')
    .replace(/,/g, '')
    .replace(/\s+/g, '')
    .trim();

  if (cleaned === '') {
    return { status: 'EMPTY', value: null };
  }

  // Must be a valid number
  if (!/^-?\d+(?:\.\d+)?$/.test(cleaned)) {
    return { status: 'INVALID', value: null, raw: str };
  }

  const num = Number(cleaned);
  if (!Number.isFinite(num) || num <= 0) {
    return { status: 'INVALID', value: null, raw: str };
  }

  // Round to at most 2 decimal places (or integer if whole)
  const rounded = Math.round(num * 100) / 100;
  return { status: 'VALID', value: rounded };
}

// ============================================================================
// PURE-JS DEFLATE RAW (RFC 1951) DECOMPRESSOR FOR .XLSX ZIP ARCHIVES
// Works synchronously in both Browser and Node.js without external dependencies
// ============================================================================

const FIXED_LIT_LEN_TABLE = (() => {
  const lengths = new Uint8Array(288);
  for (let i = 0; i <= 143; i++) lengths[i] = 8;
  for (let i = 144; i <= 255; i++) lengths[i] = 9;
  for (let i = 256; i <= 279; i++) lengths[i] = 7;
  for (let i = 280; i <= 287; i++) lengths[i] = 8;
  return buildHuffmanTable(lengths);
})();

const FIXED_DIST_TABLE = (() => {
  const lengths = new Uint8Array(32);
  for (let i = 0; i < 32; i++) lengths[i] = 5;
  return buildHuffmanTable(lengths);
})();

const LEN_BASE = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258
];
const LEN_EXTRA = [
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
  3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0
];
const DIST_BASE = [
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577
];
const DIST_EXTRA = [
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
  7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13
];
const CL_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

function buildHuffmanTable(lengths) {
  let maxBits = 0;
  for (let i = 0; i < lengths.length; i++) {
    if (lengths[i] > maxBits) maxBits = lengths[i];
  }
  if (maxBits === 0) return { table: new Int32Array(1), maxBits: 1 };

  const blCount = new Int32Array(maxBits + 1);
  for (let i = 0; i < lengths.length; i++) {
    if (lengths[i] > 0) blCount[lengths[i]]++;
  }

  const nextCode = new Int32Array(maxBits + 1);
  let code = 0;
  for (let bits = 1; bits <= maxBits; bits++) {
    code = (code + blCount[bits - 1]) << 1;
    nextCode[bits] = code;
  }

  const size = 1 << maxBits;
  const table = new Int32Array(size).fill(-1);

  for (let sym = 0; sym < lengths.length; sym++) {
    const len = lengths[sym];
    if (len > 0) {
      const c = nextCode[len]++;
      // Reverse bits
      let rev = 0;
      for (let b = 0; b < len; b++) {
        rev = (rev << 1) | ((c >> b) & 1);
      }
      const step = 1 << len;
      const entry = (sym << 8) | len;
      for (let idx = rev; idx < size; idx += step) {
        table[idx] = entry;
      }
    }
  }
  return { table, maxBits };
}

export function inflateRawJS(data) {
  let bitPos = 0;
  const totalBits = data.length * 8;
  let out = new Uint8Array(Math.max(4096, data.length * 3));
  let outLen = 0;

  function ensureCapacity(extra) {
    if (outLen + extra > out.length) {
      let nextSize = out.length * 2;
      while (nextSize < outLen + extra) nextSize *= 2;
      const next = new Uint8Array(nextSize);
      next.set(out.subarray(0, outLen));
      out = next;
    }
  }

  function readBits(n) {
    let val = 0;
    for (let i = 0; i < n; i++) {
      const byteIdx = (bitPos + i) >> 3;
      const bitIdx = (bitPos + i) & 7;
      if (byteIdx < data.length) {
        val |= ((data[byteIdx] >> bitIdx) & 1) << i;
      }
    }
    bitPos += n;
    return val;
  }

  function decodeSymbol(huff) {
    const { table, maxBits } = huff;
    let peek = 0;
    for (let i = 0; i < maxBits; i++) {
      const byteIdx = (bitPos + i) >> 3;
      const bitIdx = (bitPos + i) & 7;
      if (byteIdx < data.length) {
        peek |= ((data[byteIdx] >> bitIdx) & 1) << i;
      }
    }
    const entry = table[peek];
    if (entry < 0) {
      throw new Error('Invalid Deflate Huffman sequence');
    }
    bitPos += entry & 0xff;
    return entry >> 8;
  }

  let bfinal = 0;
  while (!bfinal && bitPos < totalBits) {
    bfinal = readBits(1);
    const btype = readBits(2);

    if (btype === 0) {
      // Uncompressed block
      bitPos = (bitPos + 7) & ~7;
      const bytePos = bitPos >> 3;
      const len = data[bytePos] | (data[bytePos + 1] << 8);
      bitPos += 32; // skip len and nlen
      const startByte = bitPos >> 3;
      ensureCapacity(len);
      out.set(data.subarray(startByte, startByte + len), outLen);
      outLen += len;
      bitPos += len * 8;
    } else if (btype === 1 || btype === 2) {
      let litLenTable = FIXED_LIT_LEN_TABLE;
      let distTable = FIXED_DIST_TABLE;

      if (btype === 2) {
        const hlit = readBits(5) + 257;
        const hdist = readBits(5) + 1;
        const hclen = readBits(4) + 4;
        const clLengths = new Uint8Array(19);
        for (let i = 0; i < hclen; i++) {
          clLengths[CL_ORDER[i]] = readBits(3);
        }
        const clTable = buildHuffmanTable(clLengths);
        const allLengths = new Uint8Array(hlit + hdist);
        let idx = 0;
        while (idx < hlit + hdist) {
          const sym = decodeSymbol(clTable);
          if (sym < 16) {
            allLengths[idx++] = sym;
          } else if (sym === 16) {
            const repeat = readBits(2) + 3;
            const prev = idx > 0 ? allLengths[idx - 1] : 0;
            for (let r = 0; r < repeat; r++) allLengths[idx++] = prev;
          } else if (sym === 17) {
            const repeat = readBits(3) + 3;
            for (let r = 0; r < repeat; r++) allLengths[idx++] = 0;
          } else if (sym === 18) {
            const repeat = readBits(7) + 11;
            for (let r = 0; r < repeat; r++) allLengths[idx++] = 0;
          }
        }
        litLenTable = buildHuffmanTable(allLengths.subarray(0, hlit));
        distTable = buildHuffmanTable(allLengths.subarray(hlit, hlit + hdist));
      }

      while (true) {
        const sym = decodeSymbol(litLenTable);
        if (sym === 256) break;
        if (sym < 256) {
          ensureCapacity(1);
          out[outLen++] = sym;
        } else {
          const lenIdx = sym - 257;
          const length = LEN_BASE[lenIdx] + (LEN_EXTRA[lenIdx] ? readBits(LEN_EXTRA[lenIdx]) : 0);
          const distSym = decodeSymbol(distTable);
          const distance = DIST_BASE[distSym] + (DIST_EXTRA[distSym] ? readBits(DIST_EXTRA[distSym]) : 0);
          ensureCapacity(length);
          for (let i = 0; i < length; i++) {
            out[outLen] = out[outLen - distance];
            outLen++;
          }
        }
      }
    } else {
      throw new Error('Unsupported Deflate block type');
    }
  }

  return out.subarray(0, outLen);
}

// ============================================================================
// ZIP & OPENXML (.XLSX) READER
// ============================================================================

function readUInt16LE(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUInt32LE(bytes, offset) {
  return (
    (bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 24)) >>>
    0
  );
}

const utf8Decoder = new TextDecoder('utf-8');

function decodeXmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Convert Excel column letters (e.g. "A", "B", "AA") to 0-based index
 */
function colLettersToIndex(letters) {
  let idx = 0;
  for (let i = 0; i < letters.length; i++) {
    idx = idx * 26 + (letters.charCodeAt(i) - 64);
  }
  return idx - 1;
}

/**
 * Extract sheets as 2D arrays of cell values from an .xlsx binary buffer (Uint8Array)
 */
export function parseXlsxBuffer(uint8) {
  // Find End of Central Directory (0x06054b50)
  let eocd = -1;
  for (let i = uint8.length - 22; i >= Math.max(0, uint8.length - 65557); i--) {
    if (readUInt32LE(uint8, i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) {
    throw new Error('Invalid .xlsx file: ZIP Central Directory not found.');
  }

  const cdEntries = readUInt16LE(uint8, eocd + 10);
  const cdOffset = readUInt32LE(uint8, eocd + 16);

  const files = {};
  let p = cdOffset;
  for (let i = 0; i < cdEntries; i++) {
    if (readUInt32LE(uint8, p) !== 0x02014b50) break;
    const compMethod = readUInt16LE(uint8, p + 10);
    const compSize = readUInt32LE(uint8, p + 20);
    const fnameLen = readUInt16LE(uint8, p + 28);
    const extraLen = readUInt16LE(uint8, p + 30);
    const commentLen = readUInt16LE(uint8, p + 32);
    const localHeaderOffset = readUInt32LE(uint8, p + 42);

    const fname = utf8Decoder.decode(uint8.subarray(p + 46, p + 46 + fnameLen));
    const lhFnameLen = readUInt16LE(uint8, localHeaderOffset + 26);
    const lhExtraLen = readUInt16LE(uint8, localHeaderOffset + 28);
    const dataOffset = localHeaderOffset + 30 + lhFnameLen + lhExtraLen;
    const rawData = uint8.subarray(dataOffset, dataOffset + compSize);

    if (compMethod === 0) {
      files[fname] = rawData;
    } else if (compMethod === 8) {
      files[fname] = inflateRawJS(rawData);
    }
    p += 46 + fnameLen + extraLen + commentLen;
  }

  // Parse shared strings
  let sharedStrings = [];
  if (files['xl/sharedStrings.xml']) {
    const ssXml = utf8Decoder.decode(files['xl/sharedStrings.xml']);
    const siBlocks = ssXml.match(/<si[\s>][\s\S]*?<\/si>/g) || [];
    sharedStrings = siBlocks.map((si) => {
      const tMatches = si.match(/<t(?:\s+[^>]*)?>([\s\S]*?)<\/t>/g) || [];
      return decodeXmlEntities(
        tMatches.map((t) => t.replace(/<[^>]+>/g, '')).join('')
      );
    });
  }

  // Determine worksheet names and order
  const sheetNamesMap = {};
  if (files['xl/workbook.xml']) {
    const wbXml = utf8Decoder.decode(files['xl/workbook.xml']);
    const sheetTags = wbXml.match(/<sheet\s+[^>]*\/?>/g) || [];
    sheetTags.forEach((tag, idx) => {
      const nameMatch = tag.match(/name="([^"]+)"/);
      sheetNamesMap[`xl/worksheets/sheet${idx + 1}.xml`] = nameMatch
        ? decodeXmlEntities(nameMatch[1])
        : `Sheet${idx + 1}`;
    });
  }

  const worksheetKeys = Object.keys(files)
    .filter((k) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(k))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)[0], 10);
      const nb = parseInt(b.match(/\d+/)[0], 10);
      return na - nb;
    });

  const sheets = [];
  for (const wsKey of worksheetKeys) {
    const sxml = utf8Decoder.decode(files[wsKey]);
    const rowMatches = sxml.match(/<row[\s>][\s\S]*?<\/row>/g) || [];
    const rows = [];

    for (const r of rowMatches) {
      const cellMatches = r.match(/<c\s+[^>]*?(?:\/>|>[\s\S]*?<\/c>)/g) || [];
      if (cellMatches.length === 0) continue;

      const rowArr = [];
      let hasNonEmpty = false;

      for (const c of cellMatches) {
        const refMatch = c.match(/\br="([A-Z]+)\d+"/);
        const colIdx = refMatch ? colLettersToIndex(refMatch[1]) : rowArr.length;
        const typeMatch = c.match(/\bt="([^"]+)"/);
        const cellType = typeMatch ? typeMatch[1] : '';

        let val = '';
        if (cellType === 'inlineStr') {
          const tMatches = c.match(/<t(?:\s+[^>]*)?>([\s\S]*?)<\/t>/g) || [];
          val = decodeXmlEntities(tMatches.map((t) => t.replace(/<[^>]+>/g, '')).join(''));
        } else {
          const vMatch = c.match(/<v>([\s\S]*?)<\/v>/);
          if (vMatch) {
            const rawV = vMatch[1];
            if (cellType === 's') {
              const sIdx = parseInt(rawV, 10);
              val = sharedStrings[sIdx] !== undefined ? sharedStrings[sIdx] : '';
            } else {
              val = decodeXmlEntities(rawV);
            }
          }
        }

        while (rowArr.length <= colIdx) rowArr.push('');
        rowArr[colIdx] = val;
        if (String(val).trim() !== '') hasNonEmpty = true;
      }

      if (hasNonEmpty) {
        rows.push(rowArr);
      }
    }

    if (rows.length > 0) {
      sheets.push({
        sheetName: sheetNamesMap[wsKey] || wsKey.replace('xl/worksheets/', ''),
        rows
      });
    }
  }

  return sheets;
}

// ============================================================================
// CSV & XLS (TEXT / HTML / XML SPREADSHEET 2003) PARSERS
// ============================================================================

export function parseCsvText(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let inQuotes = false;

  const cleanText = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < cleanText.length; i++) {
    const ch = cleanText[i];
    const next = cleanText[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',' || ch === '\t') {
        row.push(cur.trim());
        cur = '';
      } else if (ch === '\r' && next === '\n') {
        row.push(cur.trim());
        if (row.some((c) => c !== '')) rows.push(row);
        row = [];
        cur = '';
        i++;
      } else if (ch === '\n' || ch === '\r') {
        row.push(cur.trim());
        if (row.some((c) => c !== '')) rows.push(row);
        row = [];
        cur = '';
      } else {
        cur += ch;
      }
    }
  }
  row.push(cur.trim());
  if (row.some((c) => c !== '')) rows.push(row);

  return [{ sheetName: 'CSV Import', rows }];
}

export function parseXlsBuffer(uint8) {
  // Check if it's actually a ZIP (.xlsx renamed to .xls)
  if (uint8.length >= 4 && readUInt32LE(uint8, 0) === 0x04034b50) {
    return parseXlsxBuffer(uint8);
  }

  const text = utf8Decoder.decode(uint8);

  // Check if HTML table or XML Spreadsheet 2003
  if (/<table[\s>]/i.test(text) || /<Row[\s>]/i.test(text)) {
    const rows = [];
    const trMatches = text.match(/<(?:tr|Row)[\s>][\s\S]*?<\/(?:tr|Row)>/gi) || [];
    for (const tr of trMatches) {
      const tdMatches = tr.match(/<(?:td|th|Cell|Data)[\s>][\s\S]*?<\/(?:td|th|Cell|Data)>/gi) || [];
      const row = tdMatches.map((td) =>
        decodeXmlEntities(td.replace(/<[^>]+>/g, '').trim())
      );
      if (row.some((c) => c !== '')) rows.push(row);
    }
    if (rows.length > 0) {
      return [{ sheetName: 'XLS Sheet', rows }];
    }
  }

  // Fallback to CSV / TSV text parsing
  return parseCsvText(text);
}

// ============================================================================
// SMART PRODUCT & VARIANT MATCHING ENGINE
// ============================================================================

/**
 * Given parsed sheets [{ sheetName, rows }] and existing catalogue products,
 * extracts all price rows and produces a comprehensive preview & validation report.
 *
 * Strictly enforces:
 *  - Match by Product ID / SKU first if available, else exact Product Name + Weight
 *  - Never create new products or new variants
 *  - Never guess or generate missing prices
 *  - Identify duplicate records and prevent duplicate updates
 */
export function buildBulkPricePreview(sheets, existingProducts) {
  // Build fast lookup maps for existing products
  const byIdMap = new Map();
  const bySlugMap = new Map();
  const byExactNameMap = new Map();
  const byNormNameMap = new Map();

  for (const prod of existingProducts) {
    byIdMap.set(String(prod.id).trim().toLowerCase(), prod);
    if (prod.slug) bySlugMap.set(String(prod.slug).trim().toLowerCase(), prod);
    byExactNameMap.set(String(prod.name).trim(), prod);
    byNormNameMap.set(normalizeProductName(prod.name), prod);
  }

  function findMatchingProduct(rawId, rawName) {
    if (rawId && String(rawId).trim() !== '') {
      const cleanId = String(rawId).trim().toLowerCase();
      if (byIdMap.has(cleanId)) return { product: byIdMap.get(cleanId), matchedBy: 'Product ID' };
      if (bySlugMap.has(cleanId)) return { product: bySlugMap.get(cleanId), matchedBy: 'SKU / Slug' };
    }
    if (rawName && String(rawName).trim() !== '') {
      const trimmed = String(rawName).trim();
      if (byExactNameMap.has(trimmed)) {
        return { product: byExactNameMap.get(trimmed), matchedBy: 'Exact Name + Weight' };
      }
      const norm = normalizeProductName(trimmed);
      if (byNormNameMap.has(norm)) {
        return { product: byNormNameMap.get(norm), matchedBy: 'Exact Name + Weight' };
      }
    }
    return { product: null, matchedBy: null };
  }

  const rawExtractedEntries = [];

  for (const sheet of sheets) {
    const { sheetName, rows } = sheet;
    if (!rows || rows.length === 0) continue;

    // Detect sheet layout:
    // Is it Flat Row-per-Variant (columns: Product ID / Name / Weight / Price)
    // OR Matrix format (columns: Product Name, 250 GRAMS, 500 GRAMS, 1 KG, ...)?
    const firstRow = rows[0].map((c) => String(c || '').trim());
    const firstRowUpper = firstRow.map((c) => c.toUpperCase());

    const hasWeightHeaderColumn = firstRowUpper.some((h) =>
      ['WEIGHT', 'SIZE', 'PACK SIZE', 'VARIANT', 'PACK WEIGHT'].includes(h)
    );
    const hasPriceHeaderColumn = firstRowUpper.some((h) =>
      ['PRICE', 'NEW PRICE', 'NEW EXCEL PRICE', 'NEW PRICE (INR)', 'PRICE (INR)', 'MRP', 'RATE', 'INR'].includes(h)
    );

    if (hasWeightHeaderColumn && hasPriceHeaderColumn) {
      // ----------------------------------------------------------------------
      // LAYOUT 1: FLAT ROW-PER-VARIANT TABLE
      // ----------------------------------------------------------------------
      const idColIdx = firstRowUpper.findIndex((h) =>
        ['PRODUCT ID', 'PRODUCT_ID', 'ID', 'SKU', 'SLUG'].includes(h)
      );
      const nameColIdx = firstRowUpper.findIndex((h) =>
        ['PRODUCT NAME', 'PRODUCT_NAME', 'PRODUCT', 'PRODUCTS', 'NAME', 'ITEM NAME'].includes(h)
      );
      const weightColIdx = firstRowUpper.findIndex((h) =>
        ['WEIGHT', 'SIZE', 'PACK SIZE', 'VARIANT', 'PACK WEIGHT'].includes(h)
      );
      // Prefer "NEW PRICE" over "EXISTING PRICE" if both exist in template
      let priceColIdx = firstRowUpper.findIndex((h) =>
        ['NEW PRICE', 'NEW EXCEL PRICE', 'NEW PRICE (INR)', 'UPDATE PRICE'].includes(h)
      );
      if (priceColIdx === -1) {
        priceColIdx = firstRowUpper.findIndex((h) =>
          ['PRICE', 'PRICE (INR)', 'MRP', 'RATE', 'INR'].includes(h)
        );
      }

      for (let rIdx = 1; rIdx < rows.length; rIdx++) {
        const row = rows[rIdx];
        const rawId = idColIdx >= 0 ? row[idColIdx] : '';
        const rawName = nameColIdx >= 0 ? row[nameColIdx] : '';
        const rawWeight = weightColIdx >= 0 ? row[weightColIdx] : '';
        const rawPrice = priceColIdx >= 0 ? row[priceColIdx] : '';

        if (!rawId && !rawName && !rawWeight && !rawPrice) continue;
        const normHeaderCheck = normalizeProductName(rawName);
        if (!rawId && !rawWeight && KNOWN_CATEGORY_HEADERS.has(normHeaderCheck)) continue;

        rawExtractedEntries.push({
          sheetName,
          rowNumber: rIdx + 1,
          rawId: String(rawId || '').trim(),
          rawName: String(rawName || '').trim(),
          rawWeight: String(rawWeight || '').trim(),
          rawPrice,
          isFromMatrixEmptyCell: false
        });
      }
    } else {
      // ----------------------------------------------------------------------
      // LAYOUT 2: MATRIX / WIDE TABLE (Matches 'products details.xlsx' Sheet 1 & Sheet 2)
      // ----------------------------------------------------------------------
      // Locate the header row containing weight columns (usually row 0)
      let weightCols = []; // [{ colIdx, rawWeightHeader, weightKey }]
      let idColIdx = -1;
      let nameColIdx = 0;
      let startRowIdx = 0;

      // Scan rows to allow switching weight headers if a sheet has multiple sections
      for (let rIdx = 0; rIdx < rows.length; rIdx++) {
        const row = rows[rIdx];
        if (!row || row.length === 0) continue;

        // Check if this row defines weight headers in columns >= 1
        // A true weight header row has >= 2 weight column labels and 0 plain numeric cells
        const detectedWeightCols = [];
        let detectedIdCol = -1;
        let detectedNameCol = 0;
        let plainNumericCellsInRow = 0;

        for (let cIdx = 0; cIdx < row.length; cIdx++) {
          const cellStr = String(row[cIdx] || '').trim();
          if (!cellStr) continue;
          const cellUpper = cellStr.toUpperCase();
          if (['PRODUCT ID', 'PRODUCT_ID', 'SKU', 'ID'].includes(cellUpper)) {
            detectedIdCol = cIdx;
            if (detectedNameCol === cIdx) detectedNameCol = cIdx + 1;
          } else if (['PRODUCTS', 'PRODUCT', 'PRODUCT NAME', 'NAME'].includes(cellUpper)) {
            detectedNameCol = cIdx;
          } else if (cIdx > 0 && isWeightColumnHeader(cellStr)) {
            detectedWeightCols.push({
              colIdx: cIdx,
              rawWeightHeader: cellStr,
              weightKey: normalizeWeightKey(cellStr)
            });
          } else if (cIdx > 0 && /^\d+(?:\.\d+)?$/.test(cellStr)) {
            plainNumericCellsInRow++;
          }
        }

        if (detectedWeightCols.length >= 2 && plainNumericCellsInRow === 0) {
          weightCols = detectedWeightCols;
          idColIdx = detectedIdCol;
          nameColIdx = detectedNameCol;

          // Special case in 'products details.xlsx' Sheet 2 Row 1:
          // A1 is "NS DESI GIR COW CULTURED GHEE" while B1..H1 are "150 GRAM".."10 KG"!
          // Check if cell A1 itself is a product name in the database!
          const firstCellStr = String(row[nameColIdx] || '').trim();
          const normFirstCell = normalizeProductName(firstCellStr);
          if (firstCellStr && !KNOWN_CATEGORY_HEADERS.has(normFirstCell)) {
            const { product: headerRowProduct } = findMatchingProduct(
              idColIdx >= 0 ? row[idColIdx] : '',
              firstCellStr
            );
            if (headerRowProduct) {
              for (const wCol of weightCols) {
                rawExtractedEntries.push({
                  sheetName,
                  rowNumber: rIdx + 1,
                  rawId: idColIdx >= 0 ? String(row[idColIdx] || '').trim() : '',
                  rawName: firstCellStr,
                  rawWeight: wCol.rawWeightHeader,
                  rawPrice: '',
                  isFromMatrixEmptyCell: true,
                  isHeaderRowProduct: true
                });
              }
            }
          }
          continue;
        }

        if (weightCols.length === 0) continue;

        const rawId = idColIdx >= 0 ? String(row[idColIdx] || '').trim() : '';
        const rawName = String(row[nameColIdx] || '').trim();
        if (!rawId && !rawName) continue;

        const normName = normalizeProductName(rawName);
        // Check if this is a category divider row (e.g. "BEVERAGES", "VEG", "NON VEG", "OIL", "ATTA")
        const hasAnyOtherCells = weightCols.some(
          (wc) => row[wc.colIdx] !== undefined && String(row[wc.colIdx]).trim() !== ''
        );
        if (!rawId && !hasAnyOtherCells && KNOWN_CATEGORY_HEADERS.has(normName)) {
          continue;
        }

        // Check for inline [Weight, Price] pair or combined "100 GRAMS CUBES 85 RS" / ["95", "PACK OF 30"] in the row
        const nonEmptyValueCols = [];
        for (let cIdx = Math.max(1, nameColIdx + 1); cIdx < row.length; cIdx++) {
          const valStr = String(row[cIdx] ?? '').trim();
          if (valStr !== '') {
            nonEmptyValueCols.push({ cIdx, valStr });
          }
        }

        // Case A: Single cell containing both weight and price, e.g. "100 GRAMS CUBES 85 RS"
        if (nonEmptyValueCols.length === 1) {
          const combinedMatch = nonEmptyValueCols[0].valStr.match(
            /^(\d+(?:\.\d+)?\s*(?:GRAMS?|GMS?|GM|G|KGS?|KG))\b[\s\S]*?\b(\d+(?:\.\d+)?)\s*(?:RS\.?|INR|₹)?$/i
          );
          if (combinedMatch) {
            rawExtractedEntries.push({
              sheetName,
              rowNumber: rIdx + 1,
              rawId,
              rawName,
              rawWeight: combinedMatch[1].trim(),
              rawPrice: combinedMatch[2].trim(),
              isFromMatrixEmptyCell: false
            });
            continue;
          }
        }

        // Case B: Two cells where first is Weight ("500 GRAMS", "200 GRAMS", "100 GRAMS", "150 GRAMS") and second is Price ("1000", "260", "160", "279", "600")
        if (
          nonEmptyValueCols.length === 2 &&
          isWeightColumnHeader(nonEmptyValueCols[0].valStr) &&
          parseStrictPriceCell(nonEmptyValueCols[1].valStr).status === 'VALID'
        ) {
          rawExtractedEntries.push({
            sheetName,
            rowNumber: rIdx + 1,
            rawId,
            rawName,
            rawWeight: nonEmptyValueCols[0].valStr,
            rawPrice: nonEmptyValueCols[1].valStr,
            isFromMatrixEmptyCell: false
          });
          continue;
        }

        // Case C: Two cells where first is Price ("95") and second is Pack size ("PACK OF 30")
        if (
          nonEmptyValueCols.length === 2 &&
          parseStrictPriceCell(nonEmptyValueCols[0].valStr).status === 'VALID' &&
          /^PACK\s+OF\s+\d+$/i.test(nonEmptyValueCols[1].valStr)
        ) {
          // Also map to the column weight header if applicable, plus the Pack variant
          const firstColWeight = weightCols.find((wc) => wc.colIdx === nonEmptyValueCols[0].cIdx);
          if (firstColWeight) {
            rawExtractedEntries.push({
              sheetName,
              rowNumber: rIdx + 1,
              rawId,
              rawName,
              rawWeight: firstColWeight.rawWeightHeader,
              rawPrice: nonEmptyValueCols[0].valStr,
              isFromMatrixEmptyCell: false
            });
          }
          rawExtractedEntries.push({
            sheetName,
            rowNumber: rIdx + 1,
            rawId,
            rawName,
            rawWeight: nonEmptyValueCols[1].valStr,
            rawPrice: nonEmptyValueCols[0].valStr,
            isFromMatrixEmptyCell: false
          });
          continue;
        }

        // Standard Matrix row: map each column to its weight header
        for (const wCol of weightCols) {
          const cellVal = row[wCol.colIdx];
          const isEmpty = cellVal === undefined || cellVal === null || String(cellVal).trim() === '';
          rawExtractedEntries.push({
            sheetName,
            rowNumber: rIdx + 1,
            rawId,
            rawName,
            rawWeight: wCol.rawWeightHeader,
            rawPrice: isEmpty ? '' : cellVal,
            isFromMatrixEmptyCell: isEmpty
          });
        }
      }
    }
  }

  // If a product appeared on the Sheet 2 header row (A1 = "NS DESI GIR COW CULTURED GHEE")
  // AND also appeared on a later data row with actual prices, remove the placeholder header-row entries
  const productsWithDataRows = new Set(
    rawExtractedEntries
      .filter((e) => !e.isHeaderRowProduct)
      .map((e) => `${normalizeProductName(e.rawName)}__${normalizeWeightKey(e.rawWeight)}`)
  );

  const filteredEntries = rawExtractedEntries.filter((e) => {
    if (!e.isHeaderRowProduct) return true;
    const key = `${normalizeProductName(e.rawName)}__${normalizeWeightKey(e.rawWeight)}`;
    return !productsWithDataRows.has(key);
  });

  // Now evaluate every entry against the database products and track duplicates
  const seenProductVariantKeys = new Set();
  const previewRows = [];

  let matchedUpdateCount = 0;
  let unchangedCount = 0;
  let skippedMissingPriceCount = 0;
  let duplicateCount = 0;
  let unmatchedCount = 0;
  let invalidPriceCount = 0;

  filteredEntries.forEach((entry, index) => {
    const { product, matchedBy } = findMatchingProduct(entry.rawId, entry.rawName);
    const weightKey = normalizeWeightKey(entry.rawWeight);
    const priceParse = parseStrictPriceCell(entry.rawPrice);

    if (!product) {
      unmatchedCount++;
      previewRows.push({
        id: `row-${index + 1}`,
        sheetName: entry.sheetName,
        rowNumber: entry.rowNumber,
        productId: entry.rawId || null,
        productName: entry.rawName || '(Unnamed Row)',
        category: '—',
        weight: entry.rawWeight || '—',
        existingPrice: null,
        newPrice: priceParse.status === 'VALID' ? priceParse.value : null,
        rawNewPrice: entry.rawPrice,
        priceDiff: null,
        priceDiffPercent: null,
        status: 'UNMATCHED_PRODUCT',
        statusLabel: 'Unmatched Product',
        matchedBy: null,
        willUpdate: false
      });
      return;
    }

    // Find matching weight variant on this product
    const variantObj = (product.weightOptions || []).find(
      (opt) => normalizeWeightKey(opt.weight) === weightKey
    );

    if (!variantObj) {
      // If it was an empty cell in a matrix column that doesn't belong to this product, ignore it
      if (entry.isFromMatrixEmptyCell) {
        return;
      }
      unmatchedCount++;
      previewRows.push({
        id: `row-${index + 1}`,
        sheetName: entry.sheetName,
        rowNumber: entry.rowNumber,
        productId: product.id,
        productName: product.name,
        category: product.category,
        weight: entry.rawWeight || '—',
        existingPrice: null,
        newPrice: priceParse.status === 'VALID' ? priceParse.value : null,
        rawNewPrice: entry.rawPrice,
        priceDiff: null,
        priceDiffPercent: null,
        status: 'UNMATCHED_WEIGHT',
        statusLabel: 'Unmatched Variant Weight',
        matchedBy,
        willUpdate: false
      });
      return;
    }

    const uniqueVariantKey = `${product.id}__${normalizeWeightKey(variantObj.weight)}`;
    const existingPrice =
      variantObj.price !== null && variantObj.price !== undefined
        ? Number(variantObj.price)
        : null;

    // Check for duplicate (product + weight) in the uploaded file
    if (seenProductVariantKeys.has(uniqueVariantKey)) {
      duplicateCount++;
      previewRows.push({
        id: `row-${index + 1}`,
        sheetName: entry.sheetName,
        rowNumber: entry.rowNumber,
        productId: product.id,
        productName: product.name,
        category: product.category,
        weight: variantObj.weight,
        existingPrice,
        newPrice: priceParse.status === 'VALID' ? priceParse.value : null,
        rawNewPrice: entry.rawPrice,
        priceDiff: null,
        priceDiffPercent: null,
        status: 'DUPLICATE',
        statusLabel: 'Duplicate Record (Skipped)',
        matchedBy,
        willUpdate: false
      });
      return;
    }

    seenProductVariantKeys.add(uniqueVariantKey);

    // Check price validity
    if (priceParse.status === 'EMPTY') {
      skippedMissingPriceCount++;
      previewRows.push({
        id: `row-${index + 1}`,
        sheetName: entry.sheetName,
        rowNumber: entry.rowNumber,
        productId: product.id,
        productName: product.name,
        category: product.category,
        weight: variantObj.weight,
        existingPrice,
        newPrice: null,
        rawNewPrice: '',
        priceDiff: null,
        priceDiffPercent: null,
        status: 'SKIPPED_EMPTY',
        statusLabel: 'Skipped (Missing Price)',
        matchedBy,
        willUpdate: false
      });
      return;
    }

    if (priceParse.status === 'INVALID') {
      invalidPriceCount++;
      previewRows.push({
        id: `row-${index + 1}`,
        sheetName: entry.sheetName,
        rowNumber: entry.rowNumber,
        productId: product.id,
        productName: product.name,
        category: product.category,
        weight: variantObj.weight,
        existingPrice,
        newPrice: null,
        rawNewPrice: entry.rawPrice,
        priceDiff: null,
        priceDiffPercent: null,
        status: 'INVALID_PRICE',
        statusLabel: `Invalid Price ("${priceParse.raw}")`,
        matchedBy,
        willUpdate: false
      });
      return;
    }

    const newPrice = priceParse.value;
    const priceDiff = existingPrice !== null ? Math.round((newPrice - existingPrice) * 100) / 100 : newPrice;
    const priceDiffPercent =
      existingPrice !== null && existingPrice > 0
        ? Math.round(((newPrice - existingPrice) / existingPrice) * 1000) / 10
        : null;

    if (existingPrice !== null && existingPrice === newPrice) {
      unchangedCount++;
      previewRows.push({
        id: `row-${index + 1}`,
        sheetName: entry.sheetName,
        rowNumber: entry.rowNumber,
        productId: product.id,
        productName: product.name,
        category: product.category,
        weight: variantObj.weight,
        existingPrice,
        newPrice,
        rawNewPrice: entry.rawPrice,
        priceDiff: 0,
        priceDiffPercent: 0,
        status: 'MATCHED_UNCHANGED',
        statusLabel: 'Matched (No Change)',
        matchedBy,
        willUpdate: false
      });
      return;
    }

    matchedUpdateCount++;
    previewRows.push({
      id: `row-${index + 1}`,
      sheetName: entry.sheetName,
      rowNumber: entry.rowNumber,
      productId: product.id,
      productName: product.name,
      category: product.category,
      weight: variantObj.weight,
      existingPrice,
      newPrice,
      rawNewPrice: entry.rawPrice,
      priceDiff,
      priceDiffPercent,
      status: 'MATCHED_UPDATE',
      statusLabel: 'Matched — Ready to Update',
      matchedBy,
      willUpdate: true
    });
  });

  return {
    rows: previewRows,
    summary: {
      totalRows: previewRows.length,
      readyToUpdate: matchedUpdateCount,
      unchanged: unchangedCount,
      skippedMissingPrice: skippedMissingPriceCount,
      duplicates: duplicateCount,
      unmatched: unmatchedCount,
      invalidPrice: invalidPriceCount,
      totalSkipped: skippedMissingPriceCount + unchangedCount + duplicateCount + unmatchedCount,
      totalFailed: invalidPriceCount
    }
  };
}

// ============================================================================
// PURE-JS .XLSX WORKBOOK GENERATOR (FOR TEMPLATE DOWNLOAD)
// Generates a genuine OpenXML .xlsx file matching 'products details.xlsx'
// ============================================================================

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC32_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function indexToColLetters(idx) {
  let s = '';
  let n = idx + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function buildWorksheetXml(aoa) {
  let rowsXml = '';
  for (let r = 0; r < aoa.length; r++) {
    const row = aoa[r];
    let cellsXml = '';
    for (let c = 0; c < row.length; c++) {
      const val = row[c];
      if (val === null || val === undefined || val === '') continue;
      const ref = `${indexToColLetters(c)}${r + 1}`;
      if (typeof val === 'number' && Number.isFinite(val)) {
        cellsXml += `<c r="${ref}"><v>${val}</v></c>`;
      } else {
        cellsXml += `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(val)}</t></is></c>`;
      }
    }
    rowsXml += `<row r="${r + 1}">${cellsXml}</row>`;
  }
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rowsXml}</sheetData></worksheet>`;
}

export function createXlsxBytesFromSheets(sheetsData) {
  const encoder = new TextEncoder();
  const zipEntries = [];

  const contentTypesOverrides = sheetsData
    .map(
      (_, idx) =>
        `<Override PartName="/xl/worksheets/sheet${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
    )
    .join('');

  zipEntries.push({
    name: '[Content_Types].xml',
    data: encoder.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  ${contentTypesOverrides}
</Types>`)
  });

  zipEntries.push({
    name: '_rels/.rels',
    data: encoder.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`)
  });

  const sheetsXml = sheetsData
    .map(
      (s, idx) =>
        `<sheet name="${escapeXml(s.sheetName)}" sheetId="${idx + 1}" r:id="rId${idx + 1}"/>`
    )
    .join('');

  zipEntries.push({
    name: 'xl/workbook.xml',
    data: encoder.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>${sheetsXml}</sheets>
</workbook>`)
  });

  const wbRelsXml = sheetsData
    .map(
      (_, idx) =>
        `<Relationship Id="rId${idx + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${idx + 1}.xml"/>`
    )
    .join('');

  zipEntries.push({
    name: 'xl/_rels/workbook.xml.rels',
    data: encoder.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${wbRelsXml}
</Relationships>`)
  });

  sheetsData.forEach((s, idx) => {
    zipEntries.push({
      name: `xl/worksheets/sheet${idx + 1}.xml`,
      data: encoder.encode(buildWorksheetXml(s.rows))
    });
  });

  // Pack as uncompressed Store ZIP (method 0) — 100% compatible with Excel, LibreOffice, and Google Sheets
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of zipEntries) {
    const nameBytes = encoder.encode(entry.name);
    const dataBytes = entry.data;
    const crc = crc32(dataBytes);

    const lh = new Uint8Array(30 + nameBytes.length);
    const lhv = new DataView(lh.buffer);
    lhv.setUint32(0, 0x04034b50, true);
    lhv.setUint16(4, 20, true);
    lhv.setUint16(6, 0, true);
    lhv.setUint16(8, 0, true); // store
    lhv.setUint16(10, 0, true);
    lhv.setUint16(12, 0, true);
    lhv.setUint32(14, crc, true);
    lhv.setUint32(18, dataBytes.length, true);
    lhv.setUint32(22, dataBytes.length, true);
    lhv.setUint16(26, nameBytes.length, true);
    lhv.setUint16(28, 0, true);
    lh.set(nameBytes, 30);

    localParts.push(lh, dataBytes);

    const cd = new Uint8Array(46 + nameBytes.length);
    const cdv = new DataView(cd.buffer);
    cdv.setUint32(0, 0x02014b50, true);
    cdv.setUint16(4, 20, true);
    cdv.setUint16(6, 20, true);
    cdv.setUint16(8, 0, true);
    cdv.setUint16(10, 0, true);
    cdv.setUint16(12, 0, true);
    cdv.setUint16(14, 0, true);
    cdv.setUint32(16, crc, true);
    cdv.setUint32(20, dataBytes.length, true);
    cdv.setUint32(24, dataBytes.length, true);
    cdv.setUint16(28, nameBytes.length, true);
    cdv.setUint16(30, 0, true);
    cdv.setUint16(32, 0, true);
    cdv.setUint16(34, 0, true);
    cdv.setUint16(36, 0, true);
    cdv.setUint32(38, 0, true);
    cdv.setUint32(42, offset, true);
    cd.set(nameBytes, 46);

    centralParts.push(cd);
    offset += lh.length + dataBytes.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const c of centralParts) cdSize += c.length;

  const eocd = new Uint8Array(22);
  const eocdv = new DataView(eocd.buffer);
  eocdv.setUint32(0, 0x06054b50, true);
  eocdv.setUint16(4, 0, true);
  eocdv.setUint16(6, 0, true);
  eocdv.setUint16(8, zipEntries.length, true);
  eocdv.setUint16(10, zipEntries.length, true);
  eocdv.setUint32(12, cdSize, true);
  eocdv.setUint32(16, cdOffset, true);
  eocdv.setUint16(20, 0, true);

  const totalLen = cdOffset + cdSize + 22;
  const out = new Uint8Array(totalLen);
  let pos = 0;
  for (const part of localParts) {
    out.set(part, pos);
    pos += part.length;
  }
  for (const part of centralParts) {
    out.set(part, pos);
    pos += part.length;
  }
  out.set(eocd, pos);
  return out;
}

/**
 * Generate the official NS SOANS multi-sheet Excel Price Template (.xlsx)
 * matching 'products details.xlsx' (Sheet 1: Masala Products, Sheet 2: Farm Products, Sheet 3: Flat Variant View)
 */
export function generatePriceTemplateXlsx(products) {
  const masalaProducts = products.filter((p) => p.collection === 'masala');
  const farmProducts = products.filter((p) => p.collection === 'organic');

  // Sheet 1: Masala Products (Matches Sheet 1 of products details.xlsx)
  const s1Rows = [['PRODUCTS', '250 GRAMS', '500 GRAMS', '1 KG']];
  let lastMasalaCat = '';
  for (const p of masalaProducts) {
    if (p.category.toUpperCase() !== lastMasalaCat) {
      lastMasalaCat = p.category.toUpperCase();
      s1Rows.push([lastMasalaCat]);
    }
    const getW = (k) => {
      const opt = (p.weightOptions || []).find((w) => normalizeWeightKey(w.weight) === k);
      return opt && opt.price !== null ? opt.price : '';
    };
    s1Rows.push([p.name, getW('250g'), getW('500g'), getW('1kg')]);
  }

  // Sheet 2: Farm Products (Matches Sheet 2 of products details.xlsx, with proper header row)
  const s2Rows = [
    ['PRODUCTS', '150 GRAM', '250 GRAM', '500 GRAM', '1 KG', '2 KG', '5 KG', '10 KG']
  ];
  let lastFarmCat = '';
  for (const p of farmProducts) {
    if (p.category.toUpperCase() !== lastFarmCat) {
      lastFarmCat = p.category.toUpperCase();
      s2Rows.push([lastFarmCat]);
    }
    const getW = (k) => {
      const opt = (p.weightOptions || []).find((w) => normalizeWeightKey(w.weight) === k);
      return opt && opt.price !== null ? opt.price : '';
    };
    s2Rows.push([
      p.name,
      getW('150g'),
      getW('250g'),
      getW('500g'),
      getW('1kg'),
      getW('2kg'),
      getW('5kg'),
      getW('10kg')
    ]);
  }

  return createXlsxBytesFromSheets([
    { sheetName: 'Masala Products', rows: s1Rows },
    { sheetName: 'Farm Products', rows: s2Rows }
  ]);
}

/**
 * Generate a Flat CSV Template with Product ID, Product Name, Category, Weight, Existing Price, New Price
 */
export function generatePriceTemplateCsv(products) {
  const lines = [
    ['Product ID', 'Product Name', 'Category', 'Weight', 'Existing Price (INR)', 'New Price (INR)'].join(',')
  ];

  for (const p of products) {
    for (const opt of p.weightOptions || []) {
      const safeName = `"${String(p.name).replace(/"/g, '""')}"`;
      const safeCat = `"${String(p.category).replace(/"/g, '""')}"`;
      const existing = opt.price !== null && opt.price !== undefined ? opt.price : '';
      lines.push([p.id, safeName, safeCat, opt.weight, existing, existing].join(','));
    }
  }

  return lines.join('\r\n');
}
