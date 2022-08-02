const axios = require('axios');
const vdf = require('vdf');
const fs = require('fs');

main();

async function main() {
    try {
        var protoObjs_page = await axios(`https://raw.githubusercontent.com/SteamDatabase/GameTracking-TF2/master/tf/resource/tf_proto_obj_defs_english.txt`);
    } catch (error) {
        console.log(error);
        console.log("errr :(");
        return;
    }
	var parsed = vdf.parse(protoObjs_page.data);
	for (var lang in parsed) {
		var tokens = parsed[lang].Tokens;
	}
	skin_list = {};
	for (var token in tokens) {
		var tokenSplit = token.split("_");
		var type = tokenSplit[0];
		var id = tokenSplit[1];
		var name = tokens[token];
		if (name.startsWith(`${id}`)) {
			continue;
		}
		if (type == 9) {
			skin_list[id] = name;
		}
	}
	await fs.writeFileSync("./skins.json", JSON.stringify(skin_list));
}