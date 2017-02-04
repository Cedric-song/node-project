const express = require('express');
const app = express();
const xlsx = require("node-xlsx");


const list = xlsx.parse(__dirname + '/test.xlsx');

app.get('/list', function (req, res) {
  res.send({data:list})
})

const server = app.listen(7777, function () {

  const host = server.address().address
  const port = server.address().port

  console.log('Server is working!')
})

