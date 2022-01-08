if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { checkToken } = require('./middleware/auth')

const users = require('./routes/api/users.js')

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true,
})


app.use(bodyParser.json());
app.use(checkToken);
app.use('/api/users', users);
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.port || 3002;

app.listen(port,()=>{
    console.log(`Server running on ${port}`)
})
 