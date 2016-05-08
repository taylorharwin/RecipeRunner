const _ = require('lodash')

const mockData = require('./mockData');

const isIngredientOrOperator = /\[(.*?)\]|\-|\*|\+|\/|[-.0-9]+/g;


function Recipe(recipe){
	if (!recipe || recipe.formula === undefined){
		throw new Error('requires a recipe with a formula');
	}

	this.formula = recipe.formula;
	var formulaArray = this.formula.match(isIngredientOrOperator);

	this.formulaForCalculation = _.map(formulaArray, function extractBracketedValues(formulaVar){
		if (formulaVar[0] === '['){
			formulaVar = formulaVar.slice(1, -1);
		}
		return formulaVar;
	});


	
}



module.exports = Recipe;

