import fs from "fs";
import path from "path";
import Loading from "../utils/loading";
import { JSON_INPUT_FOLDER } from "../utils/paths";
import genPersonality from "../utils/genPersonality";
import { IOption } from "../interfaces/IOption";

const genPersonalities: IOption = {
  flags: ["g", "genPersonalities"],
  fn: async (flags) => {
    const fileName = `${Date.now()}.json`;
    const personalities: { text: string }[] = [];
    const loading = new Loading();
    for (let i = 0; i < flags.genPersonalities; i++) {
      loading.start(
        `Generating personality [${i + 1}/${flags.genPersonalities}]`
      );
      personalities.push(await genPersonality(i > flags.genPersonalities / 2));
      fs.writeFileSync(
        path.join(JSON_INPUT_FOLDER, fileName),
        "[" +
          personalities.map((person) => JSON.stringify(person)).join(",\n") +
          "]"
      );
      loading.stop(
        `Personality generated! [${i + 1}/${flags.genPersonalities}]`
      );
    }
  },
};

export default genPersonalities;
