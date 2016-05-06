const Recipe = require('./Recipe');
const readline = require('readline');
const mockData = require('./mockData.js');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var recipe = new Recipe(mockData);



  rl.close();



