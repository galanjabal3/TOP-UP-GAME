const express = require('express');
const mysql = require('mysql');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const app = express();
const port = 7000;
app.set('view engine','hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

var koneksi = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'top_up_ml'
});

koneksi.connect((err) =>{
    if(err) throw err;
    console.log('Koneksi Databases Berhasil Disambung')
});

//user
app.get('/user', (req, res) => {
    koneksi.query('SELECT * FROM user',(err, hasil) => {
        if(err) throw err;
        res.render('user.hbs', {
            hal: 'Log In'
        });
    });
});

app.post('/user', (req, res) =>{    
    var username = req.body.inputusername;
    var password = req.body.inputpassword;
    koneksi.query('INSERT INTO user(username,password) values (?,?)',
    [  username, password ],
    (err, hasil) =>{
        if(err) throw err;
        res.redirect('/user');
    }
    )
})

//pembayaran
app.get('/pembayaran', (req, res) => {
    koneksi.query('SELECT * FROM pembayaran',(err, hasil) => {
        if(err) throw err;
        res.render('pembayaran.hbs', {
            Hal2: 'Pembayaran Top Up',
            data4: hasil
        });
    });
});

app.post('/pembayaran', (req, res) =>{
    var game = req.body.inputgame;
    var id_ml = req.body.inputidml;
    var diamond = req.body.inputdiamond;
    var tanggal_transaksi = req.body.inputtanggaltransaksi;
    var negara = req.body.inputnegara;
    var via = req.body.inputvia;
    koneksi.query('INSERT INTO pembayaran( game, id_ml, diamond, tanggal_transaksi, negara, via) values (?,?,?,?,?,?)',
    [  game, id_ml, diamond, tanggal_transaksi, negara, via],
    (err, hasil) =>{
        if(err) throw err;
        res.redirect('/pembayaran');
    }
    )
})

app.get('/hapus/:nomor_pelanggan',(req, res) =>{
    var  nomor_pelanggan= req.params.nomor_pelanggan;
    koneksi.query("DELETE from pembayaran where nomor_pelanggan=?",
     [nomor_pelanggan], (err, hasil) =>{
         if(err) throw err;
         res.redirect('/pembayaran')
     }
    )
})

app.get('/user',(req, res) =>{
    res.render( __dirname + '/views/user.hbs')
});

app.get('/pembayaran',(req, res) =>{
    res.render( __dirname + '/views/pembayaran.hbs')
});

app.listen(port, () =>{
    console.log(`App berjalan pada port ${port}`);
});