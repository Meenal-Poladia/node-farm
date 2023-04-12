const http = require("http");
const fs = require("fs");

const url = require("url");

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`);
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`);
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");
const dataObject = JSON.parse(data);

const server = http.createServer((request, response) => {
    const pathName = request.url

    //This is the overview page
    if(pathName === "/" || pathName === "/overview") {
        response.writeHead(200, {
            "Content-Type": "text/html",
        })
        response.end(templateOverview);
    }
    //Product Page
    else if(pathName === "/product") {
        response.end("This is the Product Page");
    }
    //API
    else if(pathName === "/api") {
        response.writeHead(200, {
            "Content-Type": ""
        })
        response.end(data);
    }
    //Not found Page
    else {
        response.writeHead(400, {
            "Content-Type": "text/html",
            "my-own-header": "Hello World"
        })
        response.end("<h1>Page not found</h1>");
    }
})

server.listen(8080, "127.0.0.1", () => {
    console.log(`Listening to requests on port 8000`)
});