export interface Slide {
  title: string;
  content: string[];
  code?: string;
  terminal?: string;
  reference?: string;
  note?: string;
  solutionUrl?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
  cards?: {
    title: string;
    description: string;
    icon: string;
    link?: string;
  }[];
}

import { slidesData1 } from './slidesData1';
import { slidesData2 } from './slidesData2';
import { slidesData3 } from './slidesData3';
import { slidesData4 } from './slidesData4';
import { slidesData5 } from './slidesData5';

export const slidesData: Record<number, Slide[]> = {
  ...slidesData1,
  ...slidesData2,
  ...slidesData3,
  ...slidesData4,
  ...slidesData5,
};
