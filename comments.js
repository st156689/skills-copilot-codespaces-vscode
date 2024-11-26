// create web server and listen for incoming requests
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const comments = [];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    if (req.method === 'POST' && pathname === '/comment') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const comment = JSON.parse(body);
            comments.push(comment);
            res.end('Comment added');
        });
    } else if (req.method === 'GET' && pathname === '/comments') {
        res.end(JSON.stringify(comments));
    } else {
        const filePath = path.join(__dirname, pathname);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end('Not found');
            } else {
                res.end(data);
            }
        });
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
