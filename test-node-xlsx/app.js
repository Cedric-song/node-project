const express = require('express');
const xlsx = require("node-xlsx");
const multipart = require('connect-multiparty');
const path = require('path')
const fs = require('fs')

const app = express();

app.use(express.static('./public'));

const list = xlsx.parse(__dirname + '/test.xlsx')[0].data;
app.get('/list', function (req, res) {
  res.send({data:list})
})

const server = app.listen(7777, function() {

  const host = server.address().address
  const port = server.address().port

  console.log('Server is working!')
})


// const file = __dirname + '/db/test-node-xlsx.db'

// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database(file);

// db.serialize(function() {

//   var stmt = db.prepare("INSERT INTO record VALUES (?,?,?,?,?,?)");
//   for (var i = 1; i < list.length - 1; i++) {
//     stmt.run(list[i][1], list[i][3], list[i][5], list[i][9], list[i][10], list[i][25]);
//   }
//   stmt.finalize();

// });

// db.close();


app.post('/uploadFile', multipart(), function(req, res) {
  //get filename
  const filename = req.files.files.originalFilename || path.basename(req.files.files.ws.path);
  //copy file to a public directory
  const targetPath = path.dirname(__filename) + '/public/' + filename;
  //copy file
  fs.createReadStream(req.files.files.ws.path).pipe(fs.createWriteStream(targetPath));
  //return file url
  res.json({
    code: 200,
    msg: {
      url: 'http://' + req.headers.host + '/' + filename
    }
  });
});


app.get('/env', function(req, res){
  console.log("process.env.VCAP_SERVICES: ", process.env.VCAP_SERVICES);
  console.log("process.env.DATABASE_URL: ", process.env.DATABASE_URL);
  console.log("process.env.VCAP_APPLICATION: ", process.env.VCAP_APPLICATION);
  res.json({
    code: 200
    , msg: {
      VCAP_SERVICES: process.env.VCAP_SERVICES
      , DATABASE_URL: process.env.DATABASE_URL
    }
  });
});