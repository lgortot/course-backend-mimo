/**
 * Domain Lesson model to be used with repository abstraction.
 */
export interface ILesson {
    ID: number;
    Chapter_ID: number;
    Name: string;
    Order_Index: number;
  }