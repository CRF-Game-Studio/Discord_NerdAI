function f(s) {
    var INT_NUM = parseInt(s);
    var return_str = "";
    if (INT_NUM / 10 == 0) {
        s = "0" + s;
    }
    if (INT_NUM % 10 == 0) {
        console.log("if  " + s[0]);
        return_str = num2cht(s[0]);
    }
    else {
        return_str = num2cht(s[0]) + num2cht(s[1]);
    }
    return return_str;
}

function num2cht(str) {
    var ss = "一二三四五六七八九";
    return ss[parseInt(str) - 1];
}

module.exports = f;