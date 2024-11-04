const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../users.txt');

function getUsers(req, res) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Ошибка при чтении файла');
        const users = data ? JSON.parse(data) : [];
        res.json(users);
    });
}

function addUser(req, res) {
    const newUser = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        const users = data ? JSON.parse(data) : [];
        users.push(newUser);

        fs.writeFile(filePath, JSON.stringify(users), (err) => {
            if (err) return res.status(500).send('Ошибка при записи файла');
            res.redirect('/');
        });
    });
}

function deleteUser(req, res) {
    const { index } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Ошибка при чтении файла');

        const users = JSON.parse(data);
        users.splice(index, 1);

        fs.writeFile(filePath, JSON.stringify(users), (err) => {
            if (err) return res.status(500).send('Ошибка при записи файла');
            res.status(200).send('Пользователь удален');
        });
    });
}

module.exports = {
    getUsers,
    addUser,
    deleteUser
};