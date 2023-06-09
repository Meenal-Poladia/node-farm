//Core modules
const http = require("http");
const fs = require("fs");

//A 3rd part library to add query parameters like this /id=baby-carrots
const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");
const dataObject = JSON.parse(data);

const slugs = dataObject.map(item => slugify(item.productName, { lower: true }));
dataObject.map((item, i) => item["slug"] = slugs[i]);

const server = http.createServer((request, response) => {
    const baseURL = `http://${request.headers.host}`;
    const requestURL = new URL(request.url, baseURL);
    const pathName = requestURL.pathname;
    const query = requestURL.searchParams.get("id");
    // .searchParams returns this: URLSearchParams { 'id' => '1' }

    //This is the overview page
    if(pathName === "/" || pathName === "/overview") {
        response.writeHead(200, {
            "Content-Type": "text/html",
        })
        const cardsHtml = dataObject.map(item => replaceTemplate(templateCard, item)).join("");
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        response.end(output);
    }
    //Product Page
    else if(pathName === "/product") {
        const productId = dataObject.findIndex(item => item.slug === query);
        const product = dataObject[productId];
        response.writeHead(200, {
            "Content-Type": "text/html",
        })
        const output = replaceTemplate(templateProduct, product);
        response.end(output);
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