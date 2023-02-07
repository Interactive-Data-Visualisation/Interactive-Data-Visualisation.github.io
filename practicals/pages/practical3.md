<!-- 
SET09123 Interactive Data Visualisation 
Practical 3 - D3 Scales and Axes
Author: Pierre Le Bras
Version 1
-->

# D3 Scales and Axes

---

## Foreword

Please keep in mind that **as you progress through the practicals, you are building your way towards your coursework submissions**. You must attend the practical sessions to receive feedback and guidance on how to improve your code. In the same spirit, please ask for help if you get stuck at any point. JavaScript and D3 have steep learning curves and you shouldn't leave things to the last minute.

You should keep working on the same project started in the previous practicals. If you have not completed previous practicals please do so before starting this one.

In this practical, we will enhance our bar and bubble charts with scales to make efficient use of the space available. We will then look at adding axes to the charts.

### Objectives

By the end of this practical you should be able to:

- Understand the scales provided in the [`d3.scale`](https://github.com/d3/d3-scale) module;
- Implement scale functions with suitable parameters;
- Apply scale functions to modify marks;
- Implement and display axes based on scales.

## Self Study Check

In the last practical, the self-study activity instructed you to create a `g` element as your chart area and use the `transform` attribute to position it in the `svg` element according to margin values.

Your visualisations' constructors should therefore look like this:

```
/*
  - container: DOM selector
  - width: visualisation width
  - height: visualisation height
  - margin: chart area margins [top, bottom, left, right]
*/
constructor(container, width, height, margin){

    this.width = width;
    this.height = height;
    this.margin = margin;

    this.svg = d3.select(container)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .classed('viz barchart', true);

    this.chart = this.svg.append('g')
        .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);
}
```

> ***String Template***
>
> *The JavaScript [String Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), or Template literals, let you invoke variable in the string that will get evaluated at run time and added in place in the string. We define them using backticks `` ` ` `` and add variables within `${}`.*

Your chart rendering method should then append elements to `this.chart`.

## Bubble Chart Scales

Our first task will be to implement scales in our bubble chart. Three scales are needed: one to position bubbles horizontally, one to position bubbles vertically and one to give them a radius.

Your first step should be to add properties to our class to store these scales.

Then, add a private method to the class, for example, `#updateScales(){ ... }`. The aim is to call this method at the start of the rendering process to create/update the scales before using them when drawing bubbles. As such we must call it inside the `render` method. Make sure to do so **after** saving the dataset, as we will need to access the dataset when defining our scales:

```
render(data){
    this.data = data;
    this.#updateScales();
    ...
}
```

### Defining Ranges

First, we will define all our scales' ranges, i.e., the bounds within which we can draw mark in our view:

 - the horizontal space available in our view
 - the vertical space available in our view
 - the desired minimum and maximum radii for the bubbles

The horizontal space should go from the left margin to the full width minus the right margin. However, because we will draw bubbles from the origin of the `g` chart area and because we have already translated this area, we don't need to worry about the margins anymore. The horizontal space, therefore, goes from `0` to the chart area width.

```
#updateScales(){

    let chartWidth = this.width-this.margin[2]-this.margin[3];

    let rangeX = [0, chartWidth];
}
```

We can make a similar reflection with the vertical space. However, remember that the vertical axis in SVG goes from top to bottom. Hence, if we want to draw bubbles from bottom to top, we should invert the bounds of your range:

```
#updateScales(){

    let chartWidth = this.width-this.margin[2]-this.margin[3],
        chartHeight = this.height-this.margin[0]-this.margin[1];

    let rangeX = [0, chartWidth],
        rangeY = [chartHeight, 0];
}
```

The bubble size range has more flexibility, it's up to you to decide how small and big you want bubbles to be in pixels. For example:

```
#updateScales(){

    let chartWidth = this.width-this.margin[2]-this.margin[3],
        chartHeight = this.height-this.margin[0]-this.margin[1];

    let rangeX = [0, chartWidth],
        rangeY = [chartHeight, 0],
        rangeR = [2, 25];
}
```

### Defining Domains

Then we will query the data to get the domains of our scales, i.e., the bounds matching the range bounds in the data world.

For placement scales (X and Y axes) you should preferably start from `0` and go all the way to the maximum value in your data. There are a couple of exceptions to this rule:
 - some of your values are negative, or
 - your values are high with low variance.

For now, we will go with a domain that starts at either `0` or the minimum value in the data and goes up to the maximum value in the data. To find the minimum or maximum values in an array of data, we can use the `d3.min` and `d3.max` functions:

```
let minV = d3.min(array, accessor);
let maxV = d3.max(array, accessor);
```

Note the native `Math.min` function in JavaScript that returns you with the minimum of two values given as parameters.

Hence, we can do the following:

```
#updateScales(){

    let chartWidth = this.width-this.margin[2]-this.margin[3],
        chartHeight = this.height-this.margin[0]-this.margin[1];

    let rangeX = [0, chartWidth],
        rangeY = [chartHeight, 0],
        rangeR = [2, 25];

    let domainX = [Math.min(0, d3.min(this.data, d=>d.x)), d3.max(this.data, d=>d.x)],
        domainY = [Math.min(0, d3.min(this.data, d=>d.y)), d3.max(this.data, d=>d.y)],
        domainR = [0, d3.max(this.data, d=>d.r)];
}
```

### Instantiating Scales

With the domains and ranges established, we can create our scales. We will use two types:

 - linear scales for the horizontal and vertical placements, and
 - a square root scale for the bubble sizes.

Remember to check the [D3 documentation](https://github.com/d3/d3-scale) to get a full description of the scales provided by D3.

To instantiate a scale, we typically just need to call the appropriate scale generator, giving the domain and range as parameters. We can also use the `.domain()` and `.range()` methods to update the domain and range after the scale has been instantiated.

```
#updateScales(){

    let chartWidth = this.width-this.margin[2]-this.margin[3],
        chartHeight = this.height-this.margin[0]-this.margin[1];

    let rangeX = [0, chartWidth],
        rangeY = [chartHeight, 0],
        rangeR = [2, 25];

    let domainX = [Math.min(0, d3.min(this.data, d=>d.x)), d3.max(this.data, d=>d.x)],
        domainY = [Math.min(0, d3.min(this.data, d=>d.y)), d3.max(this.data, d=>d.y)],
        domainR = [0, d3.max(this.data, d=>d.r)];

    this.#scaleX = d3.scaleLinear(domainX, rangeX);
    this.#scaleY = d3.scaleLinear(domainY, rangeY);
    this.#scaleR = d3.scaleSqrt(domainR, rangeR);
}
```

Note that we are saving these scales in private properties to reuse them in other methods. Make sure to have these properties declared in the class.

### Using the Scales

With the scales created, we can now change the code rendering bubbles to make use of them. We use a scale by calling it and giving a value from the domain, and it will return the associated value in the range:

```
let rangeV = scale(domainV);
```

When setting the attributes `cx`, `cy` and `r` of each bubble, rather than multiplying the data value with a factor, we can now use the scales:

```
...
.attr('cx', d=>this.#scaleX(d.x))
.attr('cy', d=>this.#scaleY(d.y))
.attr('r', d=>this.#scaleR(d.r))
...
```

Check how it has changed your bubble chart visualisation on the web page. Change the width and height of the SVG to see how the scales affect your display.

Investigate the `.nice()` scale option.

## Bar Chart Scales

Now let's update the bar chart code too.

 - Review the scales available in the [D3 documentation](https://github.com/d3/d3-scale).
 - Pick the scales you think are most appropriate for your bar chart.
 - Implement these scales as we did with the bubble chart.

## Axes

We have to inform users that our charts are using scales. The best way to do this is to render axes next to the chart area. Fortunately, D3 provides an easy solution for this, using the [d3.axis module](https://github.com/d3/d3-axis).

The first thing to do is create `g` elements in which the axes will be rendered. In the bubble chart properties and constructor add the necessary code for this (as we did for the chart area).

```
...
    this.chart = this.svg.append('g')
        .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);

    this.axisX = this.svg.append('g')
        .attr('transform, `translate(${this.margin[2]},${this.height-this.margin[1]})`);

    this.axisY = this.svg.append('g')
        .attr('transform, `translate(${this.margin[2]},${this.margin[0]})`);
}
```

Note that we are placing the x-axis at the bottom of the visualisation.

All that we have to do then, is create axis generators with the scales and pass these generators to the appropriate `g` elements. In the render function, after updating the scales, write the following:

```
...
let xAxis = d3.axisBottom(this.#scaleX),
    yAxis = d3.axisLeft(this.#scaleY);
this.axisX.call(xAxis);
this.axisY.call(yAxis);
```

Repeat the same procedure for the bar chart.

Investigate the axis `.ticks()` method.

## Wrapping Up

Before leaving this practical, check that you have understood the following points:

 - Creating domain and range bounds, notably with the `d3.min` and `d3.max` methods (and optionally the `d3.extent` method too).
 - Instantiating appropriate scales for your charts.
 - Using scales when rendering marks.
 - Rendering axes using scales.

Please make sure to check the D3 documentation for [scales](https://github.com/d3/d3-scale) and [axes](https://github.com/d3/d3-axis).

## Self Study Activity

If you have not completed this practical, please do so by the next session. You should then have a look at the activity below.

In this practical, we focused on scales with continuous ranges as a means to position marks. But D3 also provides scales with discrete ranges. One of which is the `d3.ordinal` scale.

Using such a scale allows us to uniquely map discrete data values to discrete channel values. For instance, one could ensure that each mark associated with a data category can be coloured consistently across visualisations.

In your visualisation classes:

 - Create a property `#scaleC` that defaults to `()=>'lightgray'`.
 - When rendering marks, add the following: `.style('fill',d=>this.#scaleC(d.c))`.
 - Add a public method that lets you change the property `#scaleC`. For best practice, make sure that it returns the object (`this`) in order to chain methods later.

In `main.js`:

 - Create a category domain, i.e., an array of unique categories, e.g. dog breeds from last week's dataset.
 - Create a colour range, i.e., a list of colours. You can also use one of D3's [preset](https://github.com/d3/d3-scale-chromatic).
 - Create an ordinal scale with this domain and range.
 - Update your visualisations' colour scale with this scale.
 - Make sure that the data your render contains an attribute `c` that is part of the colour scale domain. 