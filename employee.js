//DEPENDENCIES
var mysql = require('mysql');
var icon = require("asciiart-logo");
var inquirer = require("inquirer");
var promisemysql = require('promise-mysql');
//var consoletable = require("console.table");
var chalk = require("chalk");

function log(msg){
    console.log(msg);
}

log(chalk.green.bold("================================="));
log(chalk.yellow(""));
log(chalk.blue.bold("EMPLOYEE"));
log(chalk.blue.bold("MANAGMENT"));
log(chalk.blue.bold("TRACKER"));
log(chalk.yellow(""));
log(chalk.green.bold("================================="));



// Connection Properties
const connectionProperties = {
    host: "localhost",
    port: 3001,
    user: "root",
    password: "password",
    database: "employee_DB"
}

// Creating Connection
const connection = mysql.createConnection(connectionProperties);


// Establishing Connection to database
connection.connect((err) => {
    if (err) throw err;

    // Start main menu function

    console.log("\n WELCOME TO THE EMPLOYEE TRACKER \n");
    mainMenu();
});

// Main menu function
function mainMenu(){

    // Prompt user to choose an option
    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "MAIN MENU - Make a Selection",
      choices: [
        "View all Employees",
        "View all Employees by Role",
        "View all Employees by Department",
        "View all employees by manager",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Update Employee Role",
        "Update Employee Manager",
        "Delete Employee",
        "Delete Role",
        "Delete Department",
        "View Department Salary",
        "EXIT"
      ]
    })
    .then((answer) => {

        // Switch case depending on user option
        switch (answer.action) {
            case "View Employees":
                viewAllEmployees();
                break;

            case "View all Employees by Department":
                viewAllEmployeesByDept();
                break;

            case "View all Employees by Role":
                viewAllEmployeesByRole();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Update Employees Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "View all Employees by Manager":
                viewAllEmployeesByManager();
                break;
            case "Delete Employee":
                deleteEmployee();
                break;
            case "View Departmnent Budget":
                viewDepartmentbudget();
                break;
            case "Delete Role":
                deleteRole();
                break;
            case "Delete Department":
                deleteDepartment();
                break;
        }
    });
}

function viewAllEmployees(){

    // Query to view all employees
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.department_name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";

    // Query from connection
    connection.query(query, function(err, res) {
        if(err) console.error (err);
        console.log("\n");

        console.table(res);

        mainMenu();
    });
}

// View all employees by department
function viewAllEmployeesByDept(){

    let departmentArray = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // Query just names of departments
        return conn.query('SELECT name FROM department');
    }).then(function(value){
        departmentQuery = value;
        for (i=0; i < value.length; i++){
            departmentArray.push(value[i].name);
            
        }
    }).then(() => {
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "What Department?",
            choices: departmentArray
        })    
        .then((answer) => {

            // Query all employees depending on selected department
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.department_name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.department_namexx = '${answer.department}' ORDER BY ID ASC`;
            connection.query(query, (err, res) => {
                if(err) return err;
                
                console.log("\n");
                console.table(res);

                mainMenu();
            });
        });
    });
}

// view all employees by role
function viewAllEmployeesByRole(){

    let roleArray = [];

    promisemysql.createConnection(connectionProperties)
    .then((conn) => {

        // Query all roles
        return conn.query('SELECT title FROM role');
    }).then(function(roles){

        for (i=0; i < role.length; i++){
            roleArray.push(role[i].title);
        }
    }).then(() => {

        // Prompt user to select a role
        inquirer.prompt({
            name: "role",
            type: "list",
            message: "Which role would you like to search?",
            choices: roleArray
        })    
        .then((answer) => {

            // Query all employees by role selected by user
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.department_name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC`;
            connection.query(query, (err, res) => {
                if(err) return err;

                console.log("\n");
                console.table(res);
                mainMenu();
            });
        });
    });
}

