export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}
export interface Problem {
  title: string;
  description: string;
  difficulty: Difficulty;
  inputFilePath: string;
  slug: string;
  outputFilePath: string;
}

export interface updateProblem {
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  input?: string;
  slug?: string;
  output?: string;
}
