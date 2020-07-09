DROP DATABASE IF EXISTS employeesDB;
CREATE database employeesDB;

USE employeesDB;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL(10,4),
  department_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE manager(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ('Engineering'),
('Sales'),
('Service'),
('Finance'),
('Legal'),
('HR');

INSERT INTO role (title,salary)
VALUES ('Sales Lead','200000.00'),
('Salesperson','150000.00'),
('Lead Engineer','85000.00'),
('Software Engineer','70000.00'),
('Account Manager','60000.00'),
('Accountant','50000.00'),
('Legal Team Lead','75000.00');

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ('Joe','Smith','1','1'),
('Bob','Williams','1','1'),
('Will','Stevens','1','1'),
('George','Rogers','1','1');

INSERT INTO manager (first_name,last_name)
VALUES ('Joe','Smith'),
('Bob','Williams');

SELECT employee.first_name,employee.last_name,role.title,manager.first_name
FROM employee
INNER JOIN role on employee.role_id=role.id
INNER JOIN manager on employee.manager_id=manager.id;

SELECT * FROM manager;