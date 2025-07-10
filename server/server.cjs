const express = require("express");
const fs = require("fs");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const App = require("../src/App").default;

const app = express();
const port = 3000;

app.use('/assets', express.static(path.join(process.cwd(), 'build', 'assets')));

app.get("*", async (req, res) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos = await response.json();

    const appHtml = ReactDOMServer.renderToStaticMarkup(
      React.createElement(App, { todos })
    );

    const htmlPath = path.resolve(process.cwd(), "build", "index.html");
    let htmlData = fs.readFileSync(htmlPath, "utf8");

    htmlData = htmlData
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
      .replace(/<script.*?>.*?<\/script>/g, "");

    res.send(htmlData);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).send("Something went wrong");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
