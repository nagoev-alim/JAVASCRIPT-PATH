const express = require('express')
const path = require('path')

/* Set port. */
const PORT = process.env.PORT ?? 3000

/* Creating an express application. */
const app = express()

app.use('/static', express.static(path.resolve(__dirname, 'frontend', 'static')));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

/* This is a callback function that is called when the server is started. */
app.listen(PORT, () => console.log(`📌 Server started on port ${PORT}...`))
