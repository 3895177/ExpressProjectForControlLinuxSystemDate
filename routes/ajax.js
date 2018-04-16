var express = require('express');
var os = require('os');
var fs = require('fs');
var childProcess = require('child_process');
var router = express.Router();

var file = "config/server.json";
var result = JSON.parse(fs.readFileSync(file));
var serverNames = result.server_names;





function isServersRun(stdout) {
  var result = [];
  for (let i = 0; i < serverNames.length; i++) {
    let processName = serverNames[i];

    if (stdout.indexOf(processName) >= 0) {
      result[i] = true;
    } else {
      result[i] = false;
    }
  }
  return result;
}

router.post('/', function (req, res) {


  // res.json({success:true});
  let code = req.body.code;
  console.log(req.body);
  // res.json({success:true,data:"指令错误：" + code})
  if (code == 'resetServer') {
    resetServer(req, res);
  } else if (code == 'setTime') {
    setTime(req, res);
  } else if (code == 'checkServer') {
    checkServer(req, res);
  } else if (code == 'startServer') {
    startServer(req, res);
  } else if (code == 'stopServer') {
    stopServer(req, res);
  } else {
    res.json({ success: true, data: "指令错误：" + code })
  }

});

function getDateString(res) {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let time = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second;

  return time;

}


function stopServer(req, res) {
  var cmd = "sh /data/hunfu/server/S1/bin/stop.sh";
  var exec = require('child_process').exec;
  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      return console.log(err);
    }

    console.log(stdout);
  });
  res.json({ note: "正在关闭中..." })
}

function startServer(req, res) {
  var cmd = os.platform() == 'win32' ? 'tasklist' : 'ps -ef | grep S1';
  var exec = require('child_process').exec;
  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      return console.log(err);
    }
    var runs = isServersRun(stdout);
    if (runs.join("&").indexOf('true') >= 0) {
      res.json({ note: "有服务运行中，全部关闭后再开启" })
      return;
    }

    // var cmd = "sh /data/hunfu/server/S1/bin/start.sh";
    // var ex = require('child_process').exec;
    // ex(cmd, function (e, o, oe) {
    //   console.log(e,o,oe,'信息');
    //   if (e) {
    //     return console.log(e);
    //   }
    //   console.log(o);
    // });
    // res.json({ note: "正在启动中..." })

    childProcess.execFile("/data/hunfu/server/S1/bin/start.sh", [], 
      {cwd:'/data/hunfu/server/S1/bin/'},
      function (e, o, se) {
        if (e) {
          return console.log(e);
        }
        console.log("执行.....");
        console.log(o);
        console.log(se);
        console.log("执行结束.");
      }
    );
    res.json({ note: "正在启动中..." });

  });


}

function checkServer(req, res) {
  var cmd = os.platform() == 'win32' ? 'tasklist' : 'ps -ef | grep S1';
  var exec = require('child_process').exec;
  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      return console.log(err);
    }
    res.json({ status: isServersRun(stdout), date: getDateString() });
  });
}

function resetServer(req, res) {
  res.json({ note: "未实现脚本" })
}

function setTime(req, res) {
  let date = req.body.date;
  if (date.length < 17) {
    childProcess.exec('ntpdate 202.118.1.130' + date, function (error, stdout, stderr) {
      if (error !== null) {
        res.json(error);
      } else {
        res.json({ "success": true })
      }
    });

  } else {
    childProcess.exec("date -s '" + date + "'", function (error, stdout, stderr) {
      if (error !== null) {
        res.json(error);
      } else {
        res.json({ "success": true })
      }
    });
  }
}
module.exports = router;
