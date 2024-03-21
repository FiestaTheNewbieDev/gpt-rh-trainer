import fs from "fs";
import pdf from "pdf-parse";
import IMessage from "./interfaces/IMessage";
import { sendPrompt } from "./openAiController";

export async function analyzeJson(filePath: string, outputFilePath: string) {
  fs.writeFileSync(outputFilePath, "");
  const dataBuffer = fs.readFileSync(filePath);
  const data = JSON.parse(dataBuffer.toString());
  for (const object of data) {
    const history: IMessage[] = [
      {
        role: "system",
        content: `Based on the text send by user, determine the user's personality and follow these instructions:\n - ALWAYS return your response as JSON object following this model:\n{\nintraverted_extraverted: number; // [0-100]\nintuitive_observant: number; // [0-100]\nthinking_feeling: number; // [0-100]\njudging_prospecting: number; // [0-100]\nassertive_turbulent: number; // [0-100]\n- Each value of the model should be a number between 0 and 100, 50 being the average`,
      },
    ];

    const response = await sendPrompt(object.text, history);

    history.push(
      { role: "user", content: object.text },
      { role: "assistant", content: response.data.choices[0].message.content }
    );
    console.log(history);
    fs.appendFileSync(
      outputFilePath,
      JSON.stringify({ messages: history }, null) + "\n"
    );
  }
}

export function analyzePdf(filePath: string, outputFilePath: string) {
  const dataBuffer = fs.readFileSync(filePath);
  pdf(dataBuffer).then(async (data: any) => {
    console.log("here")
    const history: IMessage[] = [
      {
        role: "system",
        content: `Based on the text send by user, determine the user's personality and follow these instructions:\n - ALWAYS return your response as JSON object following this model:\n{\nintraverted_extraverted: number; // [0-100]\nintuitive_observant: number; // [0-100]\nthinking_feeling: number; // [0-100]\njudging_prospecting: number; // [0-100]\nassertive_turbulent: number; // [0-100]\n- Each value of the model should be a number between 0 and 100, 50 being the average`,
      },
    ];

    const response = await sendPrompt(data.text, history);
    history.push(
      { role: "user", content: data.text },
      { role: "assistant", content: response.data.choices[0].message.content }
    );

    fs.appendFileSync(
      outputFilePath,
      JSON.stringify({ messages: history }, null) + "\n"
    );
  });
}