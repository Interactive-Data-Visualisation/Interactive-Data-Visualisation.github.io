<!-- 
SET09123 Interactive Data Visualisation 
Practical 2 - D3 Selections
Author: Pierre Le Bras
Version 1
-->

# D3 Selections

---

## Foreword

Please keep in mind that **as you progress through the practicals, you are building your way towards your coursework submissions**. You must attend the practical sessions to receive feedback and guidance on how to improve your code. In the same spirit, please ask for help if you get stuck at any point. JavaScript and D3 have steep learning curves and you shouldn't leave things to the last minute.

You should keep working on the same project started in the previous practical.

In this practical, we will start building our interactive data visualisations. In particular, we will use the D3 Selection features to build basic bar charts and bubble charts.

### Objectives

By the end of this practical you should be able to:

- Use D3 Selection features to create elements of a Web page DOM;
- Use D3 Selection features to bind data and render simple SVG visualisations such as bar charts and bubble charts;
- Use D3 Selection features and CSS to add styles to the SVG visualisations;
- Implement reusable chart modules by using basic JavaScript class and module features.

## Adding D3 to our Page

In your `app` folder, add a sub-directory called `libs`. Download the D3 library file from the Moodle page and copy it inside this `libs` folder.

In the `head` of `index.html` add the following line:

```
<script src="libs/d3.v7.min.js"></script>
```

## Step 1 - Building the App Skeleton

Before we can add any kind of visualisation to our web page, we must make the necessary preparations. Essentially, we need to ask ourselves: *where will the visualisations go?*

We could simply append them to the `body` element of the DOM. However, to help us with our dashboard design down the line, it is best to create one dedicated `div` element for each visualisation.

For now, we should add a `div` element for a bar chart and one for a bubble chart. To identify them, let's give them appropriate ids:

```
...
<body>

    <div id="bar1"></div>
    <div id="bubble1"></div>

    <script type="module" src="scripts/main.js"></script>

</body>
```

> ***Why are we loading our main script last?***
>
> *JavaScript is a just-in-time compiled language, as soon as it gets loaded, it gets executed. Since we will be selecting elements of our page in the main script, it's best to ensure they exist first. It's the same reason why we import all third-party libraries before loading our own scripts.*

Now let's turn to `scripts/main.js`, we will start with a clean state:

```
'use strict';
```

Our first step is to make a top-level D3 selection, from which we will select and/or append child selections. We will focus on the bar chart for now. To make a selection, we will use the `d3.select` method, passing the appropriate selector as a parameter:

```
let barContainer = d3.select('div#bar1');
```

We can then use `barContainer` as an access point to add an `svg` child element. This can be done with the `.append` selection method, which also returns the new child selection:

```
let barSvg = barContainer.append('svg');
```

Check the Web Console's Elements tab to see the created `svg` element.

