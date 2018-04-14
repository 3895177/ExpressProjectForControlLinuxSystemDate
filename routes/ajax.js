var express = require('express');
var router = express.Router();

var process = require('child_process');



router.post('/', function (req, res) {

    // res.json({success:true});
    let code = req.body.code;
    console.log(req.body);
    // res.json({success:true,data:"指令错误：" + code})
    if(code == 'resetServer'){
        resetServer(req,res);
    }else if(code == 'setTime'){
        setTime(req,res);
    }else{
        res.json({success:true,data:"指令错误：" + code})
    }
  
});

function resetServer(req,res){
    
    res.json({note:"未实现脚本"})
}

function setTime(req,res){
    let date = req.body.date;
    if (date.length < 17) {
      process.exec('ntpdate 202.118.1.130' + date, function (error, stdout, stderr) {
        if (error !== null) {
            res.json(error);
        }else{
          res.json({"success":true})
        }
      });
      
    } else {
      process.exec("date -s '" + date + "'", function (error, stdout, stderr) {
        if (error !== null) {
          res.json(error);
        }else{
          res.json({"success":true})
        }
      });
    }
}
module.exports = router;
