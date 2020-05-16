var fs = require('fs')
var token = fs.readFileSync('token.txt', 'utf8');
if(token!=""){
    console.log('Get token success');

    var update = fs.readFileSync('template.js', 'utf8');
    update = update.replace('token', token);
    fs.writeFile('temp.js', update, (err) => {
        if (err) console.log(err);
        console.log('Updated token');
    });
}
else{
    console.log("Set your bot token before");
    
}




