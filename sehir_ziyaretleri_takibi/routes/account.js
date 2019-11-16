const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../db/db');
const bcrypt = require('bcryptjs');

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
    const { username, password, password2, email, phoneNumber } = req.body;
    let errors = [];
    if (password != password2) {
        errors.push({ msg: "Parolalar eşleşmiyor." });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            password,
            password2
        });
    } else {
        let select = 'select * from users where username =?';
        db.query(select, username, (err, result) => {
            if (err) throw err;
            else if (result.length == 0) { // Kullanici kayitli değil.
                kullaniciOlustur(req, res, username, password, email, null, phoneNumber);
            }
            else { // Kullanici zaten kayitli.
                errors.push({ msg: 'Kullanici zaten kayitli.' })
                res.render('register', {
                    errors,
                    username,
                    password,
                    password2
                })
            }
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/account/login',
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/Account/Login');
});

function kullaniciOlustur(req, res, kullaniciAdi, parola, email = null, dogumGunu = null, telefonNumarasi = null) {
    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(parola, salt, (err, hash) => {
        if (err) throw err;
        let parametreler = {
            username: kullaniciAdi, password_hash: hash, email: email,
            birthday: dogumGunu, phone_number: telefonNumarasi
        };
        let sql = 'insert into users set ?';
        db.query(sql, parametreler, (err, result) => {
            if (err)
                throw err;
            req.flash('success_msg', 'Kayıt oldunuz ve giriş yapabilirsiniz.');
            res.redirect('/Account/Login');
        });
    }));

}

module.exports = router;