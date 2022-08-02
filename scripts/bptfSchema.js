var axios = require('axios');

main();

async function main() {
    try {
        var pricelist_page = await axios(`https://backpack.tf/api/IGetPrices/v4?key=${process.argv[2]}`);
    } catch (error) {
        console.log(error);
        console.log("errr :(");
        return;
    }
	var pricelist = await pricelist_page.data;
	require('fs').writeFileSync('./schema_bptf.json', JSON.stringify(pricelist));
	var keyprice_high = pricelist.response.items["Mann Co. Supply Crate Key"].prices[6].Tradable.Craftable[0].value_high;
	var keyprice = pricelist.response.items["Mann Co. Supply Crate Key"].prices[6].Tradable.Craftable[0].value;
	if (keyprice_high != undefined) {
		k1 = parseFloat(keyprice_high);
		k2 = parseFloat(keyprice);
		keyprice = (k1 + k2) / 2;
		keyprice = Math.trunc(keyprice * 100) / 100;
	}
	require('fs').writeFileSync('./keyprice.txt', keyprice.toString());
}
