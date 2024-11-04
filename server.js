const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const users = data.split('\n').filter(Boolean); // фильтрация пустых строк
        res.render('index', { users });
    });
});

app.post('/submit', (req, res) => {
    const username = req.body.username;
    fs.appendFile('users.txt', username + '\n', (err) => {
        if (err) {
            return res.status(500).send('Ошибка записи в файл');
        }
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});