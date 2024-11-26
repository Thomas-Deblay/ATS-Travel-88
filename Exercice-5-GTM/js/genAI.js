const response = await fetch('./containerLVMH.json');
const container = await response.json();

console.log(container)