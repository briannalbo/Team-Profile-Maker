const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { listenerCount } = require("process");
const { resolve } = require("path");

const allEmployees = [];

const questions = () => {
    return inquirer.prompt([
        {
            type: 'list',
            message: "What is the employee's role?",
            name: 'role',
            choices: ['Manager', 'Engineer', 'Intern']
        },
        {
            type: 'input',
            message: "What is the employee's name?",
            name: 'name'
        },
        {
            type: 'input',
            message: "What is the employee's ID number?",
            name: 'id'
        },
        {
            type: 'input',
            message: "What is the employees email address?",
            name: 'email'
        },
        {
            type: 'input',
            message: "What is the employee's office number?",
            name: 'officeNumber',
            when: (answers) => answers.role === 'Manager',
        },
        {
            type: 'input',
            message: "What is the employee's Github username?",
            name: 'github',
            when: (answers) => answers.role === 'Engineer'
        },
        {
            type: 'input',
            message: "What school is the intern affiliated with?",
            name: 'school',
            when: (answers) => answers.role === 'Intern'
        },
        {
            type: 'confirm',
            message: "Would you like to add another employee?",
            name: 'addEmployee'
        }
    ])

.then((answers) => {
    // if(answers.addEmployee) {
    //     return questions();
    // }
    let addedEmployee;
    if(answers.role === 'Manager') {
        addedEmployee = new Manager(answers.name, answers.id, answers.email, answers.officeNumber)
        allEmployees.push(addedEmployee);
    }
    else if (answers.role === 'Engineer'){
        addedEmployee = new Engineer(answers.name, answers.id, answers.email, answers.github)
        allEmployees.push(addedEmployee);
    }
    else if(answers.role === 'Intern'){
        addedEmployee = new Intern(answers.name, answers.id, answers.email, answers.school)
        allEmployees.push(addedEmployee);
    }
    if(answers.addEmployee) {
        return questions();
    }

    // allEmployees.push(addedEmployee);
    console.log(allEmployees);
    createTeamFile();
}
)}

function createTeamFile() {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }
    fs.writeFileSync(outputPath, render(allEmployees));
    console.log('file successfully written');
  }

 questions();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```