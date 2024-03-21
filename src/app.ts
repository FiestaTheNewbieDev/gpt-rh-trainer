import fs from "fs";
import path from "path";
import args from "args";
import genPersonality from "./genPersonality";
import Loading from "./loading";
import {
  ANALYZED_FILE,
  INPUT_FOLDER,
  JSON_INPUT_FOLDER,
  OUTPUT_FOLDER,
  PDF_INPUT_FOLDER,
  TEMP_FOLDER,
} from "./paths";
import { analyzeJson, analyzePdf } from "./analyzer";

args
  .option("gen-personalities", "Gen personalities to analyze", 0)
  .option("analyze", "Analyze inputs to gen training files", false)
  .option("merge-output", "Merge output files", false);

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

if (!fs.existsSync(ANALYZED_FILE)) fs.writeFileSync(ANALYZED_FILE, '');

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
    const outputFilePath = path.join(OUTPUT_FOLDER, `${Date.now()}.jsonl`);
    fs.writeFileSync(outputFilePath, '');
    const loading = new Loading();
    for (let i = 0; i < jsonInputFiles.length; i++) {
      if (fs.readFileSync(ANALYZED_FILE).toString().includes(path.join('json', jsonInputFiles[i]))) continue;
      loading.start(
        `Analyzing JSON input [${i + 1}/${jsonInputFiles.length}]`
      );
      await analyzeJson(
        path.join(JSON_INPUT_FOLDER, jsonInputFiles[i]),
        outputFilePath
      );
      loading.stop(`JSON input analyzed! [${i + 1}/${jsonInputFiles.length}]`);
      fs.appendFileSync(ANALYZED_FILE, path.join('json', jsonInputFiles[i]) + '\n')
    }

    for (let i = 0; i < pdfInputFiles.length; i++) {
      if (fs.readFileSync(ANALYZED_FILE).toString().includes(path.join('pdf', pdfInputFiles[i]))) continue;
      loading.start(`Analyzing PDF input [${i + 1}/${pdfInputFiles.length}]`);
      await analyzePdf(
        path.join(PDF_INPUT_FOLDER, pdfInputFiles[i]),
        outputFilePath
      );
      loading.stop(`PDF input analyzed! [${i + 1}/${pdfInputFiles.length}]`);
      fs.appendFileSync(ANALYZED_FILE, path.join('pdf', pdfInputFiles[i]) + '\n')
    }
  }
  if (flags.mergeOutput) {
    const outputFiles = fs.readdirSync(OUTPUT_FOLDER);
    if (outputFiles.length > 1) {
      const outputFilePath = path.join(OUTPUT_FOLDER, `${Date.now()}.jsonl`);
      fs.writeFileSync(outputFilePath, '');
      const loading = new Loading();
      loading.start(`Merging output`);
      for (let i = 0; i < outputFiles.length; i++) {
        loading.start(`Merging output [${i + 1}/${outputFiles.length}]`);
        fs.appendFileSync(
          outputFilePath,
          fs.readFileSync(path.join(OUTPUT_FOLDER, outputFiles[i]))
        );
      }
      loading.stop('Output merged!');
    }
  }
}

main();
