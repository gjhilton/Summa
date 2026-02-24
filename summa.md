# Summa

Summa is a single page browser-based application for historians that allows users to perform calculations with old-style British money - pounds, shillings and pence, and which supports inout and output of amounts in roman numerals, as per early modern accounting practice.

Summa is implemented as a React app and is compiled to static files for serving from github pages.

## Step 0: bootstrapping the app

The preliminary task is to initialise a new React app using npm, Vite, PandaCSS, Prettier and ESLint.

PandaCSS, ESLint, Prettier and Vite comfiguration shoild be copied from Sharpie (another app in the same directory). 

## Step 1: display components

Make the following React components: 

- Button

- InputField (this is a text input with a superscript label, representing pounds, shillings or pence. this is where the user enters the amount). If a field cannot be parsed, is displays a red error state. Input may be in integers of roman numerals.

- Line (a Line is three fields -pounds, shillings and pence - representing a single complete user input. If a line contains a field with an error, it displays an error state. A line has a remove button.

- Field (analogous to InputField but read-only). output maybbe in integers or roman upnumerals acording to a state boolean.

- Total (analogous to a Line, a quantity in l/s/d but composed of non-editable Fields)

Fields and InputFieldd, Totals and Lines should share as much code and styling as possuble.

- Calculation (two or more Lines - presented vertically - with a total at the bottom). A calculation has a button to reset the whole calculation, and a button to add a new line.

All these components are purely functional dispoay components.

## Step 2 - comversions

Write functions to convert between

early modern roman <=> roman numerals

roman <==> integer

l,s,d <==> pence

these fucntions need exhaustive unit tests.

### Early modern accounts style
 
There are three aspects here:
 
### Letter equivalents

A first pass can be done by string replacement. 

For inputs, any instances of 'u'can be convered to 'v' and and instances of 'j' to 'i'.

For outputs we do always use v never u. For i vs j the rule is that the last i in any sequence of i's becomes a j. e.g:

i => j
ii => ij
iii => iij
xi => xj
ix => jx

### i as prefix

In conventional roman numerals, 4 is written as iv - in our version it can be input either as iv or as iiii (or as iiij).

It is always output as iiij.

### Casing

Convert all inputs to lowercase,

For outputs:
- x,v,i,j are always lowercase
- L, C, D, M are always uppercase

## Step 3: state components

A stateful component, CalculationData stores all state, and passes both state data and callbacks into the display tree.

### Callbacks

Callbacks should be passed into child components to handle the state of user inputs, and to allow addition of a new line of calculation, to allow removal of a line of calculation, and to allow clearing of the entire calculadion (ie reset to just two empty lines)

### State Data

The calculation comprises a number of lines.

Each line comprises:
 - error staus: true / false if any of the litersl values l,s,d cannot be parsed (not they ARE allowed to be empty, just not malformed - eg spaces, punctuation or alphabetical characters execept u,v,i,j,x,l,c,d,m and their uppercase equivalents
 - three literal string values: l,s,d in roman numerals as input by the user
 - three intermediate string values: l,s,d in roman numerals converted to a standard format
 - three intermediate integer values: l,s,d as arabic numerals
 - three integer values as pence equivalents: l,s,d 
 - one integer value as a sum of l,s,d pence equivalents
 - an operation - a string const: for now always +
 
These lines are summed into a grand total in pence.
 
This total in pence is then converted back into l,s,d, then back into roman numerals, then back into early modern accounts style. 
 

