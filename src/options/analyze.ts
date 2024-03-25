import path from "path";
import fs from "fs";
import { IOption } from "../interfaces/IOption";
import Loading from "../utils/loading";
import { analyzeJson, analyzePdf } from "../utils/analyzer";
import {
  ANALYZED_FILE,
  JSON_INPUT_FOLDER,
  OUTPUT_FOLDER,
  PDF_INPUT_FOLDER,
} from "../utils/paths";

const analyze: IOption = {
  flags: ["analyze"],
  fn: async (flags) => {
    const jsonInputFiles = fs.readdirSync(JSON_INPUT_FOLDER);
    const pdfInputFiles = fs.readdirSync(PDF_INPUT_FOLDER);
    const outputFilePath = path.join(OUTPUT_FOLDER, `${Date.now()}.jsonl`);
    fs.writeFileSync(outputFilePath, "");
    const loading = new Loading();
    for (let i = 0; i < jsonInputFiles.length; i++) {
      if (
        fs
          .readFileSync(ANALYZED_FILE)
          .toString()
          .includes(path.join("json", jsonInputFiles[i]))
      )
        continue;
      loading.start(`Analyzing JSON input [${i + 1}/${jsonInputFiles.length}]`);
      await analyzeJson(
        path.join(JSON_INPUT_FOLDER, jsonInputFiles[i]),
        outputFilePath
      );
      loading.stop(`JSON input analyzed! [${i + 1}/${jsonInputFiles.length}]`);
      fs.appendFileSync(
        ANALYZED_FILE,
        path.join("json", jsonInputFiles[i]) + "\n"
      );
    }

    for (let i = 0; i < pdfInputFiles.length; i++) {
      if (
        fs
          .readFileSync(ANALYZED_FILE)
          .toString()
          .includes(path.join("pdf", pdfInputFiles[i]))
      )
        continue;
      loading.start(`Analyzing PDF input [${i + 1}/${pdfInputFiles.length}]`);
      await analyzePdf(
        path.join(PDF_INPUT_FOLDER, pdfInputFiles[i]),
        outputFilePath
      );
      loading.stop(`PDF input analyzed! [${i + 1}/${pdfInputFiles.length}]`);
      fs.appendFileSync(
        ANALYZED_FILE,
        path.join("pdf", pdfInputFiles[i]) + "\n"
      );
    }
  },
};

export default analyze;
