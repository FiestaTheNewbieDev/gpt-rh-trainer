import fs from "fs";
import pdf from "pdf-parse";
import path from "path";
import IMessage from "./interfaces/IMessage";
import { sendPrompt } from "./openAiController";
import { ANALYZED_FILE, INPUT_FOLDER } from "./paths";

async function analyzeData(data: string, outputFilePath: string) {
    const history: IMessage[] = [
        {
            role: "system",
            content: `Based on the text send by user, determine the user's personality and follow these instructions:\n
            - ALWAYS return your response as JSON object following this model:\n${fs.readFileSync(path.join(process.cwd(), '/src/interfaces/IPersonalityStats.ts'))}
            - Each value of the model should be between 0 and 100\n`
        }
    ];

    const response = await sendPrompt(data, history);

    history.push(
        { role: "user", content: data },
        { role: "assistant", content: response.data.choices[0].message.content }
    );

    fs.appendFileSync(outputFilePath, JSON.stringify({ messages: history}) + '\n', 'utf-8');
}

export async function analyzeJson(filePath: string, outputFilePath: string) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = JSON.parse(dataBuffer.toString());
  for (const object of data) {
		await analyzeData(object.text, outputFilePath);
  }
}

export async function analyzePdf(filePath: string, outputFilePath: string) {
  const dataBuffer = fs.readFileSync(filePath);
  await pdf(dataBuffer).then(async (data: any) => {
    await analyzeData(data.text, outputFilePath);
  });
}
