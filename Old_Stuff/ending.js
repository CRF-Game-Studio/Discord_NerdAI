exports.ending = function(input) {
    var Return_obj = {};
    var fs = require("fs");
    var a = fs.readFileSync("word_detectEnding.txt", "utf-8");
    var target_msg = a.split("\r\n");
    for (i = 0; i < target_msg.length; i++) {
        if (input == target_msg[i]) {
            Return_obj.value = 100;
            var r = Math.floor(Math.random() * 4);
            switch (r) {
                case 0:
                    Return_obj.msg = response("word_sound_bye.txt");
                    break;
                default:
                    Return_obj.msg = response("word_return_bye.txt");
                    break;
            }
            i = target_msg.length;
            return Return_obj;
        }
    }
    Return_obj.value = 0;
    return Return_obj;
}

function response(filename) {
    var fs = require("fs");
    var a = fs.readFileSync(filename, "utf-8");
    var target_msg = a.split("\r\n");
    var r = Math.floor(Math.random() * target_msg.length);
    return target_msg[r];
}