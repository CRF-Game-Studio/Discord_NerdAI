exports.review = function (input) {
    var return_obj = {};
    var fs = require("fs");
    var a = fs.readFileSync("word_gamedeal.txt", "utf-8");
    var target_msg = a.split("\r\n");
    var str_index;
    for (i = 0; i < target_msg.length; i++) {
        str_index = input.indexOf(target_msg[i]);
        if (str_index != -1) {
            return_obj.value = 100;
            input = input.substring(0, str_index);
            break;
        }
    }
    a = fs.readFileSync("word_我詞窮了.txt", "utf-8");
    target_msg = a.split("\r\n");
	for (i = 0; i < target_msg.length; i++) {
        str_index = input.indexOf(target_msg[i]);
        if (str_index != -1) {
            input = input.substring(0, str_index);
            i = 0;
        }
    }
    return_obj.msg = "你是想問" + input + "的評價嗎?";
    return return_obj;
}
