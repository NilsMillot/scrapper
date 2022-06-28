const Scrapper = require("./Scrapper");

const scrap = new Scrapper(
  "https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP",
  {
    method: "GET",
    html: true,
  },
  (result) => {
    console.log(result.result);
  }
);

scrap.send();
