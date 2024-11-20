const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let infoList = [];
const ADMIN_SIFRE = process.env.ADMIN_SIFRE;


function loadInfoList() {
    if (fs.existsSync('data.json')) {
        const data = fs.readFileSync('data.json');
        infoList = JSON.parse(data);
    }
}


function saveInfoList() {
    fs.writeFileSync('data.json', JSON.stringify(infoList, null, 2));
}


app.post('/api/add-info', (req, res) => {
    const { title, description, winners } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: 'Başlık ve açıklama gereklidir.' });
    }
    infoList.push({ title, description, winners });
    saveInfoList();
    res.json({ message: 'Bilgi eklendi!' });
});


app.get('/api/search', (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';
    const results = infoList.filter(info => info.title.toLowerCase().includes(query));
    res.json({ results });
});
app.get('/api/search', (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';
    const results = infoList.filter(info => info.title.toLowerCase().includes(query));
    res.json({ results });
});


app.get('/api/info/:title', (req, res) => {
    const title = req.params.title;
    const info = infoList.find(info => info.title === title);
    if (info) {
        res.json(info);
    } else {
        res.status(404).json({ message: 'Bilgi bulunamadı.' });
    }
});


app.post('/api/login', (req, res) => {
    const { password } = req.body;
    console.log('girilen sifre:', password); 
    if (password === ADMIN_SIFRE) {
        res.json({ message: 'Giriş başarılı!' });
    } else {
        res.status(403).json({ message: 'Yanlış şifre!' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});


loadInfoList();


app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
