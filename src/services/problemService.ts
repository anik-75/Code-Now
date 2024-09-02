import slugify from 'slugify';
import prisma from '../prisma.js';
import { Problem, updateProblem } from '../types/problemtypes.js';
import { deleteFile, uploadFile } from '../supabase/fileHandler.js';

export const saveProblem = async ({
  title,
  description,
  difficulty,
  inputFilePath,
  slug,
  outputFilePath,
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
      },
    });
    return problem;
  } catch (error) {
    if (error instanceof Error) throw new Error(error + '');
  }
};

export const update = async (
  problemId: number,
  { title, description, difficulty, input, output }: updateProblem,
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
        title,
        description,
        difficulty,
        input: input ?? existingProblem.input,
        slug,
        output: output ?? existingProblem.output,
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
