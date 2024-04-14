//将所有的md文件的图片路径 ![](/image/infra/tab.png) 改成 {% img url_for /image/infra/tab.png %}

var fs = require('fs')
var path=require('path');
 
var filePath=path.resolve(__dirname+'/source/_posts'); 

// -----------这是修改所有图片地址
// //readdir方法读取文件名
// //readFile方法读取文件内容
// //writeFile改写文件内容
// fs.readdir(filePath, 'utf8', function (err,data) {
 
// 	data.forEach(function(item, index) {
// 		//console.log(item)
// 		fs.readFile(filePath+'/'+item,'utf8',function(err,files){
// 			//console.log(files)
// 			// 将 ![](/image/infra/tab.png) 改成 {% img url_for /image/infra/tab.png %}
// 			var result = files.replace(/!\[\]\((\/image[^)]+)\)/g, '{% img url_for $1 %}')
 
// 			fs.writeFile(filePath+'/'+item, result, 'utf8', function (err) {
// 			     if (err) return console.log(err);
// 			});
 
// 		})
// 	});
 
// });


// // -----------这是获取所有md的header
const data = fs.readdirSync(filePath, 'utf8');
let headerStr = ''
let categoriesStr = ''
let tagsStr = ''
data.forEach(function(item, index) {
	const files = fs.readFileSync(filePath+'/'+item,'utf8')
	// 一定要加上150，因为header头基本上也就这么多字符，不做限制的话，可能文中有---
	headerStr = headerStr + '\n'+ files.replace(/[\s\S]*tags: ([\s\S]{1,150})\n---[\S\s]*/, '$1');
	categoriesStr = categoriesStr + '\n'+ files.replace(/[\s\S]*categories:([\s\S]{1,150})\n---[\S\s]*/, '$1')
	tagsStr = tagsStr + '\n'+ files.replace(/[\s\S]*(\ntags: [\s\S]{1,100})categories:[\S\s]*/, '$1')
	
});

fs.writeFile('./headerStr.md', headerStr, 'utf8', function (err) {
			if (err) return console.log(err);
	});
	
fs.writeFile('./headerCategories.md', categoriesStr, 'utf8', function (err) {
			if (err) return console.log(err);
	});
	
fs.writeFile('./headerTags.md', tagsStr, 'utf8', function (err) {
			if (err) return console.log(err);
	});
	


// // 这是单个文件
// let headerStr = ''
// const files = fs.readFileSync(filePath+'/'+'delicious.md','utf8')

// headerStr = headerStr + '\n'+ files.replace(/[\s\S]*(categories:[\s\S]{1,150})\n---[\S\s]*/, '$1')

// fs.writeFile('./headerStr.md', headerStr, 'utf8', function (err) {
// 			if (err) return console.log(err);
// 	});
	