import fs from 'fs';
import path from 'path';

const dir = path.resolve('public/images/products');
const all = fs.readdirSync(dir);

function findMatching(pattern) {
  return all.filter(f => f.toLowerCase().includes(pattern.toLowerCase()));
}

console.log('Non-veg matches:');
console.log(findMatching('ghee-roast'));
console.log(findMatching('chicken'));

console.log('\nPaste matches:');
console.log(findMatching('paste'));

console.log('\nGhee matches:');
console.log(findMatching('ghee'));

console.log('\nOil matches:');
console.log(findMatching('oil'));

console.log('\nAtta matches:');
console.log(findMatching('atta'));
console.log(findMatching('khapli'));

console.log('\nNatural sweetener matches:');
console.log(findMatching('jaggery'));
console.log(findMatching('sugar'));

console.log('\nGrain and pulses matches:');
console.log(findMatching('tur'));
console.log(findMatching('dal'));
console.log(findMatching('grain'));
