//DEPENDENCIES
// var mysql = require('mysql');
var icon = require("asciiart-logo");
var inquirer = require("inquirer");
var consoletable = require("console.table");
const chalk = require("chalk");
const log = console.log;


log(
    function logo({
        name: 'EMPLOYEE MANAGEMENT TRACKER',
        font: 'Fender',
        lineChars: 7,
        padding: 3,
        margin: 2,
        borderColor: 'green',
        logoColor: 'blue',
        textColor: 'pink',
    })
    .blankLine()
    .right("© beattygraphics")
    .blankLine()
    .render()
);
