var express = require('express');
var router = express.Router();

var process = require('child_process');

/* GET home page. */
router.get('/', function (req, res, next) {

  render(res);

});




function render(res) {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let time = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second;

  res.render("index", {
    time: time,
    name: "name",
    id: "id",
    title: 'Express',
  });

}

module.exports = router;
