const lodash = require('lodash')

const mockData = require('./mockData');

const isFormulaVariable = new RegExp(/\[(.*?)\]/);
const isOperator = new RegExp(/\-|\*|\+|\//);
const isValue = new RegExp(/[-.0-9]/);
const isPartOfFormula = new RegExp(isFormulaVariable.source + "|" + isOperator.source + "|" + isValue.source);


function Recipe(recipe){
	if (!recipe || !recipe.formula){
		throw new Error('requires a recipe with a formula');
	}

	this.formula = recipe.formula;

	var formulaVars = this.formula.match(isPartOfFormula);
	console.log(formulaVars);




	
}



module.exports = Recipe;


var recipe = new Recipe(mockData);