document.addEventListener('DOMContentLoaded', function () {
    const ttsForm = document.getElementById('ttsForm');
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    const audioPlayer = document.getElementById('audioPlayer');
    const downloadBtn = document.getElementById('downloadBtn');
    const newConversionBtn = document.getElementById('newConversionBtn');
    const loadingDiv = document.getElementById('loading');

    // Form gönderildiğinde
    ttsForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const text = document.getElementById('text').value.trim();

        if (!text) {
            alert('Lütfen bir metin girin.');
            return;
        }

        // Yükleniyor göster
        loadingDiv.style.display = 'block';
        resultDiv.style.display = 'none';

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            const data = await response.json();

            if (data.success) {
                // Ses dosyasını göster
                resultText.textContent = data.text;
                audioPlayer.src = data.file;
                downloadBtn.href = data.file;

                // Sonuçları göster, yükleniyor gizle
                resultDiv.style.display = 'block';
                loadingDiv.style.display = 'none';
            } else {
                alert('Hata: ' + (data.error || 'Bilinmeyen bir hata oluştu.'));
                loadingDiv.style.display = 'none';
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
            loadingDiv.style.display = 'none';
        }
    });

    // Yeni dönüşüm butonu
    newConversionBtn.addEventListener('click', function () {
        resultDiv.style.display = 'none';
        document.getElementById('text').value = '';
    });
});
