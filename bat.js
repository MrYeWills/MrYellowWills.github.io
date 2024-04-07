//将所有的md文件的图片路径 ![](/image/infra/tab.png) 改成 {% img url_for /image/infra/tab.png %}

var fs = require('fs')
var path=require('path');
 
var filePath=path.resolve(__dirname+'/source/_posts');  
//readdir方法读取文件名
//readFile方法读取文件内容
//writeFile改写文件内容
fs.readdir(filePath, 'utf8', function (err,data) {
 
	data.forEach(function(item, index) {
		//console.log(item)
		fs.readFile(filePath+'/'+item,'utf8',function(err,files){
			//console.log(files)
			// 将 ![](/image/infra/tab.png) 改成 {% img url_for /image/infra/tab.png %}
			var result = files.replace(/!\[\]\((\/image[^)]+)\)/g, '{% img url_for $1 %}')
 
			fs.writeFile(filePath+'/'+item, result, 'utf8', function (err) {
			     if (err) return console.log(err);
			});
 
		})
	});
 
});