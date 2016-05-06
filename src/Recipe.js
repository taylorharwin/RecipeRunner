const lodash = require('lodash')

const mockData = require('./mockData');

const isValueOrOperator = /\[(.*?)\]|\-|\*|\+|\/|[-.0-9]+/g;


function Recipe(recipe){
	console.log(recipe);
	if (!recipe || recipe.formula === undefined){
		console.log('err');
		throw new Error('requires a recipe with a formula');
	}
	this.formula = recipe.formula;
	this._formulaVars = this.formula.match(isValueOrOperator);
}



module.exports = Recipe;


