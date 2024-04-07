const { exec } = require('child_process');

exec('git status', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if(/[^\w]blog_code[^\w]/.test(stdout)){
        // blog_code 先不能提交
         console.error(`blog_code分支不允许提交`);
        process.exit(1)
    }
  });