// Add employee
function addEmployee(){

    let roleArray = [];
    let managerArray = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // Query  all roles and all manager. Pass as a promise
        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([role, manager]) => {


        for (i=0; i < role.length; i++){
            roleArray.push(role[i].title);
        }

        for (i=0; i < manager.length; i++){
            managerArray.push(manager[i].Employee);
        }

        return Promise.all([role, manager]);
    }).then(([role, manager]) => {

        // add option for no manager
        managerArray.unshift('--');

        inquirer.prompt([
            {
                // Prompt user of their first name
                name: "firstName",
                type: "input",
                message: "First Name: ",

                validate: function(input){
                    if (input === ""){
                        console.log("REQUIRED FILED!");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                // Prompt user of their last name
                name: "lastName",
                type: "input",
                message: "Last Name: ",

                validate: function(input){
                    if (input === ""){
                        console.log("REQUIRED FIELD!");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                // Prompt user of their role
                name: "role",
                type: "list",
                message: "Requested Role?",
                choices: roleArray
            },{
                // Prompt user for manager
                name: "manager",
                type: "list",
                message: "Requested Manager?",
                choices: managerArray
            }]).then((answer) => {

                let roleID;
                let managerID = null;

                // Get ID of role selected
                for (i=0; i < roles.length; i++){
                    if (answer.role == role[i].title){
                        roleID = role[i].id;
                    }
                }

                // get ID of manager selected
                for (i=0; i < managers.length; i++){
                    if (answer.manager == manager[i].Employee){
                        managerID = manager[i].id;
                    }
                }

                // Add employee
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                    if(err) return err;

                    console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                    mainMenu();
                });
            });
    });
}

// Add Role
function addRole(){

    let departmentArray = [];

    promisemysql.createConnection(connectionProperties)
    .then((conn) => {

        // Query all departments
        return conn.query('SELECT id, name FROM department ORDER BY name ASC');

    }).then((department) => {
        
        for (i=0; i < department.length; i++){
            departmentArray.push(department[i].name);
        }

        return department;
    }).then((department) => {
        
        inquirer.prompt([
            {
                // Prompt user role title
                name: "roleTitle",
                type: "input",
                message: "Role Title: "
            },
            {
                // Prompt user for salary
                name: "salary",
                type: "number",
                message: "Salary: "
            },
            {   
                // Prompt user to select department role is under
                name: "department",
                type: "list",
                message: "Department: ",
                choices: departmentArray
            }]).then((answer) => {

                let deptID;

                for (i=0; i < department.length; i++){
                    if (answer.dept == department[i].name){
                        deptID = department[i].id;
                    }
                }

                // Added role to role table
                connection.query(`INSERT INTO role (title, salary, department_id)
                VALUES ("${answer.roleTitle}", ${answer.salary}, ${deptID})`, (err, res) => {
                    if(err) return err;
                    console.log(`\n ROLE ${answer.roleTitle} ADDED...\n`);
                    mainMenu();
                });

            });
        
    });
    
}

// Add Department
function addDepartment(){

    inquirer.prompt({

            // Prompt user for name of department
            name: "departmentName",
            type: "input",
            message: "Department Name: "
        }).then((answer) => {
                
            // add department to the table
            connection.query(`INSERT INTO department (name)VALUES ("${answer.departmentName}");`, (err, res) => {
                if(err) return err;
                console.log("\n DEPARTMENT ADDED...\n ");
                mainMenu();
            });

        });
}

// Update Employee Role
function updateEmployeeRole(){


    let employeeArray = [];
    let roleArray = [];


    promisemysql.createConnection(connectionProperties
    ).then((conn) => {
        return Promise.all([

            // query all roles and employee
            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([role, employee]) => {


        for (i=0; i < role.length; i++){
            roleArray.push(role[i].title);
        }

        for (i=0; i < employee.length; i++){
            employeeArray.push(employee[i].Employee);
        }

        return Promise.all([role, employee]);
    }).then(([role, employee]) => {

        inquirer.prompt([
            {
                // prompt user to select employee
                name: "employee",
                type: "list",
                message: "Select Employee to Edit",
                choices: employeeArray
            }, {
                // Select role to update employee
                name: "role",
                type: "list",
                message: "What is the new Role?",
                choices: roleArray
            },]).then((answer) => {

                let roleID;
                let employeeID;

                /// get ID of role selected
                for (i=0; i < role.length; i++){
                    if (answer.role == role[i].title){
                        roleID = role[i].id;
                    }
                }

                // get ID of employee selected
                for (i=0; i < employee.length; i++){
                    if (answer.employee == employee[i].Employee){
                        employeeID = employee[i].id;
                    }
                }
                
                // update employee with new role
                connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                    if(err) return err;

                    console.log(`\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `);

                    mainMenu();
                });
            });
    });
    
}

// Update employee manager
function updateEmployeeManager(){

    let employeeArray = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // query all employees
        return conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC");
    }).then((employee) => {

        for (i=0; i < employee.length; i++){
            employeeArray.push(employee[i].Employee);
        }

        return employee;
    }).then((employee) => {

        inquirer.prompt([
            {
                // prompt user to selected employee
                name: "employee",
                type: "list",
                message: "Which Employee would you like to Edit?",
                choices: employeeArray
            }, {
                // prompt user to select new manager
                name: "manager",
                type: "list",
                message: "Who is their new Manager?",
                choices: employeeArray
            },]).then((answer) => {

                let employeeID;
                let managerID;

                for (i=0; i < employee.length; i++){
                    if (answer.manager == employee[i].Employee){
                        managerID = employee[i].id;
                    }
                }

                for (i=0; i < employee.length; i++){
                    if (answer.employee == employee[i].Employee){
                        employeeID = employee[i].id;
                    }
                }

                // update employee with manager ID
                connection.query(`UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`, (err, res) => {
                    if(err) return err;

                    console.log(`\n ${answer.employee} MANAGER UPDATED TO ${answer.manager}...\n`);

                    mainMenu();
                });
            });
    });
}

