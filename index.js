const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // Multer'ı içe aktar

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Statik dosyaları 'public' klasöründen sun
app.use('/uploads', express.static('uploads')); // 'uploads/' dizinini statik olarak sun

let infoList = [];
const ADMIN_PASSWORD = process.env.ADMIN_SIFRE;

// Resim yükleme ayarları
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Resimleri 'uploads/' dizinine kaydet
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Benzersiz bir isim ver
    }
});

const upload = multer({ storage: storage });

// JSON dosyasını oku ve bilgileri yükle
function loadInfoList() {
    if (fs.existsSync('data.json')) {
        const data = fs.readFileSync('data.json');
        infoList = JSON.parse(data);
    }
}

// JSON dosyasını güncelle
function saveInfoList() {
    fs.writeFileSync('data.json', JSON.stringify(infoList, null, 2));
}

// Bilgi ekleme API'si
app.post('/api/add-info', upload.single('image'), (req, res) => {
    const { title, description, winners } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Yüklenen resmin yolu
    infoList.push({ title, description, winners, image: imagePath });
    saveInfoList(); // Bilgileri kaydet
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

// Uygulama başlatıldığında bilgileri yükle
loadInfoList();

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
