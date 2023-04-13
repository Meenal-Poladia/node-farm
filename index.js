
const http = require("http");
const fs = require("fs");

const replaceTemplate = function (template, product) {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%PLACE%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
};

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");
const dataObject = JSON.parse(data);

const server = http.createServer((request, response) => {
    const baseURL = `http://${request.headers.host}`;
    const requestURL = new URL(request.url, baseURL);
    const pathName = requestURL.pathname;
    const query = requestURL.searchParams.get("id");
    // .searchParams returns this: URLSearchParams { 'id' => '1' }
    console.log(pathName, query);

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
        const product = dataObject[query];
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