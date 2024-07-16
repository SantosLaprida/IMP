const puppeteer = require('puppeteer');

const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.pgatour.com/tournaments/2024/the-open-championship/R2024100');

  // Espera a que los elementos estén presentes
  await page.waitForSelector('.leaderboard__name');

  const data = await page.evaluate(() => {
    // Utilizar XPath para seleccionar los elementos del nombre y el ranking
    const nameNodes = document.evaluate(
      '//span[contains(@class, "leaderboard__name")]/strong',
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    const rankingNodes = document.evaluate(
      '//td[contains(@class, "table__cell--grey-dark table__cell--owgr")]/div',
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    const results = [];

    for (let i = 0; i < nameNodes.snapshotLength; i++) {
      const nameNode = nameNodes.snapshotItem(i);
      const name = nameNode.textContent.trim() + nameNode.nextSibling.nodeValue.trim();

      // Asegurarse de que el índice de rankingNodes corresponda al nombre correcto
      const rankingNode = rankingNodes.snapshotItem(i);
      const ranking = rankingNode ? rankingNode.textContent.trim() : 'N/A';

      results.push({ name, ranking });
    }

    return results;
  });

  console.log(data);

  await browser.close();
};

scrape()