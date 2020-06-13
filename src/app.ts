import express from 'express';
import path from 'path';
const app = express()

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/api/users', (req, res) => res.json({users: ['bob']}))

app.listen(process.env.PORT || 5000, () => console.log(`Example app listening at http://localhost:${port}`))