function foo() {
    
}
foo.prototype.foo1 = function() {
    console.log("YO");
}

function yoo() {
    foo1();
}

var f = new foo;
f.call(yoo);