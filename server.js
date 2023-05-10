const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const app = express();
//const PORT = 3001;

app.use(express.json());

app.use(express.static('public'));

app.get( '/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.status(200).json(notes);
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text
        };

        notes.push(newNote);

        fs.writeFileSync(
            path.join(__dirname, './db/db.json'),
            JSON.stringify(notes)
        );

        res.status(200).json(newNote);
    } else {
        res.status(400).json('Error in posting note');
    }
});

// selecting a saved note from left hand column and displaying it in the right hand column

app.get('/api/notes/:class', (req, res) => {
    const result = findById(req.params.id, notes);

    if (result) {
        res.send(result);
    } else {
        res.send(404);
    }
});



app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });