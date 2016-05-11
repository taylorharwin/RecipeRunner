# RecipeRunner

RecipeRunner is a node module that provides an interface for evaluating strings which represent math operations. 
The strings are called "Formulas"  and the operands called "Ingredients".
Ingredients can be either:
  * Positive Integers: `1 + 10 / 3`
  * References to variables in brackets: `'[distance] / [race]'`:
        * variables are references to a mapping of dates to reported values. Variables can be any string, but cannot any math operators
        * dates are in the format 'YYYY-MM-DD'
        * reported values can be any number or 'null' -- Any null reported value for a date will make that date evaluate to `null`
        * variables may not have a value for every date -- Any undefined reported value for a date will make that date evaluate to `undefined`
  * Formulas support addition('+'), subtraction('-'), multiplication('*'), and division('/')
  * Formula steps can also be grouped by parentheses with any combination of integers and variables
        * `(1 + 1)(2 + 2)`
        * `([bugs] + [test cases]) / 2`
  
  ## Installation Instructions
  (Node and npm are required)
  This was developed in Node 5.6.0, and there aren't any known reasons this would not work in older or newer versions.
  
  1. Clone this repository
  2. CD into repository and run `npm install`
      * (The dependencies for this project are lodash and jest)
  3. Require `src/Recipe.js` and invoke it as a constructor function with data (e.g, `var myRecipe = new Recipe(data)`)
  4. Call `myRecipe.valueFor(dateString)` to get the computed value for a date

  5. See the example data is example/ for an example of this usage

  ## Tests

  Tests for Recipe.js are written using Jasmine syntax, and are run in Jest. The tests are located in the __tests__ directory. You can run them by typing `npm run test` in the command line at any level of the repository.

  ##Questions

  If you have any questions about this code, please reach out to me on Github, or Twitter at @taylorharwin
  
  
  
  

