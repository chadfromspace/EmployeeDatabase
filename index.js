const mysql = require("mysql");
const inquirer = require("inquirer");

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
  queryURL += " from employee"
  queryURL += " inner join role on employee.role_id=role.id"
  queryURL += " left join managers on employee.manager_id=managers.id;";
  var query = connection.query(
    queryURL,
    function(err, res) {
      if (err) throw err;
      console.table(res);
      init();
      query.end();
    }
  );
};

function viewEmployeesByDepartment(){
    var currentDepartment = [];
    var departmentID;
    let queryURL = "select * from department";
    var query = connection.query(
        queryURL,
        function(err, res){
            if (err) throw err;
            for(i=0;i<res.length;i++){
                currentDepartment.push(res[i].department_name);
            }
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Select Department',
                    name: 'departmentSelection',
                    choices: currentDepartment
                }
            ]).then((response) => {
                        for(i=0;i<currentDepartment.length;i++){
                            if(response.departmentSelection===currentDepartment[i]){
                                departmentID = currentDepartment.indexOf(currentDepartment[i])+1;
                            }
                        }
                        var query2 = connection.query(
                        "SELECT * FROM employee INNER JOIN role on employee.role_id=role.id WHERE role.department_id='" + departmentID + "'",
                        function(err, res) {
                            if (err) throw err;
                            console.table(res);
                            init();
                            query2.end();
                            query.end();
                    });
            });
    });
};

function viewDepartments(){
    var query = connection.query(
        "SELECT * FROM department",
        function(err, res) {
            if (err) throw err;
            console.table(res);
        init();
        query.end();
    });
}

function addDepartment(){
    inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the department you want to add?',
                name: 'name'
            }
        ]).then((response)=>{
            var query = connection.query(
                "INSERT INTO department (department_name) VALUES ('"+response.name+"');",
                function(err, res) {
                    if (err) throw err;
                    console.log(response.name);
                init();
                query.end();
            });
    })
}

function removeDepartment(){
    var departmentArray = [];
    var departmentSelection;
     var query = connection.query(
          "SELECT * FROM department",
          function(err, res) {
              if (err) throw err;
              for(i=0;i<res.length;i++){
                departmentArray.push(res[i].department_name);
              }
              inquirer.prompt([
                  {
                      type: 'list',
                      message: 'What department would you like to remove?',
                      name: 'selection',
                      choices: departmentArray
                  }
              ]).then((response)=>{
                    for(i=0;i<res.length;i++){
                      if(res[i].department_name===response.selection){
                        departmentSelection = res[i].department_name;
                      }
                    }
                  var query2 = connection.query(
                      "DELETE FROM department WHERE department.department_name='"+departmentSelection+"';",
                      function(err, res) {
                      if (err) throw err;
                      init();
                      query2.end();
                      query.end();
                  });
              });
     });
}

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
                var query2 = connection.query(
                "SELECT * FROM employee INNER JOIN managers on employee.manager_id=managers.id WHERE managers.manager='"+response.selection+"'",
                function(err, res) {
                if (err) throw err;
                console.table(res);
                init();
                query2.end();
                query.end();
                });
            });
    })
};

function addEmployee(){
    let managers = [];
    var managerID;
    var roleID;
    var newRoleID;
    var currentRoles = [];
        var query = connection.query(
            "SELECT * FROM managers",
            function(err, res) {
                if (err) throw err;
                for(i=0;i<res.length;i++){
                    managers.push(res[i].manager);
                }
                var query2 = connection.query(
                            "SELECT * FROM role",
                            function(err, res) {
                                if (err) throw err;
                                for(i=0;i<res.length;i++){
                                    currentRoles.push(res[i].title);
                                }
                                roleID = res;
                                query2.end();
                });
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
                        choices: currentRoles
                    },
                    {
                        type: 'list',
                        message: "Who is the employee's manager?",
                        name: 'managerSelection',
                        choices: managers
                    }
                ]).then((response)=>{
                        for(i=0;i<res.length;i++){
                            if(response.managerSelection===res[i].manager){
                                managerID = res[i].id;
                            }
                        }
                        for(i=0;i<roleID.length;i++){
                            if(response.roleSelection===roleID[i].title){
                                newRoleID = roleID[i].id;
                            }
                        }
                        var query3 = connection.query(
                            "INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('" + response.firstName + "','"+response.lastName+"','"+newRoleID+"','"+managerID+"');",
                            function(err, res) {
                            if (err) throw err;
                            query3.end();
                        });
                        init();
                        query.end();
                });
            });
}

