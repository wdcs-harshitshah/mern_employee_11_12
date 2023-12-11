require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();
require ('./db/conn')
const router = require ('./Routes/router')

const PORT = 6010;

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('./uploads'))
app.use('/files', express.static('./public/files'))
app.use(router)

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
