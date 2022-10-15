const dataService = require('./data-service');

const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const process = require('process');


const HTTP_PORT = process.env.port || 8080;

const app = express();

function viewsFilePath(fileName) {
  return path.join(__dirname, `/views/${fileName}`);
}


// const storage = multer.diskStorage({
//     destination: path.join(__dirname, "/public/images/uploaded"),
//     filename: function(req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });
// const upload = multer({storage: storage});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(viewsFilePath('home.html'));
});


app.get('/about', (req, res) => {
    res.sendFile(viewsFilePath('about.html'));
});

app.get('/students', (req, res) => {
    if (req.query.status) {
        dataService.getStudentsByStatus(req.query.status)
            .then(data => res.json(data))
            .catch(err => {
                console.log(err);
                res.json({message: err});
            });
    } else if (req.query.program) {
        dataService.getStudentsByProgramCode(req.query.program)
            .then(data => res.json(data))
            .catch(err => {
                console.log(err);
                res.json({message: err});
            });
    } else if (req.query.credential) {
        dataService.getStudentsByExpectedCredential(req.query.credential)
            .then(data => res.json(data))
            .catch(err => {
                console.log(err);
                res.json({message: err});
            });
    } else {
        dataService.getAllStudents()
            .then(data => res.json(data))
            .catch(err => {
                console.log(err);
                res.json({message: err});
            });
    }

});

app.get('/student/:value', (req, res) => {
    dataService.getStudentById(req.params.value)
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

app.get('/students/add', (req, res) => {
    res.sendFile(viewsFilePath('addStudent.html'))
});

app.get('/images/add', (req, res) => {
    res.sendFile(viewsFilePath('addImages.html'))
});

app.post('/images/add', upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get('/images', (req, res) => {
    const imagesFolder = path.join(__dirname, "/public/images/uploaded/");
    const imageFiles = [];
    fs.readdir(imagesFolder, (error, items) => {
        if (error)
            res.json({images: imageFiles});
        imageFiles.push(...items);
        res.json({images: imageFiles});
    });
});

app.post("/students/add", (req, res) => {
    dataService.addStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch(console.log);
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
