export interface Problem {
  uuid: string;
  grid: number[][];
  solution?: number[][];
  clean?: boolean;
  extra?: boolean;
}

export type GameTab = "Stage" | "DIY"