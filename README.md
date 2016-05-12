# RecipeRunner

RecipeRunner is a Javascript module that provides an interface for evaluating mathematical strings. The strings are called "Formulas", the operands are called "Ingredients", and the data structure containing both is called a Recipe.

####  Ingredients can be:
  * Positive Integers: `1 + 10 / 3`
  * Variables in brackets: `'[distance] / [number of races]'`
    * Variables reference a mapping of dates to reported values.
    * Variables can be any string, with the exception of math operators and numbers
    * Reported values for a variable can be any number or 'null' 
#### Formulas can include:
  * Addition('+'), subtraction('-'), multiplication('*'), and division('/')
  * Formula steps can also be grouped with parentheses using any combination of integers and variables
    * `(1 + 1)(2 + 2)`
    * `([bugs] + [test cases]) / (2 * ([sprints]/[team]))`
    * An error will be thrown if the parentheses don't match
### How it works

The module operates on formula strings in three steps: First, a RegExp matches the supported tokens in the string and outputs an array (numbers, variables in brakcets, operators, and parentheses). Next, the tokens get formatted to indicate what type of action or value it represents. Finally, the array of tokens gets converted from its provided mathematical notation to reverse polish notation, where operators are at the end of any two values. This array is then evaluated for a given date, with variables replaced with their reported values. The class exposes prototype functions for each of these steps so that users can add more functionality, troubleshoot, etc..
  
  ## Installation and Running
  ##### (Node and npm are required)
The code and tests are organized as CommonJS modules. They were developed in Node 5.6.0, and there aren't any known reasons this would not work in older or newer versions of Node. It can also be used on the client with a bundler such as Browserify or Webpack.
  1. Clone this repository
  2. CD into repository and run `npm install`
      * (The dependencies for this project are lodash and jest)
  3. Require `src/Recipe.js` and invoke it as a constructor function with data (e.g, `var myRecipe = new Recipe(data)`)
  4. Call `myRecipe.valueFor(dateString)` to get the computed value for a date
  5. See the example data is example/ for an example of this usage. You can run the example from the command line with `node example/example.js`

  ## Tests

  Tests for Recipe.js are written using Jasmine syntax, and are run in Jest. The tests are located in the `/__tests__` directory. You can run them by typing `npm run test` in the command line at any level of the repository.

  ## Questions

  If you have any questions about this code, please reach out to me on Github, or Twitter at @taylorharwin