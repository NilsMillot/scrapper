const Scrapper = require("./Scrapper");

const scrap = new Scrapper(
  "https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP",
  {
    method: "GET",
    html: true,
  },
  (result) => {
    const allTabs = result.result.querySelectorAll(".wikitable");
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
    const finalTab = codeTab.map((code, index) => {
      return {
        code,
        text: textTab[index],
      };
    });
    console.log(
      "%cwikipediaWithScrapper.js line:33 finalTab",
      "color: #007acc;",
      finalTab
    );
  }
);

scrap.send();
