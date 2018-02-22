var f2 = foo2;
function foo() {
	console.log("abc");
	foo2();
}

function foo2() {
	console.log("def");
}
foo();