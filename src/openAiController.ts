import axios from 'axios';
import dotenv from 'dotenv';
import IMessage from './interfaces/IMessage';

dotenv.config();

const openAIApi = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

export default openAIApi;

export function sendPrompt(prompt: string, history: IMessage[] = []) {
    const options = {
        model: 'gpt-4',
        messages: [
            ...history,
            {
                role: 'user',
                content: prompt
            }
        ]
    };

    return openAIApi.post('/chat/completions', options);
}