import { readFile } from '../supabase/fileHandler.js';

export const getInput = async (inputFilePath: string) => {
  const data = await readFile('Problems', inputFilePath);
  return data;
  // console.log(data);
};

export const getOutput = async (outputFilePath: string) => {
  const data = await readFile('Problems', outputFilePath);
  return data;
  // console.log(data);
};
