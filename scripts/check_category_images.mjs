import fs from 'fs';
import path from 'path';
import { categories } from '../src/data/categories.js';

console.log('--- CHECKING CATEGORY IMAGES ON DISK ---');
for (const c of categories) {
  const p = path.resolve('public', c.image.replace(/^\//, ''));
  const exists = fs.existsSync(p);
  console.log(`[${c.id}] "${c.name}": ${c.image} => exists: ${exists}`);
}
