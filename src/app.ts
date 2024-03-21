import fs from "fs";
import path from "path";
import args from "args";
import genPersonality from "./genPersonality";
import Loading from "./Loading";
import {
  INPUT_FOLDER,
  JSON_INPUT_FOLDER,
  OUTPUT_FOLDER,
  PDF_INPUT_FOLDER,
  TEMP_FOLDER,
} from "./paths";
import { analyzeJson, analyzePdf } from "./analyzer";

args
  .option("gen-personalities", "Gen personalities to analyze", 0)
  .option("analyze", "Analyze inputs to gen training files", false);

const flags = args.parse(process.argv);

const folders = [
  INPUT_FOLDER,
  JSON_INPUT_FOLDER,
  PDF_INPUT_FOLDER,
  OUTPUT_FOLDER,
  TEMP_FOLDER,
];

for (const folder of folders) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
}

const jsonInputFiles = fs.readdirSync(JSON_INPUT_FOLDER);
const pdfInputFiles = fs.readdirSync(PDF_INPUT_FOLDER);

async function main() {
  if (flags.genPersonalities > 0) {
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
  }
  if (flags.analyze) {
    const fileName = `${Date.now()}.json`;
    const loading = new Loading();
    for (let i = 0; i < jsonInputFiles.length; i++) {
      loading.start(
        `Analyzing JSON inputs [${i + 1}/${jsonInputFiles.length}]`
      );
      await analyzeJson(
        path.join(JSON_INPUT_FOLDER, jsonInputFiles[i]),
        path.join(OUTPUT_FOLDER, fileName)
      );
      loading.stop(`JSON inputs analyzed! [${i + 1}/${jsonInputFiles.length}]`);
    }
    loading.start("Analyzing PDF inputs");

    // made by me
    for (let i = 0; i < pdfInputFiles.length; i++) {
      loading.start(`Analyzing JSON inputs [${i + 1}/${pdfInputFiles.length}]`);
      await analyzePdf(
        path.join(PDF_INPUT_FOLDER, pdfInputFiles[i]),
        path.join(OUTPUT_FOLDER, fileName)
      );
      loading.stop(`PDF inputs analyzed! [${i + 1}/${pdfInputFiles.length}]`);
    }
  }
  process.exit(0);
}

main();
