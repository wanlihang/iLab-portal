const TOKEN_NAME = 'meedu-user-token';
const MSV_NAME = 'meedu-msv';

export default {
  getToken() {
    return window.localStorage.getItem(TOKEN_NAME);
  },
  saveToken(token) {
    window.localStorage.setItem(TOKEN_NAME, token);
  },
  clearToken() {
    window.localStorage.removeItem(TOKEN_NAME);
  },
  saveMsv(msv) {
    window.localStorage.setItem(MSV_NAME, msv);
  },
  clearMsv() {
    window.localStorage.removeItem(MSV_NAME);
  },
  getMsv() {
    return window.localStorage.getItem(MSV_NAME);
  },
  getShareHost() {
    let hash = window.location.hash;
    if (hash.match("#")) {
      hash = "/#/"
    } else {
      hash = ""
    }
    let host = window.location.protocol +
      "//" +
      window.location.host + hash;

    return host;
  },
  currentDate() {
    const Manba = require('manba');
    return Manba().format('YYYY/MM/DD h:mm:ss');
  },
  getHMS(time) {
    const hour =
      parseInt(time / 3600) < 10 ?
        "0" + parseInt(time / 3600) :
        parseInt(time / 3600);
    const min =
      parseInt((time % 3600) / 60) < 10 ?
        "0" + parseInt((time % 3600) / 60) :
        parseInt((time % 3600) / 60);
    const sec =
      parseInt((time % 3600) % 60) < 10 ?
        "0" + parseInt((time % 3600) % 60) :
        parseInt((time % 3600) % 60);
    return hour + ":" + min + ":" + sec;
  },
  random(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      default:
        return 0;
    }
  },
  copyright() {
    var outs = [],
      fi = function () {
        return {
          msg: "",
          style: ""
        }
      };

    var oi = fi();
    oi.msg = "  MeEdu - 在线教育培训解决方案";
    oi.style = "padding-top: 15px;padding-bottom:15px;line-height:30px;font-size:1.8rem;color:#3ca7fa";
    outs.push(oi);

    oi = fi();
    oi.msg = "\r\n官网：\nhttps://meedu.vip\r\n\r\nGitHub：\nhttps://github.com/qsnh/meedu\r\n\r\n使用手册：\nhttps://www.yuque.com/meedu/fvvkbf\r\n";
    outs.push(oi);

    outs.map(function (x) {
      console.log("%c" + x.msg, x.style);
    });
  }
}