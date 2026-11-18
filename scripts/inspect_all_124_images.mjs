import { products } from '../src/data/products.js';

console.log('Index | ID | Name | Category | Image File');
console.log('---------------------------------------------------------');
products.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.id}] "${p.name}" (${p.category}) => ${p.images[0]}`);
});
