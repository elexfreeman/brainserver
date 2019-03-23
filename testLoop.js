const size = 100000;
const loop_size = 100
let c;
let b;
let a = Array(size).fill(10);
let start, end;
console.log('>>> Start <<<')
start = new Date().getTime();
for (let j = 0; j < loop_size; j++) {
   let b = a.map((v, k) => {
      return v * k;
   });
}
end = new Date().getTime();
console.log(`First: ${(end - start)/1000}sec`);
/* ***************************************** */
start = new Date().getTime();
for (let j = 0; j < loop_size; j++) {
   for (let i in a) {
      b = a[i] * i;
   }
}
end = new Date().getTime();
console.log(`Second: ${(end - start)/1000}sec`);
/* ***************************************** */
start = new Date().getTime();
for (let j = 0; j < loop_size; j++) {
   for (let i = 0; i < a.length; i++) {
      b = a[i] * i;
   }
}
end = new Date().getTime();
console.log(`Therd: ${(end - start)/1000}sec`);



