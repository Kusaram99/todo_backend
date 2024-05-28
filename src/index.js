import { app } from './app.js'
import connectDB from './db/index.js';
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

app.get('/', (req, res) => {
    res.send('Hello World');
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("server is running on host " + process.env.PORT)
        })
    })
    .catch(err => console.log("connection failed: ", err));