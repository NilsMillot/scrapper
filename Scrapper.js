const https = require("https");
const http = require("http");
const { JSDOM } = require("jsdom");

module.exports = function Scrapper(url, options = {}, callback) {
  const protocol = url.startsWith("https") ? https : http;
  let { method = "GET", headers = {}, body = null, ...restOptions } = options;

  if (body) {
    if (typeof body === "object") {
      if (headers["Content-Type"] === "application/json") {
        body = JSON.stringify(body);
      }
      if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
        body = new URLSearchParams(body).toString();
      }
    }
    body = body instanceof Buffer ? body : Buffer.from(body);
    headers["Content-Length"] = body.length;
  }

  const request = protocol.request(
    url,
    {
      method,
      headers,
      ...restOptions,
    },
    (res) => {
      // Récupération du contenu de la réponse
      let data = Buffer.alloc(0);
      res.on("data", (d) => {
        data = Buffer.concat([data, d]);
      });
      res.on("end", () => {
        let result = null;
        // Parser la réponse
        if (res.headers["content-type"].indexOf("application/json") !== -1) {
          const charset = res.headers["content-type"].match(/charset=([\w-]+)/);
          result = JSON.parse(data.toString(charset[1]));
        }
        if (options.html) {
          const dom = new JSDOM(data);
          const { document } = dom.window;
          const allTabs = document.querySelectorAll(".wikitable");
          let codeTab = [];
          let textTab = [];
          for (var i = 0; i < allTabs.length; ++i) {
            const temp = allTabs[i].querySelectorAll("tr");
            for (var j = 0; j < temp.length - 1; j++) {
              textTab = [
                ...textTab,
                temp[j + 1].querySelectorAll("td")[0].textContent?.slice(0, -1),
              ];
              codeTab = [
                ...codeTab,
                temp[j + 1].querySelectorAll("th")[0].textContent?.slice(0, -1),
              ];
            }
          }
          result = codeTab.map((code, index) => {
            return {
              code,
              text: textTab[index],
            };
          });
        }
        // Traiter la réponse
        callback({ status: res.statusCode, result });
      });
    }
  );

  if (body) {
    request.write(body);
  }

  this.send = function () {
    request.end();
  };
};
