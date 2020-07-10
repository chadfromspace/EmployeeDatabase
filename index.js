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
  let queryURL = "select *"
  queryURL += "from employee"
  queryURL += " inner join role on employee.role_id=role.id"
  queryURL += " inner join managers on role.department_id=managers.department_id";
  var query = connection.query(
    queryURL,
    function(err, res) {
      if (err) throw err;
      console.table(res);
      init();
    }
  );
};

function viewDepartments(){
    var currentRoles = [];
    var departmentID;
    let queryURL = "select * from role";
    var query = connection.query(
        queryURL,
        function(err, res){
            if (err) throw err;
            for(i=0;i<res.length;i++){
                currentRoles.push(res[i].title);
            }
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Select Department',
                    name: 'departmentSelection',
                    choices: currentRoles
                }
            ]).then((response) => {
                        for(i=0;i<currentRoles.length;i++){
                            if(response.departmentSelection===currentRoles[i]){
                                departmentID = currentRoles.indexOf(currentRoles[i])+1;
                            }
                        }
                        var query = connection.query(
                        "SELECT * FROM employee INNER JOIN role on employee.role_id=role.id WHERE role.department_id='" + departmentID + "'",
                        function(err, res) {
                            if (err) throw err;
                            console.table(res);
                            init();
                    });
            });
    });
};

function viewManagers(){
    var query = connection.query(
        "SELECT manager FROM managers",
        function(err, res) {
            if (err) throw err;
            let managersArray = [];
            for(i=0;i<res.length;i++){
                managersArray.push(res[i].manager);
            }
        inquirer.prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'selection',
                choices: managersArray
            }
            ]).then((response)=>{
                var query = connection.query(
                "SELECT * FROM employee INNER JOIN managers on employee.manager_id=managers.id WHERE managers.manager='"+response.selection+"'",
                function(err, res) {
                if (err) throw err;
                console.table(res);
                init();
                });
            });
    })
};

function addEmployee(){
    let managers = [];
    var managerID;
    var roleID;
    var currentRoles;
        var query = connection.query(
            "SELECT * FROM managers,role",
            function(err, res) {
                if (err) throw err;
                for(i=0;i<res.length;i++){
                    managers.push(res[i].manager_name);
                    currentRoles.push(res[i].title);
                }
                console.log(currentRoles);
                inquirer.prompt([
                    {
                        type: 'input',
                        message: "What is the employee's first name?",
                        name: 'firstName'
                    },
                    {
                        type: 'input',
                        message: "What is the employee's last name?",
                        name: 'lastName'
                    },
                    {
                        type: 'list',
                        message: "What is the employee's role?",
                        name: 'roleSelection',
                        choices: ['Sales Lead',
                        'Salesperson',
                        'Lead Engineer',
                        'Software Engineer',
                        'Account Manager',
                        'Accountant',
                        'Legal Team Lead'
                        ]
                    },
                    {
                        type: 'list',
                        message: "What is the employee's role?",
                        name: 'managerSelection',
                        choices: managers
                    }
                ]).then((response)=>{
                            for(i=0;i<res.length;i++){
                                if(response.managerSelection===res[i].manager_name){
                                    managerID = res[i].id;
                                }
                            }
                            switch(response.roleSelection) {
                                  case 'Sales Lead':
                                      roleID = 1;
                                      break;
                                  case 'Salesperson':
                                      roleID = 2;
                                      break;
                                  case 'Lead Engineer':
                                      roleID = 3;
                                      break;
                                  case 'Software Engineer':
                                      roleID = 4;
                                      break;
                                  case 'Account Manager':
                                      roleID = 5;
                                      break;
                                  case 'Accountant':
                                      roleID = 6;
                                      break;
                                  case 'Legal Team Lead':
                                      roleID = 7;
                                      break;
                                  default:
                                  break;
                             }
                        var query = connection.query(
                            "INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('" + response.firstName + "',"+"'"+response.lastName+"','"+roleID+"','"+managerID+"')",
                            function(err, res) {
                            if (err) throw err;
                        })
                        init();
                });
            });
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
                  viewManagers();
                  break;
              case 'Add Employee':
                  addEmployee();
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
                  init();
                  break;
            }
        })
    .catch((err)=>{console.log(err)});
}