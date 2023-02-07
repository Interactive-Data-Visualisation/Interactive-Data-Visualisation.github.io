<!-- 
SET09123 Interactive Data Visualisation 
Practical 5 - Data Operations
Author: Pierre Le Bras
Version 1
-->

# Data Operations

---

## Foreword

Please keep in mind that **as you progress through the practicals, you are building your way towards your coursework submissions**. You must attend the practical sessions to receive feedback and guidance on how to improve your code. In the same spirit, please ask for help if you get stuck at any point. JavaScript and D3 have steep learning curves and you shouldn't leave things to the last minute.

You should keep working on the same project started in the previous practicals. If you have not completed previous practicals please do so before starting this one.

In this practical, we will focus less on visualisations and more on the data management side of things.

### Objectives

By the end of this practical you should be able to:

 - Load data from a CSV file onto your visualisation application;
 - Understand and apply the JavaScript native *`map`*, *`filter`* and *`reduce`* data operations;
 - Know the native JavaScript *`Array`*, *`Set`* and *`Map`* data structures;
 - Understand and apply the data operations provided by [`d3-array`](https://github.com/d3/d3-array);
 - Implement various methods able to format and refine a large data set into suitable inputs for your visualisations.

## Loading Data

In this practical, we will be using the data from the `sales.csv` file on Moodle. This data is a fictitious example of sales records from a company.

Add this file to your application folder, under a directory called `data`.

The first task is then to load this data into our application. D3 provides a [module dedicated](https://github.com/d3/d3-fetch) to this purpose. Amongst other data formats (JSON, TSV, XML, text, ...), this module has a method to load CSV formatted data: `d3.csv()`.

This method can take two parameters. The first one is the URL of the data file to load. The second is a function that lets you preprocess the data, akin to the map callbacks we have already seen.

By default, the CSV data would have been formatted such that:

```
col1,col2,col3
1,lorem,true
2,ipsum,false
3,dolor,true
```

Becomes:

```
[{col1:'1',col2:'lorem',col3:'true'},
 {col1:'2',col2:'ipsum',col3:'false'},
 {col1:'3',col2:'dolor',col3:'true'}]
```

As you can see, everything gets parsed as a string. The formatter function lets you refine this automated processing, change the data types, and even compute new attributes for each entry:

```
d3.csv('data/sales.csv', d=>{
    return {
        location: d.location,                           // unchanged
        client: d.client,                               // unchanged
        salesrep: d.salesrep,                           // unchanged
        paid: d.paid === 'Yes',                         // parsed to bool
        reimbursed: d.reimbursed === 'Yes',             // parsed to bool
        sales: parseInt(d.sales),                       // parsed to int
        expenses: parseInt(d.expenses),                 // parsed to int
        profits: parseInt(d.sales)-parseInt(d.expenses) // new attribute
    }
})
```

The method (and all other methods from the [d3-fetch module](https://github.com/d3/d3-fetch)) returns a *Promise*. As JavaScript is a language often dealing with remote systems and processes, it implements several features to handle asynchronous calls, i.e., methods where the timing of outcomes is unknown. Promises are such a feature. Essentially they provide a way to chain future operations, using the `.then` method:

```
d3.csv('data/sales.csv', d=>{ ... })
    .then(dataset=>{
        // execute only when the full dataset has been fetched
        console.log(dataset);
    })
```

Implement the above in `main.js` and check the data you fetch in the Web Console.

## Data Operations

The rest of this practical is set up as a list of questions about the sales dataset. You should research and use data operations to answer these (print the operations' results in the Web Console).

Some resources to check first:
 - The MDN documentation for JavaScript [Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [Sets](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) and [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
 - The [`d3.array` module documentation](https://github.com/d3/d3-array).

Dataset Questions:

 1. Find the lists of unique Sales Rep, Locations and Clients.
 2. Find the number of sales for which payment has been received. 
 3. Group the dataset entries by Sales Rep and then Locations.
 4. Group the dataset entries by Client and then Locations and get the number of entries in each group.
 5. Distribute the entries into 10 equally-sized categories based on the Expenses values.
 6. Get the average Sales value per Location.
 7. Get the maximum Expenses value by Sales Rep and Location.
 8. Get the total reimbursed Expenses value by Sales Rep.
 9. Find the Client and Sales value of the entry with the highest Sales in Glasgow.
 10. Get a new array of entries, with the names of Sales Rep and their reimbursement percentage (reimbursed expenses / total expenses).
 11. Get the entry with a Sales value closest to £3,456 in Aberdeen.
 12. Get the entry that appears both in the top 10 sales done in Inverness and the top 10 sales done by James (by Sales value).

## Wrapping Up

Before leaving this practical, check that you have understood the following points:

 - Using Maps, Sets and Arrays, and navigating between them.
 - Using `map` and `filter` to transform your data.
 - Using `group`, `rollup` and `bin` to aggregate your data.
 - Combining the above to create dataset for your visualisations.

Please make sure to check the D3 documentation for [arrays](https://github.com/d3/d3-array), and the MDN documentations for [Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [Sets](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) and [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

## Self Study Activity

If you have not completed this practical, please do so by the next session. You should then have a look at the activity below.

It's best practice to compartmentalise your code as much as possible. Like we created separate files where we define the visualisation class, you should have a separate file in which you can define a class responsible for keeping and handling your data.

This class should:

 1. Load and hold the data set for the visualisations;
 2. Provide methods returning refined subsets of the data that can then be visualised by the visualisations.

**Note** - This data management class will be specific to the sales data example we used in this practical. You will have to create a different one for your coursework.

### Some Pointers

When using an asynchronous method inside another, you can return the asynchronous method, in order to chain `.then()` in other parts of your code. For example:

```
// file A.js

export default class A {

    #property;

    test(){
        return asyncFuntion()
            .then(()=>{
                this.#property = true;
            })
    }
}

// file B.js

import A from 'A.js'

A.test()
    .then(()=>{
        // do something in B scope
    })
```

Using the example above, you should be able, from `main.js`, to call the data manager `load` method and then implement code relying on the data being loaded in the `then()` callback.