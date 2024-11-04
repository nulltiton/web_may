const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'users.txt'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка при чтении файла');
        }
        const users = data ? JSON.parse(data) : [];
        res.json(users);
    });
});

app.post('/submit', (req, res) => {
    const newUser = req.body; // объект с новыми полями

    fs.readFile(path.join(__dirname, 'users.txt'), 'utf8', (err, data) => {
        let users = [];
        if (!err && data) {
            users = JSON.parse(data);
        }
        users.push(newUser);

        fs.writeFile(path.join(__dirname, 'users.txt'), JSON.stringify(users), (err) => {
            if (err) {
                return res.status(500).send('Ошибка при записи файла');
            }
            res.redirect('/');
        });
    });
});

app.post('/delete', (req, res) => {
    const { index } = req.body;

    fs.readFile(path.join(__dirname, 'users.txt'), 'utf8', (err, data) => {
        if (err) return res.status(500).send('Ошибка при чтении файла');

        let users = JSON.parse(data);
        users.splice(index, 1);

        fs.writeFile(path.join(__dirname, 'users.txt'), JSON.stringify(users), (err) => {
            if (err) return res.status(500).send('Ошибка при записи файла');
            res.status(200).send('Пользователь удален');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});