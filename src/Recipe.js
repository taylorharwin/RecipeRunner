const _ = require('lodash');

const mockData = require('./mockData');

const isIngredientOrOperator = /\[(.*?)\]|\-|\*|\+|\/|[0-9]+/g;

const supportedOperators = {
	'+': 1,
	'-': 1,
	'*': 2,
	'/': 2
}

function Recipe(recipe){
	if (!recipe || recipe.formula === undefined){
		throw new Error('requires a recipe with a formula');
	}

	this.formula = recipe.formula;
	this.ingredients = recipe.ingredients;

	this.infixFormula = this.extractFormulaValues(this.formula, this.ingredients);
	this.postfixFormula = this.infixToPostFix(this.infixFormula);
}

Recipe.prototype.extractFormulaValues = function(formula, ingredients){
	formula = formula.match(isIngredientOrOperator);


	return _.map(formula, function extractValue(formulaValue){
		if (formulaValue[0] === '['){
			formulaValue = formulaValue.slice(1, -1);
			var ingredientIndex = _.findIndex(ingredients, {name: formulaValue});
			return {
				ingredientName: formulaValue,
				ingredientIndex: ingredientIndex
			}
		}
		if (supportedOperators[formulaValue]){
			return {
				action: formulaValue,
			}
		}
		if (_.isNumber(parseInt(formulaValue, 10))){
			return {
				number: parseInt(formulaValue, 10)
			}
		}
	});
}

Recipe.prototype.getIngredientValue = function(ingredient, date){
	var ingredientReportedData = this.ingredients[ingredient.ingredientIndex].reported_data;
	return ingredientReportedData[date];
}


Recipe.prototype.infixToPostFix = function(infixFormula){
	var operatorStack = [];
	function lastActionInStack(){
		return _.get(_.last(operatorStack), 'action');
	}
		return _.reduce(infixFormula, function(output, step){
			if (step.number || step.ingredientName){
				output.push(step)
			}
			if (step.action){
				if (_.isEmpty(operatorStack)){
					operatorStack.push(step);
				} else {
					while (supportedOperators[lastActionInStack()] && (supportedOperators[lastActionInStack()] >= supportedOperators[step.action])){
						output.push(operatorStack.pop());
					}
				operatorStack.push(step);	
			}
		}
			return output;
		}, []).concat(_.reverse(operatorStack));
}

Recipe.prototype.value_for = function(date){

}




module.exports = Recipe;

