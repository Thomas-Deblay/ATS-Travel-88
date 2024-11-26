const response = await fetch('./js/containerLVMH.json');
const container = await response.json();

console.log(container)