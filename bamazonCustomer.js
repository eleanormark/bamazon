'use strict';

var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB",
});

connection.connect(function (err) {
    if (err) {
        console.log("whoops something went wrong");
        console.log(err);
    } else {
        console.log('Yay, we connected ' + connection.threadId)
    }

    connection.query('SELECT * FROM products', function (err, res) {
        if (err) {
            console.log('could not select data ', err);
            return;
        }

        // console.log(res);

        // for (var i = 0; i < res.length; i++) {
        // 	var row = res[i];
        // 	console.log(row.item_id +"|"+ row.product_name +"|"+ row.department_name +"|"+ row.price);
        // }


    });
});

//function to print all items to the console, uses npm module cli-table
function printTable(){
    //new cli-table
    var table = new Table({
        head: ['ID', 'Product', 'Category', 'Price']
        , colWidths: [10, 60, 20, 20]
    });

    //get all rows from the Products table
    connection.query('SELECT * FROM Products', function(err, res){
        if (err) throw err;

        //res is an array of objs
        //row format ['ID', 'Product', 'Category', 'Price']
        //add all of the rows to the cli-table
        res.forEach(function (row) {

            //table is an array
            table.push(
                [row.item_id, row.product_name, row.department_name,  '$'+ row.price]
            );
        });
        //log the table to the console
        console.log(table.toString());
    });
}

printTable();