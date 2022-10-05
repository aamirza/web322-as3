const dataService = require('./data-service');

const express = require('express');
const path = require('path');
const process = require('process');


const HTTP_PORT = process.env.port || 8080;

const app = express();

function viewsFilePath(fileName) {
  return path.join(__dirname, `/views/${fileName}`);
}


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(viewsFilePath('home.html'));
});


app.get('/about', (req, res) => {
    res.sendFile(viewsFilePath('about.html'));
});

app.get('/students', (req, res) => {
    dataService.getAllStudents()
        .then(data => res.json(data))
        .catch(err => {
            console.log(err);
            res.json({message: err});
        });
});

app.get('/intlstudents', (req, res) => {
    dataService.getInternationalStudents()
        .then(data => res.json(data))
        .catch(err => {
            console.log(err);
            res.json({message: err});
        });
});

app.get('/programs', (req, res) => {
    dataService.getPrograms()
        .then(data => res.json(data))
        .catch(err => {
            console.log(err);
            res.json({message: err});
        });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


function listening() {
    console.log(`Express http server listening on ${HTTP_PORT}`); 
}

dataService.initialize()
    .then(() => app.listen(HTTP_PORT, listening))
    .catch(console.log);
