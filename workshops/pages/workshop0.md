<!-- 
Interactive Data Visualisation Course
Workshop 0 - Web Development Introduction
Author: Pierre Le Bras
Version 1
-->

# Web Development Introduction

---

## Foreword

This pre-arrival activity serves as an introduction to Web Technologies and the development environment we will use throughout this course.

In this course, we will use 4 - closely related - languages:

 - HTML for the structure and content of web pages;
 - SVG for the structure and content of web graphics;
 - CSS for styling;
 - JavaScript for the logic, which will be the main emphasis.

It is strongly recommended that you go through the following exercises before the first workshop and prepare any question you might have about it.

At the bottom of this page, you will also find a reference document that you can download and use throughout this course, along with the several official documentation websites that will be linked.

### Objectives

We will cover SVG specifics during the workshops. In this activity, we will focus on the following points:

 - Setting up a development environment for this module;
 - Creating a basic HTML document;
 - Using basic CSS rules for styling;
 - Implementing and using JavaScript modules and classes.

## Development Environment

We will start by creating the basic development environment that each workshop and coursework in this course will be based on.

First, it is recommended that you download and install Visual Studio Code (or VSCode). This is a lightweight editor that comes with plenty of functionalities and extensions for web development (amongst other things, there are also official extensions for Python and Jupyter notebooks for example). You can download it from [this website](https://code.visualstudio.com/Download).

In your system, create a project root directory, that you can name `DataVis_code` for instance. Open this directory in VSCode by: 

 1. Launching VSCode;
 2. Clicking on `File` > `Open Folder`;
 3. Selecting your project directory in the prompt.

Then, open the Extension panel (on the left) and search for the `Live Server` extension and install it. You should then see a `Go Live` option at the bottom right of the editor. Clicking on it should open your browser, at the URL: `127.0.0.1:5500`.

![VSCode](../resources/img/VSCode.png)

This is called a **local HTTP Server**, which mimicks a real system that serves files over an HTTP protocol. Check [this page](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server#the_problem_with_testing_local_files) for more details on why this is important when testing websites.

> As an **alternative**, if you have another preferred development environment, feel free to use it. At the bottom of this page, you will find a python script (`server.py`) which will run a local server too. Make sure to save it in the `DataVis_code` directory. Of course, this requires you to have python installed. You can launch the server by double-click on the script or running `$ python server.py` in a terminal. Your test website will then be visible at the URL `localhost:8000`. You can use other local servers such as those offered by Node.js or PHP.

Next, we will create the application. Under the project root file, create the following:

- an `index.html` file, this would be the entry point of our application.
- a `scripts` directory, where we will add all the JavaScript files of our application, we can start with a `main.js` file.
- a `styles` directory, where we will add all the CSS files of our application, we can start with a `main.css` file.

You should now have the following structure:

```txt
|-- DataVis_code/
    |-- index.html
    |-- scripts/
    |   |-- main.js
    |-- styles/
        |-- main.css
```

## Testing the Environment

Let's add a few things to our HTML file to check everything works. A basic HTML document structure is as follows:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1920, initial-scale=1.0">
    <title>Page Title</title>

    <!-- Libraries and stylesheets imports -->
    
</head>
<body>

    <!-- Page body -->
    
</body>
</html>
```

This defines the **Document Object Model (DOM)** of the HTML page, i.e., the hierarchy of elements on the page. Let's add a few elements to the `body`:

 - A heading (`h1`) with any content;
 - A `div` element, containing 3 paragraphs (`p`), each with the content you wish to add.

With these elements added, the DOM now has an `h1` element, with a `div` sibling which has three `p` children.

Now, check your website in the browser. You should see the text that you have just added to the page. If not, make sure you reload the page with a clear cache (`Shift+F5` or `Ctrl+Shift+R`).

Next, open the **Web Console** by either right-clicking on the page and selecting *inspect* or typing `Ctrl+Shift+I`. Explore the web console to see what options it offers.

## Styling the Page

Now, we will work with CSS to add styles to our HTML elements.

The first thing to do is load our stylesheet `main.css` onto the HTML page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    ...

    <!-- Libraries and stylesheets imports -->
    <link rel="stylesheet" href="styles/main.css">
    
</head>
...
```

### CSS Selectors

In CSS, we can add style rules to specific elements by first *selecting* them and then writing the rules that apply to them. For example, if we add the following to `styles/main.css`, the element `h1` will be displayed in green:

```css
h1{
    color: green;
}
```

With *classes* and *ids*, we can refine our element selection. Let's add a class to one of the paragraphs and an id to another:

```html
<p>Paragraph 1</p>
<p class="myClass">Paragraph 2</p>
<p id="myId">Paragraph 3</p>
```

Note that ids must be unique, only one element can have a specific id. Classes however can be shared by several elements.

In the CSS file, that means we can add several specific rules for paragraphs, using `.` to indicate a class and `#` to indicate an id:

```css
p{
    color: tomato;
}
p.myClass{
    color: teal;
}
p#myId{
    color: goldenrod;
}
```

Now, while the default for paragraphs is to be in red, specifics apply to the paragraphs with the class `myClass` and to the one paragraph with id `myId`.

You can read [this page](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) for more details about CSS Selectors.

### CSS Variables

Sometimes we might need to reuse several CSS values for different elements of our DOM. For this, we can use *variables*. A variable can be defined either in the scope of a specific DOM element or globally as part of the `:root` element.

Let's add a file in our styles directory dedicated to storing these global variables, `vars.css` for example. In it, we will select the `:root` element and declare colour variables within it:

```css
:root{
    --main-color: #222222;
    --accent-color: #e5233f;
}
```

We then need to *import* this file into our `main.css` stylesheet to be able to use these variables:

```css
@import 'vars.css';

h1{
    color: var(--main-color);
}

p{
    color: var(--main-color);
}
p.myClass{
    color: var(--accent-color);
}
```

Variables don't just apply to colours, but any CSS properties. For example, fonts are another typical example of properties you might need to reuse several times. In the example below, fonts are imported from Google Fonts and then declared as variables:

```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');

:root{
    ...
    --font-text: 'Open Sans', sans-serif;
    --font-title: 'DM Serif Display', serif;
}
```

We can then use those where we want in `main.css`:

```css
...
h1{
    color: var(--main-color);
    font-family: var(--font-title);
}

p{
    color: var(--main-color);
    font-family: var(--font-text);
}
...
```

By opening the *Web Console* to the *Elements* tab, you can select elements of the DOM, inspect the styles applied to those and even preview style changes.

Using *imports* can be quite advantageous. For example, you might have several stylesheets, each dedicated to one aspect of your page (text, layout, input, etc.) or later on one per visualisation. You can then centralise them all into the `main.css` stylesheet. Note that, just like when loading several stylesheets into an HTML document, the order in which you import several stylesheets matters.

## JavaScript

Now let's dive into the core programming language of this module: JavaScript. First, lets load `main.js` into the HTML page:

```html
<body>
    ...

    <script type="module" src="scripts/main.js"></script>
    
</body>
```

The `type="module"` will become important later when we deal with JavaScript modules. Inside `main.js` we will add the following sample code:

```js
'use strict';               // to prevent us from overwriting important variables

const c = 'constant';       // a constant value, assignment to c is no longer allowed

let v = 'variable';         // a primitive variable

let a = [1, 2, 3, false];   // an array

let o = {                   // an object
    'key1': 1,
    'key2': 'something'
};

console.log(c);
console.log(v);
console.log(a);
console.log(o);
console.log(o['key1']);
console.log(o.key2);
```

Open the *Web Console* to the *Console* tab to inspect the log operations.

### Functions

There are several ways to declare functions in JavaScript:

```js
function one(a, b){
    return a+b;
}
let two = function(a, b){
    return a+b;
}
let three = (a,b)=>a+b;
```

The last option is called an *arrow function*, which acts similarly to a lambda expression. One key difference with normal functions is that arrow functions lack a scope of their own.

Note that in JavaScript, functions are variables too. As such, writing `o['key3'] = two;` is valid, and means that `o.key3` now points to function `two` (check the Web Console to verify this!).

To call a function, one simply uses it and gives it parameters: `one(4,5)`. Note the difference between using a function reference `myFunc` and calling a function `myFunc()`.

You can also specify default values for the parameters, for example, `function one(a, b=6){...}`.

### Modules

Modules are a way for us to handle complexity in JavaScript applications. Put simply, a module is a JavaScript file that defines variables accessible to other modules.

For example, let's create a file in the `scripts` folder for Mathematical functions: `math.js`. This file will have two functions:

```js
function GCD(a, b){
    if(b===0) return a;
    return GCD(b, a%b);
}

function factorial(n){
    if(n===0) return 1;
    return n * factorial(n-1);
}
```

By prepending the keyword `export` in front of both of these functions, we are making this file a module. In turn, in `main.js`, we can import these functions like so:

```js
import {GCD} from './math.js';

console.log(GCD(84, 52));
```

We may even rename these imports:

```js
import {factorial as myFactorial} from './math.js';

console.log(myFactorial(5));
```

### Classes

JavaScript implements Object-Oriented features, which means that we can define classes. Create a new file in the `scripts` folder, called `Book.js`. In it we will create a class representing a book:

 - A book has a title and author.
 - A book has statuses, such as *reserved* and *onLoan*. These should be private.
 - A book has methods to reserve it, loan it and check if it's available.

Use the *Web Language Guide* document below to help you write this class, or check the [MDN Website](https://developer.mozilla.org/en-US/docs/Learn).

When your class is ready, prepend the keywords `export default` in front of `class` to turn it into a module. `default` means that the class is the only thing exported, and as such, we can import it as follow:

```js
import Book from './Book.js';
```

Instantiate several books and print them to the Web Console for inspection.

Refering to the *Web Language Guide* document, or the [MDN Website](https://developer.mozilla.org/en-US/docs/Learn), create a new class, `ComicBook`, which extends the class `Book` with an additional property for its illustrator.

## Wrapping Up
Ahead of the first workshop, check the following points:

 - You know what a local server is, and why it's important you use them.
 - You can program HTML, CSS and JavaScript and test/inspect your programs in a web browser and its web console.
 - You know what the DOM is.
 - You know what CSS Selectors are.
 - You know how to import CSS stylesheets.
 - You can declare variables, constants and functions in JavaScript.
 - You know the difference between an array and an object.
 - You know what JavaScript modules are and how to implement them.
 - You can implement Object-Oriented programs in JavaScript.

If any of the above is unclear make sure to ask for precision during the workshop.