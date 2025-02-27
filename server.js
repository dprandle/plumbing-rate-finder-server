const http = require('http');
const fs = require('fs');
const os = require('os');
const mime_types = require('mime-types');

const hostname = os.hostname(); 
const port = 80;

function serve_file(local_path, res) {
    let mtype = mime_types.lookup(local_path);
    console.log(`Got mime type:${mtype} trying to read file ${local_path}`);
    fs.readFile(local_path, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error: ' + err);
        } else {
            res.writeHead(200, { 'Content-Type': mtype });
            res.end(data);
        }
    });
}

const server = http.createServer((req, res) => {
    let { url, method } = req;
    if (method === 'GET') {
        let file_served = 'public' + url;
        if (url === '/plumbing-rate-finder/') {
            file_served += 'index.html';
        }
        else if (url === '/plumbing-rate-finder') {
            file_served += '/index.html';
        }
        file_served = file_served.replace('/plumbing-rate-finder/','/');
        serve_file(file_served, res);
        console.log(`Got request with url ${url} serving file at ${file_served}`);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