We can now use this selection to manipulate the DOM and add attributes to our `svg`, namely, a `width`, `height` and `class`. This is done using the `.attr` selection method. This method returns the current selection (unless it's used to get the values of attributes). This means we can chain methods in our code:

```
let barSvg = barContainer.append('svg')
    .attr('width', 800)
    .attr('height', 500)
    .attr('class', 'barchart');
```

Check the Web Console to inspect the `svg` and its updated attributes.

Note that the `.attr` method completely overrides the attribute value. Hence, beware of accidentidally removing classes when you intend to merely add one. To prevent that, you should use the `.classed` method, which lets you toggle classes:

```
let barSvg = barContainer.append('svg')
    .attr('width', 800)
    .attr('height', 500)
    .classed('barchart', true);
```

We have now set up the necessary elements to get a bar chart going. Repeat this process for the bubble chart.

## Step 2 - Binding Data and Joining Elements

With the `svg` elements and selections in place, we can start drawing charts.

First, let's have some data. We will be using dog breed registration data from 2020 ([link](https://www.thekennelclub.org.uk/media-centre/breed-registration-statistics/)), weight and height were taken from Wikipedia. In `main.js` delacre the following data array:

```
let dogs = [{breed:'Golden Retriever', count:8653, weight: 39.5, height: 56},
    {breed:'Alaskan Malamute', count:261, weight: 36, height: 61},
    {breed:'Newfoundland', count:577, weight: 67.5, height: 68.5},
    {breed:'Siberian Husky', count:391, weight: 21.5, height: 55.5},
    {breed:'Shiba Inu', count:434, weight: 9, height: 38},
    {breed:'Keeshond', count:82, weight: 17.5, height: 44},
    {breed:'Australian Shepherd', count:255, weight: 24, height: 52},
    {breed:'Border Collie', count:1718, weight: 16, height: 51},
    {breed:'German Shepherd', count:7067, weight: 31, height: 60},
    {breed:'Swiss Shepherd', count:110, weight: 32.5, height: 60.5}]
```

Each entry is a record with 4 attributes: `breed` is the name of the dog breed, `count` is the number of registrations, `weight` is the average breed weight, `height` is the average breed height.

We will draw a bar chart that displays the number of registrations for each breed. Hence, we need a bar for each breed, with its height proportional to the breed's number of registration.

SVG allows the following [basic shapes](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes):

 - `rect` - Rectangles with one origin and two dimensions
 - `circle` - Circles with one origin and a radius
 - `ellipse` - Ellipses with one origin and two radii
 - `line` - Straight lines with two extrimity points
 - `polyline` - Compound straight lines with several points
 - `polygon` - Similar to `polyline` but also ensure the last point connects to the first
 - `path` - A complex element to let you draw any shape

Looking at this list, `rect` is the obvious candidate for us to draw bars. So we shall make a selection of all rectangles in our bar chart `svg`:

```
let bars = barSvg.selectAll('rect');
```

At this stage though, the selection is *empty*. There are no `rect` elements in the DOM yet, and we haven't created any. What we need to do is **bind** our data set to this selection, using the `.data` method, so that we can create and manipulate the `rect` element based on the data values:

```
let bars = barSvg.selectAll('rect')
    .data(dogs, d=>d.breed);
```

Note the `d=>d.breed` key function, providing an accessor to the selection to uniquely identify data entries.

> ***Accessor Functions***
>
> *D3 uses accessor functions a lot. An accessor function is typically use as parameter of other functions. It's a callback that should be use to help the method access particular values in data entries. Typically, D3 accessor functions have two parameters: the datum and its index `(d,i)=>{...}`.*

> ***Method Chaining***
>
> *Notice how we are calling `.data` directly after `.select`. In most cases, when using one of D3's methods, the method will return the object it was called from, allowing us to chain methods.*  

With our selection now bound to data, D3 would have internally created *enter*, *update* and *exit* sub-selections to help us add new `rect` elements needed, change old ones and remove old unnecessary ones. We can access those with the `.join` method:

```
let bars = barSvg.selectAll('rect')
    .data(dogs, d=>d.breed)
    .join(
        enter => ... ,
        update => ... ,
        exit => ...
    );
```

Accessing each sub-selection individually lets us customise how we want them to behave and be displayed upon creation or removal. For now, however, we will be using the default behaviour: simply add new elements and remove old unnecessary ones. For this we can use a shortcut:

```
let bars = barSvg.selectAll('rect')
    .data(dogs, d=>d.breed)
    .join('rect');
```

This is equivalent to:

```
let bars = barSvg.selectAll('rect')
    .data(dogs, d=>d.breed)
    .join(
        enter => enter.append('rect') , // create new elements
        update => update ,              // don't do anything
        exit => exit.remove()           // remove elements
    );
```

Inspect the Web Console to see how it has affected the page.

With the rectangles created, our next step is to set their attributes in accordance with the data. Four attributes matter for rectangles:

 - `x`: the rectangle origin (top left-hand corner\*) horizontal coordinate
 - `y`: the rectangle origin vertical coordinate
 - `width`: the rectangle width
 - `height`: the rectangle height

> *\*It's importnant to note that, **in SVG, the vertical axes goes from top to bottom**.*

We can set these attributes using the `.attr` method again. To give them a value based on the data, we should use an accessor function. For example:

```
let bars = barSvg.selectAll('rect')
    .data(dogs, d=>d.breed)
    .join('rect')
    .attr('x', (d, i)=>i*40+5)
    .attr('height', d=>d.count*0.25);
```

In the example above, bars will be positionned horizontally based on their index, every 40 pixels, with an offset of 5 pixels. They will also have their height based on their value of `count` (factored to have it fit inside the `svg`).

Add the other missing attributes:

 - the `width` should be 40 pixels (or any interval set with `x`)
 - the `y` coordinate should be the total SVG height minus the bar's height (to have aligned at the bottom of the chart)

Remember to check the Web Console and inspect elements in case of issues.

Replicate this work for the bubble chart. This time, you are looking to add `circle` elements, which require three attributes:

 - `cx` the origin (center point) horizontal coordinate
 - `cy` the origin vertical coordinate
 - `r` the radius

Have the horizontal coordinate based on the breed's `weight`, the vertical coordinate based on the breed's `height`, and the radius based on the breed's `count`. Remember to use factors to have all elements fit in the `svg`. 

## Step 3 - Styling

There are two ways we can style visualisation elements:

 - In CSS stylesheets
 - By editing their `style` attribute

Let's first look at editing the CSS stylesheets. We have to make sure we can match the right elements with CSS selectors. We will do so by adding classes to the bars:

```
let bars = barSvg.selectAll('rect.bar')
    .data(dogs, d=>d.breed)
    .join('rect')
    .classed('bar', true)
    ...
```

Note that we also updated the `.selectAll` method to reflect that change. Now we are only concerned with rectangle elements with the class `bar`.

Let's then move to our `styles/` folder. To make things clearer, we will have a dedicated stylesheet for bar chart visualisations, hence, we need to add an import statement in `main.css`:

```
@import 'vars.css';
@import 'barchart.css';
```

We can then create a new stylesheet `barchart.css`. In it, we will first add a rule for our top-level `svg` element:

```
svg.barchart {
    border: solid 1px #333;
}
```

This should add a border around the chart, making it easier to locate on the page.

> ***Quick Tip***
>
> *In the Web Console, when inspecting elements, you can check all the styles applying to them. You can even quickly add/remove styles in order to see how they would work on the page.*

Then we can add a rule for the bars themselves:

```
svg.barchart > rect.bar{
    fill: #4aba57;
    stroke: #16381a;
    stroke-width: 2px;
}
```

Check how this has changed the bar chart, on the page and in the Web Console. Make similar style changes for the bubble chart.

Using this approach is great to make global default style settings.

The other alternative is to change these styles with the D3 selections. This lets us use a more case-specific approach, where styles can be driven by the data.

Note that both techniques can be used simultaneously. Keeping the stylesheet, we can for example add a rule to make the bars red if the `count` value is below a certain threshold using the `.style` method:

```
let bars = barSvg.selectAll('rect.bar')
    .data(dogs, d=>d.breed)
    .join('rect')
    .classed('bar', true)
    ...
    .style('fill', d=>d.count<400?'#ba4a53':null)
    .style('stroke', d=>d.count<400?'#381619':null)
```

> ***Ternary Operators***
>
> *The JavaScript ternary operator takes the format: `condition?value_if_true:value_if_false`*

Note that some SVG elements can have the characteristic defined by attributes and styles. But, as anything with CSS styles, there is an order of priority:

 1. (top priority) local element `style` attribute
 2. last-defined global style in CSS stylesheet or `<style>` tag
 3. (least priority) element attribute

## Step 4 - Reusable Charts

Make sure you completed and understood the previous steps before starting this one.

Now that we have seen how to draw bar charts and bubble charts, we are going to make our code reusable. The goal is to be able to draw charts repeatedly:

```
// main.js

let data1 = [{k:'key1',v:400},{k:'key2',v:300},{k:'key3',v:200}];
let data2 = [{k:'catA',v:63},{k:'catB',v:54},{k:'catC',v:98},{k:'catD',v:87}];

let barchart1 = new BarChart('div#bar1', 800, 500);
let barchart2 = new BarChart('div#bar2', 600, 400);

barchart1.render(data1);
barchart2.render(data2);
```

Here are the steps you should follow, for both types of charts:

 - Create a dedicated JavaScript file for the visualisation.
 - Write a class for the visualisation.
 - Decide on the properties of that class, e.g.:
    - D3 selections
    - Size values
    - Data
 - Decide on the constructor parameters for the class, e.g.:
    - Container CSS selector
    - Width and height
 - Write the constructor of the class, which should set up the top-level `svg` element or any other global selection.
 - Write a `render` method in the class, which will take the dataset to render as a parameter, save it as a property and render the chart. Make sure to document the expected data format for the chart, e.g.:
    - `[{k:key,v:value},...]` for bar chart
    - `[{x:x_value,y:y_value,r:radius}, ...]` for the bubble chart
 - Make the class exportable.

Test these classes by importing them to `main.js`, creating instances of them and rendering data. Make sure that the data you render matches the format expected by your chart objects. You can use the `.map` method for this purpose ([link](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)). The `.map` method lets you create a new array based on an existing one. For example:

```
let array = [{A:'lorem',B:90,C:false},{A:'ipsum',B:54,C:true},
             {A:'dolor',B:112,C:true},{A:'sit',B:135,C:false}];

let array2 = array.map(d=>{return {X:d.A, Y:d.B}});

// array2 == [{X:'lorem',Y:90},{X:'ipsum',Y:54},
//            {X:'dolor',Y:112},{X:'sit',Y:135}]
```

The function you pass as the parameter of `.map` will be evaluated for each element of the existing array and appended to the new array.

## Wrapping Up

Before leaving this practical, check that you have understood the following points:

 - Making selections using the `.select` and `.selectAll` methods.
 - Binding data with the `.data` method.
 - Joining elements with the `.join` method.
 - Modifying elements with the `.attr`, `.style` and `.classed` methods.
 - Using accessor functions.

Please make sure to check the [D3 documentation for selections](https://github.com/d3/d3-selection).

## Self Study Activity

If you have not completed this practical, please do by the next session. You should then have a look at the activity below.

As we progress through our application development, we will find that extra information is often required on the chart, for example, axes and a title. As such, we will need to add margins between the edges of the top-level `svg` element and the actual chart area.

Before the next practical, try to do the following:

 - Research the SVG `g` element (the MDN documentation website is a good place to start)
 - Add a `g` element surrounding your charts' bars or bubbles, this would become your chart area
 - Modify your visualisation modules so that they can accept margin values for the chart
    - An array with top, bottom, left and right margin value is often the best approach
 - Use the `transform` SVG attribute to translate your chart area to the right position