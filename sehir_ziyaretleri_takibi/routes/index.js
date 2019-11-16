const express = require('express')
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const fs = require('fs');
const path = require('path');
const db = require('../db/db');

router.get('/favicon.ico', (req, res) => res.status(204));

router.get('/', ensureAuthenticated, (req, res) => {
    let username = req.user.username;
    let select = 'SELECT u.username, c.city_name, YEAR(cv.date_visited) as year ' +
        'FROM users u, cities c, city_visits cv ' +
        'WHERE u.user_id = cv.user_id and ' +
        'c.city_id = cv.city_id';
    db.query(select, (err, users) => {
        if (err) throw err;
        res.render('index', { username: username, users: users });
    });
});

router.post('/yeniSeyahatEkle', ensureAuthenticated, (req, res) => {
    const { username, sehir, yil } = req.body;
    let sql = `CALL spYeniSeyahatEkle(?, ?, ?)`;

    db.query(sql, [username, sehir, yil], (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        res.send(results[0]);
    });

});


module.exports = router;