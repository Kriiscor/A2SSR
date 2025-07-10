import express from "express";
import fs from "fs";
import path from "path";
import process from "process";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "../src/App";

const app = express();
const port = 3000;

app.use("/assets", express.static(path.join(process.cwd(), "dist", "assets")));

app.get("*", async (req, res) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos = await response.json();

    const appHtml = ReactDOMServer.renderToString(<App todos={todos} />);
    const htmlPath = path.resolve(process.cwd(), "dist", "index.html");
    const htmlData = fs.readFileSync(htmlPath, "utf8");

    const finalHtml = htmlData
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
      .replace(
        "</body>",
        `<script>window.__INITIAL_DATA__ = ${JSON.stringify(
          todos
        )}</script></body>`
      );

    res.send(finalHtml);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("Cannot find index.html", error);
      res
        .status(500)
        .send(
          '<h1>Error: index.html not found</h1><p>Please run "npm run build" before starting the server.</p>'
        );
    } else {
      console.error("An unexpected error occurred", error);
      res.status(500).send("<h1>An unexpected error occurred</h1>");
    }
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
