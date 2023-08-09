/*
Q1 -> What exactly is a File ?
A1 -> A file is a sequence of bits..

*/


const fs = require("fs").promises;

(async ()=> {
    try {
        await fs.copyFile('text.txt', 'command1.txt');
    }
    catch (error) {
        console.log(ersdror)
    }
})();

// console.log(read);
