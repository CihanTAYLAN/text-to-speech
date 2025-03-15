const gtts = require('node-gtts')('tr');
const path = require('path');
const fs = require('fs');

// Dönüştürmek istediğiniz metin
const text = "Merhaba, bu bir text-to-speech örneğidir.";

// Çıktı dosyası için yol
const filepath = path.join(__dirname, 'output.mp3');

// Ses dosyasını oluştur ve kaydet
gtts.save(filepath, text, () => {
    console.log('Ses dosyası oluşturuldu');

    // MacOS için ses dosyasını çal
    const { exec } = require('child_process');
    exec(`afplay ${filepath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Hata: ${error}`);
            return;
        }
    });
});
