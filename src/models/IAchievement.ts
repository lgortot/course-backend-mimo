/**
 * Domain Achievement model to be used with repository abstraction.
 */
export interface IAchievement {
    ID: number;
    Name: string;
    Course_ID: number | null;
    Type: string;
    Threshold: number;
}