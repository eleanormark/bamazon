'use strict';

var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

//new cli-table
var inventoryTable = new Table({
    head: ['ID', 'Product', 'Category', 'Price', 'quantity']
    , colWidths: [10, 40, 20, 20, 10]
});

var customerViewTable = new Table({
    head: ['ID', 'Product', 'Category', 'Price']
    , colWidths: [10, 40, 20, 20]
});

connection.connect(function (err) {
    if (err) {
        console.log("whoops something went wrong");
        console.log(err);
    } else {
        // console.log('Yay, we connected ' + connection.threadId)
        createTables(printConsumerViewTable,promptConsumer);
    }
});

function createTables(callback1, callback2){
    //get all rows from the Products table
    connection.query('SELECT * FROM Products', function(err, res){
        if (err) throw err;

        //row format ['ID', 'Product', 'Category', 'Price']
        //add all of the rows to the cli-table
        res.forEach(function (row) {

            inventoryTable.push(
                [row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity]
            );

            customerViewTable.push(
                [row.item_id, row.product_name, row.department_name,  '$'+ row.price]
            );
        });
        callback1();
        callback2();

    });
}

function printConsumerViewTable (){
        //log the table to the console
        console.log(customerViewTable.toString());
}

function promptConsumer (){
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Enter item ID from the table: ',
            validate: function (value) {
                var value = parseInt(value);
                return value >= 1 && value < inventoryTable.length;
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'Enter quantity: ',
            validate: function (value) {
                var value = parseInt(value);
                return value >= 1
            }
        }

    ]).then(function (answers) {
        checkAndInventory(answers.item_id, answers.quantity);
    });

}

function checkAndInventory (id, quantity) {
    connection.query('SELECT * FROM Products WHERE item_id = ?', [id], function(err, res){
        if (err) throw err;

        var stockQuantity = res[0].stock_quantity;

        if (quantity <= stockQuantity) {

            connection.query('UPDATE PRODUCTS SET stock_quantity = stock_quantity - ? WHERE item_id = ?', [ quantity, id], function (err, res) {

            } );
        } else {
            console.log("Sorry, we have: " + stockQuantity + "in stock.");
        }
        createTables(printConsumerViewTable,promptConsumer);
    });

}



