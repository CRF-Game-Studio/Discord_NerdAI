var fs = require('fs');
var xmlParse = require('xml2js').parseString;
var strDectect = {};
var strReturn = {};

function dividType(msg) {
    msg = msg.toLowerCase();
    for (var i in strDectect.skill)
        if (msg.includes(strDectect.skill[i])) return 1;
    for (var i in strDectect.lucky)
        if (msg.includes(strDectect.lucky[i])) return 2;
    for (var i in strDectect.sad)
        if (msg.includes(strDectect.sad[i])) return 3;
    return 0;
}

function loadStr() {
    xmlParse(fs.readFileSync("word_playing.xml"), (err, res) => {
        strDectect = res.word.detect[0];
        strReturn = res.word.return[0];
    })
}

exports.playing = function(msg) {
    var obj = {};
    loadStr();
    var type = dividType(msg);
    if (type == 1) {
        var r = Math.floor(Math.random() * (strReturn.skill.length + strReturn.common.length));
        if (r >= strReturn.skill.length)
            obj.msg = strReturn.common[r - strReturn.skill.length];
        else obj.msg = strReturn.skill[r];
    } else if (type == 2) {
        var r = Math.floor(Math.random() * (strReturn.lucky.length + strReturn.common.length));
        if (r >= strReturn.lucky.length)
            obj.msg = strReturn.common[r - strReturn.lucky.length];
        else obj.msg = strReturn.lucky[r];
    } else if (type == 3) {
        var r = Math.floor(Math.random() * strReturn.comfort.length);
        obj.msg = strReturn.comfort[r];
    }
    if (type) obj.value = 100;
    else obj.value = 0;
    return obj;
}
