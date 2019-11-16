const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../db/db');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            let select = 'select * from users where username =?';
            db.query(select, username, (err, result) => {
                if (err) 
                    throw err;
                else if (result.length == 0) { // Kullanici kayitli değil.
                    return done(null, false, { message: 'Kullanıcı kayıtlı değil.' });
                }
                else { // Kullanici var.
                    user = result[0]
                    // Parolalari karşilaştir.
                    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    });
                }
            });
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser((id, done) => {
        let select = 'select * from users where user_id =?';
        db.query(select, id, (err, result) => {
            done(err, result[0]);
        });
    });
}


