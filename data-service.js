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

function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (students.length === 0) {
            reject('no results (students) returned');
        } else {
            resolve(students);
        }
    });
}

module.exports.getAllStudents = getAllStudents;


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

module.exports.addStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        console.log(studentData);
        studentData.isInternationalStudent = studentData.hasOwnProperty('isInternationalStudent');
        const maxId = Math.max(...students.map(student => parseInt(student.studentID)));
        studentData.studentID = (maxId + 1).toString();
        students.push(studentData);
        resolve();
    });
}

function filterStudentsByPropertyValue(property, value) {
    return new Promise((resolve, reject) => {
        getAllStudents()
            .then((data) => {
                const studentData = data.filter(student => student[property]?.toLowerCase() === value.toLowerCase());
                if (studentData.length > 0) {
                    resolve(studentData);
                } else {
                    reject("No results returned.");
                }
            })
            .catch(reject);
    });
}

module.exports.getStudentsByStatus = status => filterStudentsByPropertyValue('status', status);
module.exports.getStudentsByProgramCode = programCode => filterStudentsByPropertyValue('program', programCode);
module.exports.getStudentsByExpectedCredential = credential => filterStudentsByPropertyValue('expectedCredential', credential);

module.exports.getStudentById = id => {
    return new Promise((resolve, reject) => {
        getAllStudents()
            .then((data) => {
                const studentData = data.find(student => student.studentID === id);
                if (studentData) {
                    resolve(studentData);
                } else {
                    reject("No results returned.");
                }
            })
            .catch(reject);
    });
}