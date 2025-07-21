const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// API endpoint to get time from C program
app.get('/api/time', (req, res) => {
    const format = req.query.format === '24' ? '24' : '12';
    const exe = process.platform === 'win32' ? 'clock_server.exe' : './clock_server';
    execFile(path.join(__dirname, exe), [format], (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: 'C program error', details: stderr });
        }
        try {
            const data = JSON.parse(stdout);
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: 'Invalid JSON from C program', details: stdout });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Digital Clock server running at http://localhost:${PORT}`);
}); 