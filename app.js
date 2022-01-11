const express = require('express');
const expressLayout = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


// db
require('./utils/db');
const Contact = require('./model/contact');
const { send } = require('process');


// constant
const app = express();
const port = 3000;

// konfigurasi method override
app.use(methodOverride('_method'));


// konfigurasi ejs
app.set('view engine', 'ejs');
app.use(expressLayout);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


// konfigurasi flash
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
app.use(flash());



// halaman index
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        heading: 'Home',
        layout: 'layouts/main'
    });
});


// halaman about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        heading: 'About',
        layout: 'layouts/main'
    });
});


// halaman contact
app.get('/contact', async (req, res) => {
    // Contact.find().then((contacts) => {
        // res.render('contact', {
        //     title: 'Halaman Contact',
        //     heading: 'Halaman Contact',
        //     layout: 'layouts/main',
        //     contacts,
        // });
    // });

    const contacts = await Contact.find();
    res.render('contact', {
        title: 'Halaman Contact',
        heading: 'Halaman Contact',
        layout: 'layouts/main',
        contacts,
    });
});


// form tambah contact
app.get('/contact/add', (req, res) => {
    res.render('add_contact', {
        title: 'Tambah Contact',
        heading: 'Tambah Contact',
        layout: 'layouts/main'
    });
})


// POST - contact (handling form)
app.post('/contact', [
    body('nama').custom(async (value) => {
        const duplikat = await Contact.findOne({ nama: value });
        if (duplikat) {
            throw new Error('Nama sudah digunakan!');
        }
        return true;
    }),
    check('email', 'email tidak valid').isEmail(),
    check('nohp', 'No HP tidak valid').isMobilePhone('id-ID'),
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('add_contact', {
                title: 'Tambah Contact',
                heading: 'Tambah Contact',
                layout: 'layouts/main',
                errors: errors.array()
            });
        } else {
            Contact.insertMany(req.body, (error, result) => {
                // kirim flash message
                req.flash('msg', 'Data contact berhasil ditambahkan!');
                res.redirect('/contact');
            });
        }
    }
)


// delete contact
app.delete('/contact', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.body.nama });
    Contact.deleteOne({ _id : contact._id }).then((result) => {
        req.flash('msg', 'Data contact berhasil ditambahkan!');
        res.redirect('/contact');
    })
})


// form edit
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
    res.render('edit_contact', {
        title: 'Tambah Contact',
        heading: 'Tambah Contact',
        layout: 'layouts/main',
        contact: contact,
    });
})


// POST - change contact
app.put('/contact', [
    body('nama').custom(async (value, { req }) => {
        const duplikat = await Contact.findOne({ nama: value });
        if (value !== req.params.oldNama && duplikat) {
            throw new Error('Nama sudah digunakan!');
        }
        return true;
    }),
    check('email', 'email tidak valid').isEmail(),
    check('nohp', 'No HP tidak valid').isMobilePhone('id-ID'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // res.send(req.body);
        res.render('edit_contact', {
            title: 'Edit Contact',
            heading: 'Edit Contact',
            layout: 'layouts/main',
            errors: errors.array(),
            contact: req.body,
        });
    } else {
        Contact.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    nohp: req.body.nohp,
                }
            }
        ).then((result) => {
            // kirim flash message
            req.flash('msg', 'Data contact berhasil diubah!');
            res.redirect('/contact');
        });
    }
})


// get detail contact
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
    res.render('detail', {
        title: 'Detail Contact',
        heading: 'Detail Contact',
        layout: 'layouts/main',
        contact
    });
})


app.listen(port, () => {
    console.log(`Mongo Contact App | listening at http://localhost:${port}`);
});