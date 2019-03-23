const bits = (n, b = 32) => {
   let resp = [];
   for (let i = 0; i < b; i++) {
      resp.push((n >> i) & 1);
   }
   /*  Array(8).forEach((x, i) => {
      console.log((n >> i) & 1);
      resp.push((n >> i) & 1);    
   }); */

   return resp;
};


const bits2 = (n, b = 32) => {
   return Array(b).fill(0).map((x, i) => (n >> i) & 1)
};

console.log(bits2(122, 8));