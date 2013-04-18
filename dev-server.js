var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function(req, resp) {
  pathname = url.parse(req.url).pathname;
  console.log(pathname);
  if (pathname === '/') {
    pathname = '/index.html';
  }
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
    
    fs.stat(file, function(err, stat) {
      if (err) {
        resp.statusCode = 500;
        resp.end();
        return;
      }
      
      var etag = stat.size + '-' + Date.parse(stat.mtime);
      
      if (req.headers['if-none-match'] === etag) {
        resp.statusCode = 304;
        resp.setHeader('last-modifiled', stat.mtime);
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
        'content-length': data.length,
        'etag': etag,
        'last-modified': stat.mtime
      });
      resp.write(data);
      resp.end();
    });
  });
}).listen(8080);
