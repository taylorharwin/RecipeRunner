const lodash = require('lodash')

const mockData = require('./mockData');

const isValueOrOperator = /\[(.*?)\]|\-|\*|\+|\/|[-.0-9]+/g;


function Recipe(recipe){
	if (!recipe || !recipe.formula){
		throw new Error('requires a recipe with a formula');
	}

	this.formula = recipe.formula;

	var formulaVars = this.formula.match(isValueOrOperator);
	console.log(formulaVars);




	
}



module.exports = Recipe;


var recipe = new Recipe(mockData);