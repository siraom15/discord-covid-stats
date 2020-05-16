var fs = require('fs')
var token = fs.readFileSync('../token.txt', 'utf8');
token = token.trim();

if (token !== "") {
    console.log('Get token success');

    var update = fs.readFileSync('template.js', 'utf8');
    update = update.replace('token', token);
    fs.writeFile('temp.js', update, (err) => {
        if (err) console.log(err);
        console.log('Updated token');
    });
}
else {
    console.log('\x1b[36m%s\x1b[0m', 'Set bot token first');

}




