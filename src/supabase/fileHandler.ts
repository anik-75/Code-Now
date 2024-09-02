import supabase from './supabase.js';
import fs from 'fs';

export async function uploadFile(
  localFilePath: string,
  bucketName: string,
  fileName: string,
) {
  try {
    const fileContent = fs.readFileSync(localFilePath);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileContent);

    if (error) {
      throw new Error(error.message);
    }

    console.log('File uploaded successfully:', data);
    return data;
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      console.log('Error message:', error.message);
    } else {
      console.log('Unexpected error format:', error);
    }
  }
}

export async function readFile(bucketName: string, fileName: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(fileName);

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    // convert to text
    const text = await data.text();
    console.log('File content:', text);
    return text;
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      console.log('Error message:', error.message);
    } else {
      console.log('Unexpected error format:', error);
    }
  }
}

export async function deleteFile(bucketName: string, filePath: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw new Error(error.message);
    }

    console.log(error);
    console.log(data);
    console.log('File deleted successfully.');
    return data;
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      console.log('Error message:', error.message);
    } else {
      console.log('Unexpected error format:', error);
    }
  }
}
