var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function(req, resp) {
  pathname = url.parse(req.url).pathname;
  console.log(pathname);
  var file = pathname.substring(1, pathname.length);
  
  var type = file.split('.').pop();
  console.log('received request for type ' + type);

  fs.readFile(file, function(err, data) {
    if (err && err.code === 'ENOENT') {
      resp.statusCode = 404;
      resp.write('not found');
      resp.end();
      return;
    }
    else if (err) {
      resp.statusCode = 500;
      resp.write('internal error');
      resp.end();
      return;
    }
    
    
    var contentType;
    if (type === 'js') {
      contentType = 'text/javascript';
    }
    else if (type === 'css') {
      contentType = 'text/css';
    }
    else if (type === 'html') {
      contentType = 'text/html';
    } 
    else if (type === 'json') {
      contentType = 'application/json';
    }
    else if (type === 'jpg') {
      contentType = 'image/jpeg';
    }
    console.log("found contentType" + contentType);
    resp.writeHead(200, {
      'content-type': contentType,
      'content-length': data.length
    });
    resp.write(data);
    resp.end();
  });
}).listen(8080);
