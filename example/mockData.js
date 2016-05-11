var mockData1 = {
  "type": "recipe",
  "name": "Net Profit",
  "formula": "[Monthly Recurring Revenue] - [Monthly Expenses]",
  "ingredients": [
    {
      "type": "ingredient",
      "name": "Monthly Recurring Revenue",
      "reported_data": {
        "2015-02-28": 14257.34,
        "2015-01-31": 11935.02,
        "2014-12-31": null,
        "2014-11-30": 10924.65,
        "2014-10-31": 9019.79,
        "2014-09-30": 9631.13,
        "2014-08-31": 7013.60
      }
    },
    {
      "type": "ingredient",
      "name": "Monthly Expenses",
      "reported_data": {
        "2015-02-28": 9349.45,
        "2015-01-31": 9023.08,
        "2014-12-31": 8746.02,
        "2014-11-30": null
      }
    }]
};

var mockData2 = {
  "type": "recipe",
  "name": "Net Profit",
  "formula": "([distance] - [time]) / [rate]",
  "ingredients": [
    {
      "type": "ingredient",
      "name": "distance",
      "reported_data": {
        "2015-02-28": 50,
        "2015-01-31": 5,
        "2014-12-31": 10,
        "2014-11-30": 3,
        "2014-10-31": 6,
        "2014-09-30": 9,
        "2014-08-31": 10000
      }
    },
    {
      "type": "ingredient",
      "name": "time",
      "reported_data": {
        "2015-02-28": 50,
        "2015-01-31": 1000,
        "2014-08-31": 2500,

      }
    },
    {
      "type": "ingredient",
      "name": "rate",
      "reported_data": {
        "2015-02-28": 1,
        "2015-01-31": 0.24,
        "2014-12-31": 0.34,
        "2014-11-30": 0.001,
        "2014-10-31": 1,
        "2014-09-30": 1.2,
        "2014-08-31": 2
      }
    }
  ]
};

module.exports = {
  mockData1: mockData1, 
  mockData2: mockData2
};