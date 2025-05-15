/**
 * Domain User-Achievement model to be used with repository abstraction.
 */
export interface IUserAchievement {
    achievement_id: number;
    earned_at: Date | null; // simplicity sake
    name: string;
    course_id: number | null;
    type: string;
    threshold: number;
    completed: boolean;
}