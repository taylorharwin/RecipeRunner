var mockData = {
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
    }
  ]
};

module.exports = mockData;