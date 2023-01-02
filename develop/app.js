//all consts are set; all requirements are set(node apps & files/directories)
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

//created an empty string called 'allEmployees'
//employees created through this app will be pushed as an object into this
const allEmployees = [];

//this function uses inquirer and creates a prompt of questions in the terminal to gather necessary user input
const questions = () => {
    return inquirer.prompt([
        //first four questions apply to all employees
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
    //the following questions are asked depending on the 'role' the user chose
        //only if employee is a manager: office number is asked
        {
            type: 'input',
            message: "What is the employee's office number?",
            name: 'officeNumber',
            when: (answers) => answers.role === 'Manager',
        },
        //only employees that are engineers are required to enter their github username
        {
            type: 'input',
            message: "What is the employee's Github username?",
            name: 'github',
            when: (answers) => answers.role === 'Engineer'
        },
        //only intern employees are required to enter a school
        {
            type: 'input',
            message: "What school is the intern affiliated with?",
            name: 'school',
            when: (answers) => answers.role === 'Intern'
        },
//after entering employees, user is asked whether they would like to enter another employee
// answering 'yes' will restart the question prompt
//answering 'no' will end the prompt and write the input to a team.html file
        {
            type: 'confirm',
            message: "Would you like to add another employee?",
            name: 'addEmployee'
        }
    ])

.then((answers) => {
   //refers back to established classes in 'lib' folder
   //creates 'new' constructors for each depending on the employee's role
    let addedEmployee;
    if(answers.role === 'Manager') {
        addedEmployee = new Manager(answers.name, answers.id, answers.email, answers.officeNumber)
        //pushes the new employee to the allEmployees object 
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
    //if user chose to add another employee the prompt restarts
    if(answers.addEmployee) {
        return questions();
    }

    console.log(allEmployees);
    //calls createTeamFile to write the user's input to a file
    createTeamFile();
}
)}

//this function ensures an output directory exists then writes the data entered by the user to the output path established: 'team.html' 
function createTeamFile() {
    //checks if 'output' directory exists & creates one if it does not
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }
    //writes file using the required render file as a template and allEmployees data(user input)
    fs.writeFileSync(outputPath, render(allEmployees));
    console.log('file successfully written');
  }
//calls the questions function to being prompt in terminal, collect the user data, then write to the team.html file
 questions();

 //The following were the challenge instructions:


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