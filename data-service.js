//const STUDENTS = require('./data/students.json');
//const PROGRAMS = require('./data/programs.json');
const fs = require('fs');
const path = require('path');

const students = [];
const programs = [];



function filePathInDataFolder(file) {
    const data_folder = path.join(__dirname, '/data');
    return path.join(data_folder, file);
}

const studentsFile = filePathInDataFolder('students.json');
const programsFile = filePathInDataFolder('programs.json');


module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        fs.readFile(studentsFile, 'utf8', (err, data) => {
            if (err) {
                reject('unable to find students file');
                return
            }
            const studentsData = JSON.parse(data);
            students.push(...studentsData);
            fs.readFile(programsFile, 'utf8', (err, data) => {
                if (err) {
                    reject('unable to find programs file');
                    return
                }
                const programsData = JSON.parse(data);
                programs.push(...programsData);
                resolve('success');
            });
        });
    });
}


module.exports.getAllStudents = function() {
    return new Promise((resolve, reject) => {
        if (students.length === 0) {
            reject('no results (students) returned');
        } else {
            resolve(students);
        }
    });
}


module.exports.getInternationalStudents = function() {
    return new Promise((resolve, reject) => {
        const internationalStudents = students.filter(student => student.isInternationalStudent);
        if (internationalStudents.length === 0) {
            reject('no results (international students) returned');
        } else {
            resolve(internationalStudents);
        }
    });
}


module.exports.getPrograms = function() {
    return new Promise((resolve, reject) => {
        if (programs.length === 0) {
            reject('no results (programs) returned');
        } else {
            resolve(programs)
        }
    });
}