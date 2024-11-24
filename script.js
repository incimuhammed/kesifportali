document.getElementById('infoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Formun varsayılan gönderimini engelle

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('winners', document.getElementById('winners').value);
    formData.append('image', document.getElementById('image').files[0]); // Görsel dosyası

    fetch('/api/add-info', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        // Formu temizle
        document.getElementById('infoForm').reset();
    })
    .catch(error => console.error('Hata:', error));
