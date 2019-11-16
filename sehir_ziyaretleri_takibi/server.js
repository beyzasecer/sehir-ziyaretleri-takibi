const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

// Passport config
require('./config/passport')(passport);

//Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// Passport, bu satirlar " Express Session" kismindan sonra gelmeli çünkü passport'un express session'a bağimliliği var.
app.use(passport.initialize());
app.use(passport.session());

// Flashi bağla
app.use(flash())

// Global değişkenler
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routelar
app.use('/', require('./routes/index'));
app.use('/account', require('./routes/account'))

const PORT = 5000;
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Static klasörü ata
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('hbs', exphbs(
    {
        defaultLayout: 'main',
        extname: 'hbs',
        layoutsDir: path.join(__dirname, '/views/layouts/'),
        partialsDir: path.join(__dirname, '/views/partials/'),
        helpers: {
            ifnoteq: function (a, b, options) {
                if (a != b) { return options.fn(this); }
                return options.inverse(this);
            }
        }
    }));

app.set('view engine', 'hbs');