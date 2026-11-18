import fs from 'fs';

// Check what was in scratch/inspect_products.mjs or git or previous transcript
const fullList = JSON.parse(fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/860ec9bf-6dac-483d-a909-3d4dc4219463/scratch/product_list.json', 'utf8'));
console.log('Previous product_list.json count:', fullList.length);

const masala = fullList.filter(p => p.collection === 'masala');
const farm = fullList.filter(p => p.collection === 'organic');
console.log('Masala count:', masala.length, 'Farm count:', farm.length);

// Let's check sheet 1 in Excel again:
import zlib from 'zlib';
const buf = fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/860ec9bf-6dac-483d-a909-3d4dc4219463/.user_uploaded/media_1794660710961_b7ce88ad.xlsx');

function findEndOfCentralDir(buf) {
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) return i;
  }
  throw new Error('Not a zip');
}

const eocd = findEndOfCentralDir(buf);
const cdOffset = buf.readUInt32LE(eocd + 16);
const cdEntries = buf.readUInt16LE(eocd + 10);

const files = {};
let p = cdOffset;
for (let i = 0; i < cdEntries; i++) {
  if (buf.readUInt32LE(p) !== 0x02014b50) break;
  const compMethod = buf.readUInt16LE(p + 10);
  const compSize = buf.readUInt32LE(p + 20);
  const fnameLen = buf.readUInt16LE(p + 28);
  const extraLen = buf.readUInt16LE(p + 30);
  const commentLen = buf.readUInt16LE(p + 32);
  const localHeaderOffset = buf.readUInt32LE(p + 42);
  const fname = buf.toString('utf8', p + 46, p + 46 + fnameLen);
  
  const lhExtraLen = buf.readUInt16LE(localHeaderOffset + 28);
  const dataOffset = localHeaderOffset + 30 + fnameLen + lhExtraLen;
  const rawData = buf.slice(dataOffset, dataOffset + compSize);
  
  if (compMethod === 0) files[fname] = rawData;
  else if (compMethod === 8) files[fname] = zlib.inflateRawSync(rawData);
  p += 46 + fnameLen + extraLen + commentLen;
}

const ssXml = files['xl/sharedStrings.xml'].toString('utf8');
const siBlocks = ssXml.match(/<si>[\s\S]*?<\/si>/g) || [];
const sharedStrings = siBlocks.map(si => {
  const tMatches = si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || [];
  return tMatches.map(t => t.replace(/<[^>]+>/g, '')).join('');
});

// Let's inspect all rows of Sheet 1 and Sheet 2 again
const s1xml = files['xl/worksheets/sheet1.xml'].toString('utf8');
const s2xml = files['xl/worksheets/sheet2.xml'].toString('utf8');

const s1rows = s1xml.match(/<row [^>]*>([\s\S]*?)<\/row>/g) || [];
const s2rows = s2xml.match(/<row [^>]*>([\s\S]*?)<\/row>/g) || [];

console.log('Sheet 1 XML row tags count:', s1rows.length);
console.log('Sheet 2 XML row tags count:', s2rows.length);
console.log('Total XML rows in both sheets:', s1rows.length + s2rows.length);

