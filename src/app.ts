import express from 'express';
import path from 'path';
const app = express()
const port = 5000

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/api/users', (req, res) => res.json({users: ['bob']}))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))