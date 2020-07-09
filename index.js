const mysql = require("mysql");
const inquirer = require("inquirer");
const questions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'selection',
        choices: ['View All Employees',
        'View All Employees By Department',
        'View All Employees By Manager',
        'Add Employee',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'View All Roles',
        'Exit']
    }
]

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employeesDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  init();
});

function viewEmployees(){
  var query = connection.query(
    "select * from employee",
    function(err, res) {
      if (err) throw err;
      console.table(res);
    }
  );
}

function viewDepartments(){
  var query = connection.query(
    "select * from department",
    function(err, res) {
      if (err) throw err;
      console.table(res);
    }
  );
}

function init(){
    inquirer.prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'selection',
                choices: ['View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Exit']
            }
        ])
        .then((response) => {
            switch(response.selection) {
              case 'View All Employees':
                  viewEmployees();
                  break;
              case 'View All Employees By Department':
                  viewDepartments();
                  break;
              case 'View All Employees By Manager':
                  break;
              case 'Add Employee':
                  break;
              case 'Remove Employee':
                  break;
              case 'Update Employee Role':
                  break;
              case 'Update Employee Manager':
                  break;
              case 'View All Roles':
                  break;
              case 'Exit':
                  process.exit();
                  break;
              default:
                  break;
            }
            init();
        })
    .catch((err)=>{console.log(err)});
}