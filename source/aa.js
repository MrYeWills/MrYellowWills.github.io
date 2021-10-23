var dd = 1;
var cc = {};
function aa(){

    var num = 10;
    cc.fn = function (params) {
        num = num+1;
        console.log(num)
    }
}

aa()
cc.fn()