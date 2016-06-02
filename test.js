var msg = "YOOO:六六六 九九九:LLL:123 OAO";
var result = [];
msg = msg.split(":");
for (var i in msg) {
	msg[i] = msg[i].split(" ");
	for (var j in msg[i])
		result.push(msg[i][j]);	
}	
console.log(result);