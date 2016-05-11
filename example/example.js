
//Require the module
var Recipe = require('../src/Recipe.js');
//Get a formula and recipe object as a Javascript object
var mockData = require('./mockData.js').mockData1;

//Create an instance of a recipe using the data and assign to a variable
var exampleRecipe = new Recipe(mockData);

//Provide a date as a YYYY-MM-DD string to evaluate the formula for that date
var result = exampleRecipe.value_for('2015-02-28');  // 4907.89

//Returns undefined if no data is provided for any variable in a formula, and null if a null observation was recorded
var undefinedResult = exampleRecipe.value_for('1028-02-23'); // undefined
var nullResult = exampleRecipe.value_for('2014-11-30'); // null

console.log(result, undefinedResult, nullResult);

