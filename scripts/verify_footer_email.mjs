import fs from 'fs';

const footer = fs.readFileSync('src/components/Footer.jsx', 'utf8');

console.log('=== FOOTER EMAIL VERIFICATION ===');
console.log('1. Email address string present:', footer.includes('nssoansindianfarm.masala@gmail.com'));
console.log('2. Mailto link present:', footer.includes('mailto:nssoansindianfarm.masala@gmail.com'));
console.log('3. whiteSpace: nowrap present:', footer.includes("whiteSpace: 'nowrap'"));
console.log('4. width: max-content present:', footer.includes("width: 'max-content'"));
console.log('5. maxWidth: none present:', footer.includes("maxWidth: 'none'"));
console.log('6. Contact Us column has lg:col-span-4 xl:col-span-4:', footer.includes('lg:col-span-4 xl:col-span-4'));
console.log('7. Grid columns sum to 12 (3+3+2+4):', 
  footer.includes('lg:col-span-3 xl:col-span-3') && 
  footer.includes('lg:col-span-2 xl:col-span-2') && 
  footer.includes('lg:col-span-4 xl:col-span-4')
);
console.log('8. Overflow hidden on footer:', footer.includes('overflow-hidden'));
