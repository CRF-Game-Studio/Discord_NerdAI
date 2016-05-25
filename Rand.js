module.exports = function (begin, end) {
	if (end) return Math.floor(Math.random() * (begin - end + 1)) + begin;
	else return Math.floor(Math.random() * begin);
}