const express = require('express');
const xlsx = require("node-xlsx");
const multipart = require('connect-multiparty');
const path = require('path')
const fs = require('fs')

const app = express();

app.use(express.static('./public'));


const server = app.listen(3000, function() {

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
    // if (filename == null){ _json.msg = 'please choose a file' };
    //copy file to a public directory
    const targetPath = path.dirname(__filename) + '/public/files/' + filename;
    //copy file
    //return file url

    if (filename.endsWith('xlsx')) {
        fs.createReadStream(req.files.files.ws.path).pipe(fs.createWriteStream(targetPath));
        let _json = Object.assign(successJson)
        _json.result = {
            url: 'http://' + req.headers.host + '/' + filename,
            targetPath: targetPath
        }
        res.json(_json);
    } else {
        let _json = Object.assign(failJson)
        _json.msg = 'please upload xlsx file'
        res.json(_json);
    }
});


app.get('/getList', function(req, res) {
    const list = xlsx.parse(req.query.targetPath)[0].data;
    let h = list.shift()
    let arr = []
    list.forEach(function(item) {
        arr.push({
            cardID: item[h.indexOf('考勤号码')],
            date: item[h.indexOf('日期')],
            name: item[h.indexOf('姓名')],
            ondutyTime: item[h.indexOf('签到时间')],
            offdutyTime: item[h.indexOf('签退时间')],
            isOnTime: getDelay(item[h.indexOf('签到时间')],item[h.indexOf('签退时间')],item[h.indexOf('日期')]) == 1 ? '是' : '否',
            isOverTime: item[h.indexOf('签退时间')] !== "" && item[h.indexOf('签退时间')].slice(0, 2) > 20 ? '是' : '否',
            overTimeLength: createOverTimeLength(item[h.indexOf('签退时间')], '18:00')
        })
    })

    // let _json = Object.assign(successJson)
    // _json.result = {
        // data: arr
    // }
    // res.json(_json)
    res.json(arr)
})


app.get('/env', function(req, res) {
    console.log("process.env.VCAP_SERVICES: ", process.env.VCAP_SERVICES);
    console.log("process.env.DATABASE_URL: ", process.env.DATABASE_URL);
    console.log("process.env.VCAP_APPLICATION: ", process.env.VCAP_APPLICATION);
    res.json({
        code: 200,
        msg: {
            VCAP_SERVICES: process.env.VCAP_SERVICES,
            DATABASE_URL: process.env.DATABASE_URL
        }
    });
});


function createOverTimeLength(offdutyTime, dutyTime) {
    if (offdutyTime === "") {
        return 0
    }
    const odt = Number.parseInt(offdutyTime.slice(0, 2)) * 60 + Number.parseInt(offdutyTime.slice(3))
    const dt = Number.parseInt(dutyTime.slice(0, 2)) * 60 + Number.parseInt(dutyTime.slice(3))
    if (odt - dt > 120) {
        return odt - dt
    }
    return 0
}

function getDelay(offdutyTime,dutyTime,day){
    if( (offdutyTime === "" || offdutyTime === "")){
        return 0
    }
    startTime = "09:00"
    endTime = "17:30"
    const st = Number.parseInt(startTime.slice(0,2))*60
    const et = Number.parseInt(endTime.slice(0,2))*60
    const wt = et - st
    const odt = Number.parseInt(offdutyTime.slice(0, 2)) * 60 + Number.parseInt(offdutyTime.slice(3))
    const dt = Number.parseInt(dutyTime.slice(0, 2)) * 60 + Number.parseInt(dutyTime.slice(3))
    const rwt = dt - odt
    if ((odt <= st) && (dt >=et) && (rwt>=wt)){
        return 1
    }
    return 0
}

var successJson = {
    code: 200,
    msg: 'success',
    result: {}
}

var failJson = {
    code: 100,
    msg: 'fail',
    result: {}
}