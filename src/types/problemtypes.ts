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
  correctCode: string;
}

export interface updateProblem {
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  input?: string;
  output?: string;
  correctCode?: string;
}

export enum submissionStatus {
  Pending = 'Pending',
  Correct = 'Correct',
  Wrong = 'Wrong',
}
