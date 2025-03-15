const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const gtts = require('gtts');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Create directory to store audio files
const outputDir = path.join(__dirname, 'public', 'audio');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Text-to-speech conversion POST request
app.post('/convert', (req, res) => {
    const text = req.body.text;
    const language = req.body.language || 'en'; // Language parameter, default is English

    if (!text) {
        return res.status(400).json({ error: 'Text field cannot be empty' });
    }

    // Generate unique file name
    const fileName = `speech-${uuidv4()}.mp3`;
    const filePath = path.join(outputDir, fileName);
    const fileUrl = `/audio/${fileName}`;

    // Create Google TTS object
    const speech = new gtts(text, language);

    // Convert text to speech file
    speech.save(filePath, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred during speech conversion' });
        }

        res.json({
            success: true,
            file: fileUrl,
            text: text,
            language: language
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Application running at http://localhost:${port}`);
});
