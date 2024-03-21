import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const INPUT_FOLDER = process.env.INPUT_FOLDER || path.join(process.cwd(), 'input');
export const JSON_INPUT_FOLDER = process.env.JSON_INPUT_FOLDER || path.join(INPUT_FOLDER, 'json');
export const PDF_INPUT_FOLDER = process.env.PDF_INPUT_FOLDER || path.join(INPUT_FOLDER, 'pdf');

export const OUTPUT_FOLDER = process.env.OUTPUT_FOLDER || path.join(process.cwd(), 'output');

export const TEMP_FOLDER = process.env.TEMP_FOLDER || path.join(process.cwd(), '.temp');
export const ANALYZED_FILE = path.join(TEMP_FOLDER, 'analyzed.txt');