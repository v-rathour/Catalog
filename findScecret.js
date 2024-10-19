const fs = require("fs");


fs.readFile("input1.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading input file:", err);
    return;
  }

  const input = JSON.parse(data);
  const secret = findSecret(input);
  console.log("The constant term (secret) is:", secret.toString());
});


function findSecret(input) {
  const n = parseInt(input.keys.n);
  const k = parseInt(input.keys.k);

  
  const points = [];

  
  for (let i = 1; i <= n; i++) {
    const index = i.toString();
    if (input[index]) {
      const base = parseInt(input[index].base);
      const value = input[index].value;
      const valueInt = baseToDecimal(value, base);
      points.push({ x: BigInt(i), y: valueInt }); 
    }
  }

  
  return lagrangeInterpolation(points, BigInt(0));
}


function baseToDecimal(value, base) {
  return BigInt(
    `0x${BigInt(`0b${parseInt(value, base).toString(2)}`).toString(16)}`
  );
}


function lagrangeInterpolation(points, x) {
  let result = BigInt(0);
  const n = points.length;

  for (let i = 0; i < n; i++) {
    let term = points[i].y;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const numerator = x - points[j].x;
        const denominator = points[i].x - points[j].x;
        term = (term * numerator) / denominator;
      }
    }
    result += term;
  }
  return result;
}
