jest.disableAutomock();

const Recipe = require('../src/Recipe.js');
const mockData = require('./mockData.js');

describe('the recipe runner', function(){
	it('requires a recipe as an input', function(){
		expect(function(){new Recipe()}).toThrow();
	});

	describe('when converting a formula string to an array of steps', function(){
		var getFormulaVars;
		beforeEach(function(){
			getFormulaVars = function getFormulaVars(str){
				var recipe = new Recipe({
					formula: str
				});
				return recipe.formulaForCalculation;
			}
		});
		it('matches the variables that are ingredients', function(){
			var formulaVars = getFormulaVars(mockData.formula);
			expect(formulaVars[0]).toBe('Monthly Recurring Revenue');
			expect(formulaVars[2]).toBe('Monthly Expenses');
		});
		it('matches mathematical operators', function(){
			formulaVars = getFormulaVars('[a]+[b] * [c] /[d]- [e]');
			expect(formulaVars[1]).toBe('+');
			expect(formulaVars[3]).toBe('*');
			expect(formulaVars[5]).toBe('/');
			expect(formulaVars[7]).toBe('-');
		});
		it('excludes invalid operators', function(){
			formulaVars = getFormulaVars('[a] x [b] dividedBy [c] & [d] % [e]');
			expect(formulaVars).toEqual(['a','b','c','d','e']);

		})
	});

	describe('when preparing to do math on an array of steps', function(){

	});
	
});