// View all employees by manager
function viewAllEmployeesByManager(){

    let managerArray = [];

    promisemysql.createConnection(connectionProperties)
    .then((conn) => {

        // Query all employees
        return conn.query("SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e Inner JOIN employee m ON e.manager_id = m.id");

    }).then(function(managers){

        for (i=0; i < manager.length; i++){
            managerArray.push(manager[i].manager);
        }

        return manager;
    }).then((manager) => {

        inquirer.prompt({

            // Prompt user of manager
            name: "manager",
            type: "list",
            message: "Select a Manager",
            choices: managerArray
        })    
        .then((answer) => {

            let managerID;

            for (i=0; i < manager.length; i++){
                if (answer.manager == manager[i].manager){
                    managerID = manager[i].id;
                }
            }

            // query all employees by selected manager
            const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.department_name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            INNER JOIN role ON e.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            WHERE e.manager_id = ${managerID};`;
    
            connection.query(query, (err, res) => {
                if(err) return err;
                
                console.log("\n");
                console.table(res);

                mainMenu();
            });
        });
    });
}

// Delete employee
function deleteEmployee(){

    let employeeArray = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // Query all employees
        return  conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {


        for (i=0; i < employee.length; i++){
            employeeArray.push(employee[i].employee);
        }

        inquirer.prompt([
            {
                // prompt user of all employees
                name: "employee",
                type: "list",
                message: "Which Employee would you like to Delete?",
                choices: employeeArray
            }, {
                // confirm delete of employee
                name: "yesOrNo",
                type: "list",
                message: "Confirm Deletion",
                choices: ["NO", "YES"]
            }]).then((answer) => {

                if(answer.yesOrNo == "YES"){
                    let employeeID;

                    for (i=0; i < employee.length; i++){
                        if (answer.employee == employee[i].employee){
                            employeeID = employee[i].id;
                        }
                    }
                    
                    // deleted selected employee
                    connection.query(`DELETE FROM employee WHERE id=${employeeID};`, (err, res) => {
                        if(err) return err;

                        console.log(`\n EMPLOYEE '${answer.employee}' DELETED...\n `);
                        
                        mainMenu();
                    });
                } 
                else {
                    
                    console.log(`\n EMPLOYEE '${answer.employee}' NOT DELETED...\n `);

                    mainMenu();
                }
                
            });
    });
}

// Delete Role
function deleteRole(){

    let roleArray = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // query all roles
        return conn.query("SELECT id, title FROM role");
    }).then((role) => {    

        for (i=0; i < role.length; i++){
            roleArray.push(role[i].title);
        }

        inquirer.prompt([{
            name: "confirmDelete",
            type: "list",
            message: "Warning! Deleting a role will delete all employees associated with that role. Do you want to continue?",
            choices: ["NO", "YES"]
        }]).then((answer) => {

            if (answer.confirmDelete === "NO") {
                mainMenu();
            }

        }).then(() => {

            inquirer.prompt([{
                // prompt user of of roles
                name: "role",
                type: "list",
                message: "Which role would you like to delete?",
                choices: roleArray
            }, {

                name: "confirmDelete",
                type: "Input",
                message: "Type Specific Deletion Role"

            }]).then((answer) => {

                if(answer.confirmDelete === answer.role){

                    let roleID;
                    for (i=0; i < role.length; i++){
                        if (answer.role == role[i].title){
                            roleID = role[i].id;
                        }
                    }
                    
                    connection.query(`DELETE FROM role WHERE id=${roleID};`, (err, res) => {
                        if(err) return err;

                        console.log(`\n ROLE '${answer.role}' DELETED...\n `);

                        mainMenu();
                    });
                } 
                else {

                    console.log(`\n ROLE '${answer.role}' ROLE NOT DELETED...\n `);

                    mainMenu();
                }
                
            });
        })
    });
}

// Delete Department
function deleteDepartment(){

    let departmentArray = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // query all departments
        return conn.query("SELECT id, name FROM department");
    }).then((department) => {

        // add all departments to array
        for (i=0; i < department.length; i++){
            departmentArray.push(department[i].name);
        }

        inquirer.prompt([{

            // confirm to continue to select department to delete
            name: "continueDelete",
            type: "list",
            message: "WARNING!  Deleting a department will delete all roles and employees associated with that department. Do you want to continue?",
            choices: ["NO", "YES"]
        }]).then((answer) => {

            if (answer.continueDelete === "NO") {
                mainMenu();
            }

        }).then(() => {

            inquirer.prompt([{

                name: "dept",
                type: "list",
                message: "Which department would you like to delete?",
                choices: deptArr
            }, {

                name: "confirmDelete",
                type: "Input",
                message: "Type specific deletion Department "

            }]).then((answer) => {

                if(answer.confirmDelete === answer.department){

                    let deptID;
                    for (i=0; i < department.length; i++){
                        if (answer.department == department[i].name){
                            deptID = deppartment[i].id;
                        }
                    }
                    
                    // delete department
                    connection.query(`DELETE FROM department WHERE id=${deptID};`, (err, res) => {
                        if(err) return err;

                        console.log(`\n DEPARTMENT '${answer.dept}' DELETED...\n `);

                        mainMenu();
                    });
                } 
                else {
                    console.log(`\n DEPARTMENT '${answer.dept}' NOT DELETED...\n `);

                    mainMenu();
                }
                
            });
        })
    });
}

// View Department Budget
function viewDepartmentbudget(){


    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return  Promise.all([

            // query all departments and salaries
            conn.query("SELECT salary.employee_name AS salary, role.salary FROM employee e LEFT JOIN employee m ON e.salary_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.employee_id = employee.id ORDER BY salary ASC"),
            conn.query('SELECT name FROM employee ORDER BY name ASC')
        ]);
    }).then(([viewDepartmentbudget, department]) => {
        
        let employeeSalaryArray =[];
        let department;

        for (d=0; d < employeeSalaryArray.length; d++){
            let employeeSalaryArray = 0;

            for (i=0; i < employeeSalaryArray.length; i++){
                if (department[d].name == employeeSalaryArray[i].department){
                    employeeSalaryArray += employeeSalaryArray[i].department;
                }
            }

            departmentBudgetArray.push(department);
        }
        console.log("\n");

        console.table(employeeSalary);

        mainMenu();
    });
};

