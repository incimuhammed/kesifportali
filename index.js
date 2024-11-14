const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Statik dosyaları 'public' klasöründen sun

let infoList = []; // Bilgileri saklamak için basit bir dizi
const ADMIN_PASSWORD = 'admin123'; // Admin şifresi

// Bilgi ekleme API'si
app.post('/api/add-info', (req, res) => {
    const { title, description, winners } = req.body;
    infoList.push({ title, description, winners });
    res.json({ message: 'Bilgi eklendi!' });
});

// Arama API'si
app.get('/api/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    const results = infoList.filter(info => info.title.toLowerCase().includes(query));
    res.json({ results });
});

// Bilgi detay API'si
app.get('/api/info/:title', (req, res) => {
    const title = req.params.title;
    const info = infoList.find(info => info.title === title);
    if (info) {
        res.json(info);
    } else {
        res.status(404).json({ message: 'Bilgi bulunamadı.' });
    }
});

// Admin giriş API'si
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ message: 'Giriş başarılı!' });
    } else {
        res.status(403).json({ message: 'Yanlış şifre!' });
    }
});

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin paneli
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
