const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid")


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))


//HTML Routes
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")))

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")))

//API Routes
app.get("/api/notes", (req, res) => res.sendFile(path.join(__dirname, "/db/db.json")))


app.post("/api/notes", (req, res) => {

    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;

        let idNumber = uuid.v4();

        const newNote = {
            id: idNumber,
            title: req.body.title,
            text: req.body.text
        };

        const dbJSON = JSON.parse(data);

        dbJSON.push(newNote);

        res.json(newNote);

        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(dbJSON, null, 2), (err) => {
            if (err) throw err;
            console.log("Note saved!");
        });
    });
});

app.delete("/api/notes/:id", (req, res) => {

    let noteID = req.params.id;

    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;

        const dbNotes = JSON.parse(data);
        const deleteNotes = dbNotes.filter(note => note.id !== noteID);

        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(deleteNotes, null, 2), err => {
            if (err) throw err;
            res.json(deleteNotes);
            console.log("Note deleted!");
        });
    });
});

app.listen(PORT, () => console.log("App listening on PORT " + PORT))

