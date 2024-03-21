import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import args from 'args';
import IMessage from './interfaces/IMessage';
import { sendPrompt } from './openAiController';
import genPersonality from './genPersonality';
import Loading from './loading';

args
    .option('gen-personalities', 'Gen personalities to analyze', 0)
    .option('analyze', 'Analyze inputs to gen training files', false);

const flags = args.parse(process.argv);

const inputFolderPath = path.join(process.cwd(), 'input');
if (!fs.existsSync(inputFolderPath)) {
    fs.mkdirSync(inputFolderPath);
}

const pdfInputFolderPath = path.join(inputFolderPath, 'pdf');
if (!fs.existsSync(pdfInputFolderPath)) {
    fs.mkdirSync(pdfInputFolderPath);
}

const jsonInputFolderPath = path.join(inputFolderPath, 'json');
if (!fs.existsSync(jsonInputFolderPath)) {
    fs.mkdirSync(jsonInputFolderPath);
}

const outputFolderPath = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
}

const tempFolderPath = path.join(process.cwd(), 'temp');
if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
}

const pdfInputFiles = fs.readdirSync(pdfInputFolderPath);
const jsonInputFiles = fs.readdirSync(jsonInputFolderPath);

async function main() {
    if (flags.genPersonalities > 0) {
        const personalities: {text: string}[] = [];
        for (let i = 0; i < flags.genPersonalities; i++) {
            const loading = new Loading();
            loading.start('Generating personality')
            if (i > flags.genPersonalities / 2) {
                personalities.push(await genPersonality(true));                
            } else personalities.push(await genPersonality(false));
            loading.stop('Personality generated');
        }
        console.log(personalities);
    } else {
        throw new Error('Need an amount of personalities to generate.')
    }
    if (flags.analyze) {
        console.log('analyze', flags.analyze);
    }
}

function analyzeJson(filePath: string, outputFilePath: string) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = JSON.parse(dataBuffer.toString());
    data.forEach(async (text: string) => {
        const history: IMessage[] = [{ role: 'system', content: `Based on the text send by user, determine the user's personality and follow these instructions:\n - ALWAYS return your response as JSON object following this model:\n{\nintraverted_extraverted: number; // [0-100]\nintuitive_observant: number; // [0-100]\nthinking_feeling: number; // [0-100]\njudging_prospecting: number; // [0-100]\nassertive_turbulent: number; // [0-100]\n- Each value of the model should be a number between 0 and 100, 50 being the average` }];

        const response = await sendPrompt(text, history);
        history.push({ role: 'user', content: data.text}, { role: 'assistant', content: response.data.choices[0].message.content });

        fs.appendFileSync(outputFilePath, JSON.stringify({messages: history}, null) + '\n');
    });
}

function analyzePdf(filePath: string, outputFilePath: string) {
    const dataBuffer = fs.readFileSync(filePath);
    pdf(dataBuffer).then(async(data: any) => {
        const history: IMessage[] = [{ role: 'system', content: `Based on the text send by user, determine the user's personality and follow these instructions:\n - ALWAYS return your response as JSON object following this model:\n{\nintraverted_extraverted: number; // [0-100]\nintuitive_observant: number; // [0-100]\nthinking_feeling: number; // [0-100]\njudging_prospecting: number; // [0-100]\nassertive_turbulent: number; // [0-100]\n- Each value of the model should be a number between 0 and 100, 50 being the average` }]

        const response = await sendPrompt(data.text, history);
        history.push({ role: 'user', content: data.text}, { role: 'assistant', content: response.data.choices[0].message.content });

        fs.appendFileSync(outputFilePath, JSON.stringify({messages: history}, null) + '\n');
    });
}

main();