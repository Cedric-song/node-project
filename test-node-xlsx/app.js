const express = require('express');
const app = express();
const xlsx = require("node-xlsx");


const list = xlsx.parse(__dirname + '/test.xlsx')[0].data;
// app.get('/list', function (req, res) {
//   res.send({data:list})
// })

const server = app.listen(7777, function () {

  const host = server.address().address
  const port = server.address().port
  
  console.log('Server is working!')
})


const file = __dirname + '/db/test-node-xlsx.db'

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {

  var stmt = db.prepare("INSERT INTO record VALUES (?,?,?,?,?)");
  for (var i = 1; i < list.length-1; i++) {
      stmt.run(list[i][1],list[i][3],list[i][5],list[i][9],list[i][10]);
  }
  stmt.finalize();

});

db.close();