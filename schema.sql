create database if not exists bamazonDB;

use bamazonDB;

create table if not exists products (
    item_id integer auto_increment not null,
    product_name varchar(80) not null,
    department_name varchar(80) not null,
    price double default 0.0,
    stock_quantity int default 0,
    primary key (item_id)
);

insert into products(product_name, department_name, price,stock_quantity)
values
('apple watch', 'electronics', 265.50, 100),
('samsung watch', 'electronics', 225.50, 100),
('macbook', 'electronics', 2225.00, 100),
('canon camera', 'electronics', 2885.00, 100),
('ruby', 'book', 15.75, 100),
('android', 'book', 17.75, 100),
('javaScript', 'book', 12.75, 100),
('tea', 'grocery', 3.75, 100),
('licorice', 'grocery', 2.75, 100),
('cookies', 'grocery', 5.75, 100);

select * from products;