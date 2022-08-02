const axios = require("axios");
const fs = require("fs");

main();

async function getPrices(name) {
    let start = 0;
    let count = 1;
    let items = [];
    let lastRequest = 0;
    do {
        let currentTime = new Date().getTime() / 1000;
        let timeBetween = 12.5;
        if (currentTime - lastRequest < timeBetween) {
            await new Promise(resolve => setTimeout(resolve, (lastRequest + timeBetween - currentTime) * 1000));
        }
        lastRequest = new Date().getTime() / 1000;
        let response;
        console.log(`${start}/${count} of ${name}`);
        try {
            response = await axios(`https://steamcommunity.com/market/search/render/?query=${name}&start=${start}&count=100&search_descriptions=0&sort_column=name&sort_dir=desc&appid=440&norender=1`);
        } catch (error) {
            console.log(error);
            console.log("errr :(");
            return [];
        }

        let data = response.data;
        if (data.total_count == 0) {
            console.log("They are trying to bamboozle us!") ;
            continue;
        }
        items.push(...data.results);
        count = data.total_count;
        start += 100;
    } while (start < count)
    return items;
}

async function main() {
    let a = await getPrices("Killstreak");
    let b = await getPrices("(Factory New)");
    let c = await getPrices("(Minimal Wear)");
    let d = await getPrices("(Field-Tested)");
    let e = await getPrices("(Well-Worn)");
    let f = await getPrices("(Battle Scarred)");

    let items = [...a, ...b, ...c, ...d, ...e, ...f];

    let itemsWithoutDuplicates = [...new Set(items.map(a => a.name))].map(a => items.find(b => b.name === a));
    fs.writeFileSync("../marketPrices.json", JSON.stringify(itemsWithoutDuplicates));
}