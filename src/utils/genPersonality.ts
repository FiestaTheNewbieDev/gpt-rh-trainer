import { sendPrompt } from "../utils/openAiController";

export default async function genPersonality(archetypal: boolean = false) {
    let prompt: string = 'Put yourself in the shoes of an individual whose personality you invent and generate an autobiographical text emphasizing your personality traits';
    if (archetypal) {
        prompt = 'Put yourself in the shoes of an individual whose archetypal personality you invent and generate an autobiographical text emphasizing your personality traits';
    }
    const response = await sendPrompt(prompt);
    return {text: response.data.choices[0].message.content};
}