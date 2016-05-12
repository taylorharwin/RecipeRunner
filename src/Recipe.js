var _ = require('lodash');
var isIngredientOrOperator = /\[(.*?)\]|\-|\*|\+|\/|[0-9]+|\(|\)/g;
var supportedOperators = {
	'+': {
		weight: 1, 
		operate: function(num1, num2){
			return num1 + num2;
		}
	},
	'-': {
		weight: 1, 
		operate: function(num1, num2){
			return num2 - num1;
		}
	},
	'*': {
		weight: 2, 
		operate: function(num1, num2){
			return num1 * num2;
		}
	},
	'/': {
		weight: 2, 
		operate: function(num1, num2){
			return num2 / num1;
		}
	}
};
var supportedGroupers = {
	'(': '(',
	')': ')'
};

function Recipe(recipe){
	if (!recipe || recipe.formula === undefined){
		throw new Error('requires a recipe with a formula');
	}
	this.formula = recipe.formula;
	this.ingredients = recipe.ingredients;
	this.infixFormula = this.replaceFormulaElements(this.formula);
	this.postfixFormula = this.infixToPostFix(this.infixFormula);
}

Recipe.prototype.replaceFormulaElements = function(formulaSteps){
	formulaSteps = formulaSteps.match(isIngredientOrOperator);
	return _.map(formulaSteps, this.formatStep.bind(this));
};

Recipe.prototype.formatStep = function(step){
	if (_.first(step) === '['){
		step = step.slice(1, -1);
		return {
			ingredientName: step,
			ingredientIndex: _.findIndex(this.ingredients, {name: step})
		};
	} if (supportedOperators[step]){
		return {
			action: step
		};
	} if (supportedGroupers[step]){
		return {
			grouper: step
		};
	} if (_.isNumber(parseInt(step, 10))){
		return {
			number: parseInt(step, 10)
		};
	}
};

Recipe.prototype.getIngredientValue = function(ingredient, date){
	var ingredientReportedData = _.get(this.ingredients[ingredient.ingredientIndex], 'reported_data');
	if (_.isUndefined(ingredientReportedData)){
		throw new Error('there is no ingredient reported data for ' + ingredient);
	}
	if (_.has(ingredientReportedData, date)){
			return ingredientReportedData[date];
	} 
};

Recipe.prototype.infixToPostFix = function(infixFormula){
	var operatorStack = [];

	function lastInStack(property){
		return _.get(_.last(operatorStack), property);
	}
		var infixOutput = _.reduce(infixFormula, function(output, step){
			if (step.number || step.ingredientName){
				output.push(step);
			} else if (step.action){
				if (_.isEmpty(operatorStack)){
					operatorStack.push(step);
				} else {
					while (supportedOperators[lastInStack('action')] && (supportedOperators[lastInStack('action')].weight >= supportedOperators[step.action].weight)){
						output.push(operatorStack.pop());
					}
				operatorStack.push(step);	
				} 
			} else if (step.grouper){
				if (step.grouper === supportedGroupers['(']){
					operatorStack.push(step);
				} else if (step.grouper === supportedGroupers[')']){
					var foundLeftParen = false;
					while (!foundLeftParen && !_.isEmpty(operatorStack)){
						if (lastInStack('grouper') !== supportedGroupers['(']){
							output.push(operatorStack.pop());
						} else {
							foundLeftParen = true;
							operatorStack.pop();
							break;
						}
					}
					if (!foundLeftParen){
						throw new Error('the parentheses are mismatched in the formula');
					}
				}
			}
			
			return output;
		}, []);
		if (_.findLast(operatorStack, function(operator){
			return _.has(operator, 'grouper');
		})){
			throw new Error('the parentheses are mismatched in the formula');
		}
		return infixOutput.concat(_.reverse(operatorStack));
};

Recipe.prototype.evaluate = function(val1, val2, action){
	if (val1 === undefined || val2 === undefined){
		return;
	} if (_.isNull(val1) || _.isNull(val2)){
		return null;
	}
	return supportedOperators[action].operate(val1, val2);
};
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
};

module.exports = Recipe;

