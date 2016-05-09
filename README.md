# RecipeRunner

RecipeRunner is a node module that provides an interface for evaluating strings, called "Recipes" which represent mathematical operations. 
Recipes are made of operands called "Ingredients".
Ingredients can be either:
  - Positive Integers: '1 + 10 / 3'
  - References to variables in brackets: '[distance] / [speed]'
        - variables a references to a mapping of dates to values
        - dates are assumed to be in the format 'YYYY-MM-DD'
        - values can be any number or 'null'
        - variables may not have a value for every date
  - Recipes support addition('+'), subtraction('-'), multiplication('*'), and division('/')
  - Standard order of operations applies, and division by zero will error
  - Recipe steps can be grouped by parentheses
  
  ## Installation Instructions
  (Node and npm are required)
  
  - Clone this repository
  - CD into repository and run 'npm install'
  - Require 'src/Recipe.js' and invoke it as a constructor function with data (e.g, var myRecipe = new Recipe(data))
  - Call 'myRecipe.valueFor({dateString})' to get the computed value for a date
  - See the example data is example/ for an example of this usage
  
  
  
  

