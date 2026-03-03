const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = [];
console.log('Please, write your command!');



readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

const metaExpr = /\s*\/\/ TODO .*/;


function parseFile(files) {
    for (let cFile of files){
        cFile = cFile.split("\n");
        for (let line of cFile){
            let item = {}
            if (metaExpr.test(line)) {
                let countOf = line.split('// TODO')[1];
                if (countOf.indexOf(';') !== -1) {

                    let lineParse = countOf.split(";");
                    let name = lineParse[0];
                    let date = lineParse[1];
                    let text = lineParse[2]
                    let countExclamationMark = (text.match(/!/g) || []).length

                    item = {
                        "textTODO": text.slice(1),
                        "important": countExclamationMark ,
                        "user": name.slice(1),
                        "date" : formatDate(date),
                    }
                }
                else {
                    item = {
                        "textTODO": line.split("// TODO")[1],
                        "important":  (line.match(/!/g) || []).length,
                        "user": '',
                        "date" : undefined,
                    }
                }
                todos.push(item)

            }
        }
    }

}

function processCommand(command) {
    parseFile(files);
    switch (true) {
        case /exit/.test(command):
            process.exit(0);
            break;
        case /show/.test(command):
            showAllTodos();
            break;
        case /important/.test(command):
            showImportantTodos();
            break;
        case /user .*/.test(command):
            let username = command.slice(5);
            showTodosByUsername(username);
            break;
        case /sort .*/.test(command):
            let subcommand = command.slice(5);
            switch (subcommand) {
                case 'importance':
                    showTodosSortedByImportance();
                    break;
                case 'user':
                    showTodosSortedByUser();
                    break
                case 'date':
                    showTodosSortedByDate();
                    break;
                default:
                    console.log('wrong command');
                    break;
            }
            break
        default:
            console.log('wrong command');
            break;

    }
}

function showAllTodos(){
    console.log(todos.map(item => item["textTODO"]));
}

function showImportantTodos(){
    console.log(todos
        .filter(item => item.important > 0)
        .map(item => item["textTODO"])
    );
}

function showTodosByUsername(username){
    console.log(todos
        .filter(item => item.user === username)
        .map(item => item["textTODO"])
    );
}

function formatDate (date) {
    const date_split = date.split('-');
    return new Date(date_split[0], date_split[1] - 1, date_split[2]);
}

function showTodosSortedByImportance(){
    const copy = todos.slice();
    console.log(copy
        .sort((a, b) => {
            if (a.important > b.important)
                return -1;
            if (a.important < b.important)
                return 1;
            return 0;
        })
        .map(item => item["textTODO"]));
}

function showTodosSortedByUser(){
    const copy = todos.slice();
    console.log(copy
        .sort((a, b) => {
            if (a.user < b.user)
                return -1;
            if (a.user > b.user)
                return 1;
            return 0;
        })
        .map(item => item["textTODO"]));
}

function showTodosSortedByDate(){
    const copy = todos.slice();
    console.log(copy
        .sort((a, b) => {
            if (b.date === undefined)
                return -1;
            if(a.date === undefined)
                return 1;
            if (a.date < b.date)
                return -1;
            if (a.date > b.date)
                return 1;
            return 0;
        })
        .map(item => item["textTODO"]));
}
