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

const todoExpr = new RegExp('.;?// TODO.*', 'g')

const metaExpr = new RegExp('.;?// TODO (.+); (.+); (.+)', 'g')
function parseFile(files) {
    for (let cFile of files){
        cFile = cFile.split("\n");
        for (let line of cFile){

            let item = {}
            if (line.match(todoExpr)) {
                if (line.match(metaExpr)) {
                    let lineParse = line.split(";")
                    let name = lineParse[1].split(" ")[3];
                    let date = lineParse[2];
                    let text = lineParse.slice(3).join(';')

                    let countExclamationMark = (text.match(/!/g) || []).length
                    item = {
                        "text": text,
                        "important": countExclamationMark ,
                        "user": name,
                        "date" : formatDate(date),
                    }
                }
                else {
                    item = {
                        "text": line.split("// TODO")[1],
                        "important":  /!/.test(line),
                        "user": undefined,
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
    switch (command) {
        case 'exit':
    switch (true){
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
            switch(subcommand){
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
    // switch (command) {
    //     case 'exit':
    //         process.exit(0);
    //         break;
    //     case 'show':
    //         showAllTodos();
    //         break;
    //     case 'important':
    //         showImportantTodos();
    //         break;
    //     default:
    //         console.log('wrong command');
    //         break;
    }
}

function showAllTodos(){
    console.log(todos.map(item => item.text));
}

function showImportantTodos(){
    console.log(todos
        .filter(item => item.important > 0)
        .map(item => item.text)
    );
}

function showTodosByUsername(username){
    console.log(todos
        .filter(item => item.username === username)
        .map(item => item.text)
    );
}

// TODO you can do it!

function formatDate (date) {
    const date_split = date.split('-');
    return new Date(date_split[0], date_split[1] - 1, date_split[2]);
}