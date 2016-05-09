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

	this.infixFormula = this.replaceFormulaElements(this.formula, this.ingredients);
	this.postfixFormula = this.infixToPostFix(this.infixFormula);
}

Recipe.prototype.formatStep = function(step){
	if (step[0] === '['){
		step = step. slice(1, -1);
		return {
			ingredientName: step,
			ingredientIndex: _.findIndex(this.ingredients, {name: step})
		};
	}
	if (supportedOperators[step]){
		return {
			action: step
		};
	}
	if (_.isNumber(parseInt(step, 10))){
		return {
			number: parseInt(step, 10)
		};
	}
}

Recipe.prototype.replaceFormulaElements = function(formula){
	formula = formula.match(isIngredientOrOperator);
	return _.map(formula, this.formatStep.bind(this))
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
Recipe.prototype.evaluate = function(val1, val2, action){
	if (val1 === undefined || val2 === undefined){
		return undefined;
	}
	if (_.isNull(val1) || _.isNull(val2)){
		return null;
	}
	if (action === '+'){
		return (val2 + val1)
	}
	if (action === '-'){
		return (val2 - val1)
	} 
	if (action === '*'){
		return (val2 * val1)
	} 
	if (action === '/'){
		if (val1 === 0){
			throw new Error('attempted to divide by zero')
		} else {
			return (val2 / val1)
		}
	}
}
Recipe.prototype.value_for = function(date){
	var stack = [],
	boundProcessStep = _.bind(function(step){
		if (step.number){
			stack.push(step.number);
		} else if (step.ingredientName){
			stack.push(this.getIngredientValue(step, date));
		} else if (step.action){
			var op1 = stack.pop();
			var op2 = stack.pop();
			var result = this.evaluate(op1, op2, step.action);
			stack.push(result);
		}
	}, this);

	_.each(this.postfixFormula, boundProcessStep);

	if (stack.length > 1){
		throw new Error('there was an error processing the formula');
	} else {
		var last = stack.pop();
		if (_.isNumber(last)){
			return Math.round(last * 1e2) / 1e2;
		}
		return last;
	}
}

var r = new Recipe(mockData);
console.log(r.value_for('2015-02-28'))

module.exports = Recipe;

