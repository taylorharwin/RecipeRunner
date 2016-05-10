jest.disableAutomock();

var Recipe = require('../src/Recipe.js');
var mockData = require('./mockData.js');
var _ = require('lodash');

describe('the recipe runner', function(){
	var getFormulaForCalculation;
	beforeEach(function(){
		getFormulaForCalculation = function getFormulaForCalculation(recipe){
				var rec = new Recipe({
					formula: recipe.formula,
					ingredients: recipe.ingredients
				});
				return rec.replaceFormulaElements(rec.formula, rec.ingredients);
			};
	});
	it('requires at least a recipe as an input', function(){
		expect(function(){new Recipe();}).toThrow();
		expect(function(){new Recipe({formula: undefined});}).toThrow();
	});

	describe('when converting a formula string to an array of steps', function(){
		var ingredients;

		beforeEach(function(){
			ingredients = [{name: 'a'},{name: 'b'},{name: 'c'},{name: 'd'},{name: 'e'}];
		});

		it('stores references to the variables that are ingredients', function(){
			var formulaVars = getFormulaForCalculation(mockData);
			expect(formulaVars[0]).toEqual({ingredientIndex: 0, ingredientName: "Monthly Recurring Revenue"});
			expect(formulaVars[2]).toEqual({ingredientIndex: 1, ingredientName: "Monthly Expenses"});
		});

		it('matches number string ingredients and converts them to integers', function(){
			var formulaVars = getFormulaForCalculation({
				formula: '1 * 10000000000 + 33 / 0'
			});
			expect(formulaVars[0]).toEqual({number: 1});
			expect(formulaVars[2]).toEqual({number: 10000000000});
			expect(formulaVars[4]).toEqual({number: 33});
			expect(formulaVars[6]).toEqual({number: 0});
		});

		it('matches mathematical operators', function(){
			var formulaVars = getFormulaForCalculation({
				formula:'[a]+[b] * [c] /[d]- [e]',
				ingredients: ingredients
				});
			expect(formulaVars[1]).toEqual({action: '+'});
			expect(formulaVars[3]).toEqual({action: '*'});
			expect(formulaVars[5]).toEqual({action: '/'});
			expect(formulaVars[7]).toEqual({action: '-'});
		});

		it('matches parentheses', function(){
			var formulaVars = getFormulaForCalculation({
				formula:'((1+2)/3)+([c]-[d])',
				ingredients: ingredients
				});
			expect(formulaVars[0]).toEqual({grouper: '('});
			expect(formulaVars[1]).toEqual({grouper: '('});
			expect(formulaVars[5]).toEqual({grouper: ')'});
			expect(formulaVars[8]).toEqual({grouper: ')'});
			expect(formulaVars[10]).toEqual({grouper: '('});
			expect(formulaVars[14]).toEqual({grouper: ')'});
		});

		it('excludes unsupported operators', function(){
			formulaVars = getFormulaForCalculation({
				formula: '[a] x [b] dividedBy [c] & [d] % [e]',
				ingredients: ingredients
			});
			expect(formulaVars.length).toEqual(5);
			_.each(formulaVars, function(fv, ind){
				expect(fv.ingredientName).toEqual(ingredients[ind].name);
			});

		});
	});

	describe('when preparing to do math on an array of steps', function(){
		it('converts infix input to postfix output', function(){
			var mixed = getFormulaForCalculation({
				formula: '1 / 2 - 3 * 4 + 5'
			});
			var adding = getFormulaForCalculation({
				formula: '1 + 1 + 1'
			});
			var dividing = getFormulaForCalculation({
				formula: '[cat] / [dog] / [bird]',
				ingredients: [{name: 'cat'},{name: 'bird'}, {name: 'dog'}]
			});

			expect(Recipe.prototype.infixToPostFix(mixed)).toEqual([
				{number: 1},
				{number: 2},
				{action: '/'},
				{number: 3},
				{number: 4},
				{action: '*'},
				{action: '-'},
				{number: 5},
				{action: '+'}
				]
			)
			expect(Recipe.prototype.infixToPostFix(adding)).toEqual([
				{number: 1},
				{number: 1},
				{action: '+'},
				{number: 1},
				{action: '+'}
				]
				);
			expect(Recipe.prototype.infixToPostFix(dividing)).toEqual([
				{ingredientIndex: 0, ingredientName: 'cat'},
				{ingredientIndex: 2, ingredientName: 'dog'},
				{action: '/'},
				{ingredientIndex: 1, ingredientName: 'bird'},
				{action: '/'}
				]);

		});

	});
	describe('when getting a formula ingredient value for a given date', function(){
		var rec,
			ingredients;
		beforeEach(function(){
 			rec = new Recipe(mockData);
			ingredients = _.filter(rec.infixFormula, function(step){
				return step.ingredientName;
			});
		});

		it ('reports the value at that date for the ingredient if one exists', function(){
			expect(rec.getIngredientValue(ingredients[0],'2015-02-28')).toBe(14257.34);
			expect(rec.getIngredientValue(ingredients[1],'2015-02-28')).toBe(9349.45);
		});

		it ('reports null if value is reported value is null', function(){
			expect(rec.getIngredientValue(ingredients[0],'2014-12-31')).toBe(null);
			expect(rec.getIngredientValue(ingredients[1],'2014-11-30')).toBe(null);
		});
		it ('reports undefined if no value is available', function(){
			expect(rec.getIngredientValue(ingredients[0],'1999-12-31')).toBeUndefined();
			expect(rec.getIngredientValue(ingredients[1],'1204-2-4')).toBeUndefined();
		});
	});
	describe('when running a formula for a given date', function(){
		var rec1;
		var rec2;
		beforeEach(function(){
 			rec = new Recipe(mockData);
 			rec2 = new Recipe({formula: '1 + 1 / 2 + 2'});
		});

		it ('computes values according to the recipe', function(){
			var expected = parseFloat((14257.34 - 9349.45).toFixed(2));
			expect(rec.value_for('2015-02-28')).toEqual(expected);
		});
		it('computes values when no ingredients are variables', function(){
			expect(rec2.value_for()).toEqual(1 + (1/2) + 2);
		});
		it ('returns null if a value is not present in ingredients', function(){
			expect(rec.value_for('2014-11-30')).toEqual(null);
			expect(rec.value_for('2014-12-31')).toEqual(null);
		});
		it ('returns undefined if a value is not present', function(){
			expect(rec.value_for('1977-2-3')).toEqual(undefined);
			expect(rec.value_for('1203-3-2')).toEqual(undefined);
		});
	});
	describe('when running a formula with parenteses', function(){
		var rec,
			rec2,
			rec3,
			rec4;
			beforeEach(function(){
 			rec = new Recipe({formula: '(1 + 1)/(2 + 2)'});
 			rec2 = new Recipe({formula: '((1 / 4) * 4) + (1 - (1 / (1 / 3)))'});
 			rec3 = new Recipe({formula: '100 / 100 / (100 / (1/100)'});
 			// rec4 = new Recipe({formula: '(1 + 2))'});
		});

		it ('computes values according to the recipe', function(){
			var expected1 = (1 + 1)/(2 + 2);
			var expected2 = ((1 / 4) * 4) + (1 - (1 / (1 / 3)));
			var expected3 = Math.round((100 / 100 / (100 / (1/100)) * 1e2) / 1e2);
			expect(rec.value_for()).toEqual(expected1);
			expect(rec2.value_for()).toEqual(expected2);
			expect(rec3.value_for()).toEqual(expected3);
			// expect(rec4).toEqual('');

		});
	
	});

});