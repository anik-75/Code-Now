import slugify from 'slugify';
import prisma from '../prisma.js';
import { Problem, updateProblem } from '../types/problemtypes.js';
import { deleteFile, uploadFile } from '../supabase/fileHandler.js';

export const getProblemDetails = async (problemId: string) => {
  let query;
  if (isNaN(Number(problemId))) {
    query = { slug: String(problemId).trim() };
  } else {
    query = { id: Number(problemId) };
  }
  try {
    const problem = await prisma.problem.findFirst({
      where: {
        OR: [query],
      },
    });
    if (!problem) {
      throw new Error('Problem not Found.');
    }

    const savedProblem = {
      title: problem?.title,
      description: problem?.description,
      slug: problem?.slug,
      input: problem?.input,
      output: problem?.output,
      difficulty: problem?.difficulty,
    };
    return savedProblem;
  } catch (error) {
    if (error instanceof Error) throw new Error(error + '');
  }
};

export const getProblemCorrectCode = async (problemId: string) => {
  let query;
  if (isNaN(Number(problemId))) {
    query = { slug: String(problemId).trim() };
  } else {
    query = { id: Number(problemId) };
  }
  try {
    const problem = await prisma.problem.findFirst({
      where: {
        OR: [query],
      },
    });
    if (!problem) {
      throw new Error('Problem not Found.');
    }
    return problem.correctCode;
  } catch (error) {
    if (error instanceof Error) throw new Error(error + '');
  }
};

export const saveProblem = async ({
  title,
  description,
  difficulty,
  inputFilePath,
  slug,
  outputFilePath,
  correctCode,
}: Problem) => {
  try {
    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        input: inputFilePath,
        slug,
        output: outputFilePath,
        correctCode,
      },
    });
    return problem;
  } catch (error) {
    if (error instanceof Error) throw new Error(error + '');
  }
};

export const update = async (
  problemId: number,
  { title, description, difficulty, input, output, correctCode }: updateProblem,
) => {
  try {
    const existingProblem = await prisma.problem.findFirst({
      where: {
        OR: [{ id: problemId }, { slug: String(problemId) }],
      },
    });

    if (!existingProblem) {
      throw new Error('Problem Not Found');
    }
    console.log(existingProblem);

    const slug = title
      ? // @ts-ignore
        slugify(title, { lower: true, strict: true })
      : existingProblem.slug;

    if (input) {
      // remove previous input file
      await deleteFile('Problems', existingProblem.input);
      // update path
      const inputPath = await uploadFile(input, 'Problems', `${slug}/input`);

      if (!inputPath) {
        throw new Error('Saving Input file failed.');
      }
      input = inputPath.path;
    }

    if (output) {
      // remove previous input file
      await deleteFile('Problems', existingProblem.output);
      // update path
      const outputPath = await uploadFile(output, 'Problems', `${slug}/output`);

      if (!outputPath) {
        throw new Error('Saving Output file failed.');
      }
      output = outputPath.path;
    }

    return await prisma.problem.update({
      where: {
        id: existingProblem.id,
      },
      data: {
        title: title ?? existingProblem.title,
        description: description ?? existingProblem.description,
        difficulty: difficulty ?? existingProblem.difficulty,
        input: input ?? existingProblem.input,
        slug: slug ?? existingProblem.slug,
        output: output ?? existingProblem.output,
        correctCode: correctCode ?? existingProblem.correctCode,
      },
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(error + '');
  }
};

export const deleteProblem = async (problemId: number) => {
  try {
    const problem = await prisma.problem.findFirst({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      throw new Error('Problem Not Found');
    }

    await deleteFile('Problems', problem.output);
    await deleteFile('Problems', problem.input);

    return await prisma.problem.delete({
      where: {
        id: problem.id,
      },
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(error + '');
  }
};
