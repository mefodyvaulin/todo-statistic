const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

const todoExpr = new RegExp('// TODO.*', 'g')

const metaExpr = /TODO (.*); (.*); (.*)/
function parseFile(files) {
    for (let cFile of files){
        cFile = cFile.split("\n");
        for (let line of cFile){
            let item = {}
            if (line.match(todoExpr, )) {
                if (line.match(metaExpr)) {
                    const {name, date, text } = line.match(todoExpr);
                    item = {
                        "text": text,
                        "important":  (text.match(/!/g) || []).length,
                        "user": name,
                        "date" : formatDate(date),
                    }
                }
                else {
                    item = {
                        "text": line,
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
    // }
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
    const [day, month, year]= [date.getDate(), date.getMonth() + 1, date.getFullYear()];

    const dayFormat = String(day).padStart(2, '0')
    const monthFormat = String(month).padStart(2, '0')

    return `${dayFormat}-${monthFormat}-${year}`;
}