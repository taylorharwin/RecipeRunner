const _ = require('lodash');


function Recipe(recipe){
	if (!recipe || !recipe.formula){
		throw new Error('requires a recipe with a formula');
	}
	this.formula = recipe.formula;
	console.log(this.formula);
	
}

Recipe.prototype.


module.exports = Recipe;