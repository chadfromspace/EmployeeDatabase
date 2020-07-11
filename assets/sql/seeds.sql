DROP DATABASE IF EXISTS employeesDB;
CREATE database employeesDB;

USE employeesDB;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30),
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

CREATE TABLE managers(
  id INT NOT NULL AUTO_INCREMENT,
  manager VARCHAR(30),
  PRIMARY KEY (id)
);

INSERT INTO department (department_name)
VALUES ('Engineering'),
('Sales'),
('Service'),
('Finance'),
('Legal');

INSERT INTO role (title,salary,department_id)
VALUES ('Sales Lead','200000.00','2'),
('Salesperson','150000.00','2'),
('Lead Engineer','85000.00','1'),
('Software Engineer','70000.00','1'),
('Account Manager','60000.00','3'),
('Accountant','50000.00','4'),
('Legal Team Lead','75000.00','5');

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ('Joe','Smith','1',NULL),
('Bob','Williams','2','1'),
('Will','Stevens','2','1'),
('George','Rogers','3',NULL),
('David','Brown','4','2'),
('Ashley','Miller','4','2'),
('Will','Anderson','5',NULL),
('Wendy','Moore','5','3'),
('Brian','Jackson','5','3'),
('Greg','Martin','6',NULL),
('Lewis','Walker','6','4'),
('Winston','Scott','7',NULL);

INSERT INTO managers (manager)
VALUES ('Joe Smith'),
('George Rogers'),
('Will Anderson'),
('Greg Martin'),
('Winston Scott');

SELECT * FROM employee;