import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import IPersonalityStats from './interfaces/IPersonalityStats';
import IMessage from './interfaces/IMessage';
import { sendPrompt } from './gpt4Controller';

const inputFolderPath = path.join(process.cwd(), 'input/pdf');
if (!fs.existsSync(inputFolderPath)) {
    fs.mkdirSync(inputFolderPath);
}

const outputFolderPath = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
}

const tempFolderPath = path.join(process.cwd(), 'temp');
if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
}

const outputFilePath = path.join(outputFolderPath, `${new Date().getTime()}.jsonl`);
fs.writeFileSync(outputFilePath, JSON.stringify({}));

function analyseFile(filePath: string) {
    const dataBuffer = fs.readFileSync(filePath);
    pdf(dataBuffer).then(async(data: any) => {
        const history: IMessage[] = [{ role: 'system', content: `Based on the text send by user, determine the user's personality and follow these instructions:\n - ALWAYS return your response as JSON object following this model:\n{\nintraverted_extraverted: number; // [0-100]\nintuitive_observant: number; // [0-100]\nthinking_feeling: number; // [0-100]\njudging_prospecting: number; // [0-100]\nassertive_turbulent: number; // [0-100]\n- Each value of the model should be a number between 0 and 100, 50 being the average` }]

        const response = await sendPrompt(data.text, history);
        history.push({ role: 'user', content: data.text}, { role: 'assistant', content: response.data.choices[0].message.content });

        console.log(history[history.length - 1].content);
    });
}

const inputFiles = fs.readdirSync(inputFolderPath);
for (const file of inputFiles) {
    analyseFile(path.join(inputFolderPath, file));
}