function removeEmployee(){
    var employeeArray = [];
    var nameSelection;
     var query = connection.query(
          "SELECT * FROM employee",
          function(err, res) {
              if (err) throw err;
              for(i=0;i<res.length;i++){
                employeeArray.push(res[i].first_name+" "+res[i].last_name);
              }
              inquirer.prompt([
                  {
                      type: 'list',
                      message: 'Who would you like to remove?',
                      name: 'selection',
                      choices: employeeArray
                  }
              ]).then((response)=>{
                    var nameArray = response.selection.split(" ");
                    for(i=0;i<res.length;i++){
                      if(res[i].first_name===nameArray[0]&&res[i].last_name===nameArray[1]){
                        nameSelection = res[i].id;
                      }
                    }
                  var query2 = connection.query(
                      "DELETE FROM employee WHERE employee.id="+nameSelection,
                      function(err, res) {
                      if (err) throw err;
                      init();
                      query2.end();
                      query.end();
                  });
              });
     });
}

function updateEmployeeRole(){
    var employeeArray = [];
    var nameSelection;
    var firstNameSelection;
    var lastNameSelection;
     var query = connection.query(
          "SELECT * FROM employee",
          function(err, res) {
              if (err) throw err;
              for(i=0;i<res.length;i++){
                employeeArray.push(res[i].first_name+" "+res[i].last_name);
              }
              inquirer.prompt([
                  {
                      type: 'list',
                      message: 'Select An Employee:',
                      name: 'selection',
                      choices: employeeArray
                  },
                  {
                      type: 'input',
                      message: 'New Role ID:',
                      name: 'newID'
                  }
              ]).then((response)=>{
                    var nameArray = response.selection.split(" ");
                    for(i=0;i<res.length;i++){
                      if(res[i].first_name===nameArray[0]&&res[i].last_name===nameArray[1]){
                        nameSelection = res[i].id;
                        firstNameSelection = res[i].first_name;
                        lastNameSelection = res[i].last_name;
                      }
                    }
                  var query2 = connection.query(
                      "UPDATE employee SET employee.role_id = '"+response.newID+"' WHERE employee.first_name='"+firstNameSelection+"' AND employee.last_name='"+lastNameSelection+"';",
                      function(err, res) {
                      if (err) throw err;
                      init();
                      query2.end();
                      query.end();
                  });
              });
     });
}

function addRole(){
    inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the role you want to add?',
                name: 'roleTitle'
            },
            {
                type: 'input',
                message: 'What is the salary of the role you want to add?',
                name: 'roleSalary'
            },
            {
                type: 'input',
                message: 'What is the department ID of the role you want to add?',
                name: 'roleDepartmentID'
            }]
        ).then((response)=>{
            var query = connection.query(
                "INSERT INTO role (title,salary,department_id) VALUE ('"+response.roleTitle+"','"+response.roleSalary+"','"+response.roleDepartmentID+"');",
                function(err, res) {
                    if (err) throw err;
                    for(i=0;i<res.length;i++){
                        roleArray.push(res[i].title)
                    }
                init();
                query.end();
            });
    })
}

function viewRoles(){
        var query = connection.query(
           "SELECT * FROM role",
           function(err, res) {
               if (err) throw err;
               console.table(res);
               init();
               query.end();
        });
}

function removeRole(){
    var roleArray = [];
    var roleSelection;
     var query = connection.query(
          "SELECT * FROM role",
          function(err, res) {
              if (err) throw err;
              for(i=0;i<res.length;i++){
                roleArray.push(res[i].title);
              }
              inquirer.prompt([
                  {
                      type: 'list',
                      message: 'What would you like to do?',
                      name: 'selection',
                      choices: roleArray
                  }
              ]).then((response)=>{
                    for(i=0;i<res.length;i++){
                      if(res[i].title===response.selection){
                        roleSelection = res[i].title;
                      }
                    }
                  var query2 = connection.query(
                      "DELETE FROM role WHERE role.title='"+roleSelection+"';",
                      function(err, res) {
                      if (err) throw err;
                      init();
                      query2.end();
                      query.end();
                  });
              });
     });
}


//    var query = connection.query(
//        "SELECT * FROM managers",
//        function(err, res) {
//        if (err) throw err;
//    });

function init(){
    inquirer.prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'selection',
                choices: ['View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'View Roles',
                'View Departments',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Update Employee Role',
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
                  viewEmployeesByDepartment();
                  break;
              case 'View All Employees By Manager':
                  viewManagers();
                  break;
              case 'View Roles':
                  viewRoles();
                  break;
              case 'View Departments':
                  viewDepartments();
                  break;
              case 'Add Employee':
                  addEmployee();
                  break;
              case 'Add Role':
                  addRole();
                  break;
              case 'Add Department':
                  addDepartment();
                  break;
              case 'Remove Employee':
                  removeEmployee();
                  break;
              case 'Remove Role':
                  removeRole();
                  break;
              case 'Remove Department':
                  removeDepartment();
                  break;
              case 'Update Employee Role':
                  updateEmployeeRole();
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