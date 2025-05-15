import { UserService } from '../src/services/UserService';
import { NotFoundError } from '../src/errors/ApiErrors';
import { IUserAchievement, UserAchievementDto } from '../src/models/IUserAchievement';

// Mock dependencies
const mockUserRepository = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockLessonRepository = {
  createUserLessonProgress: jest.fn(),
  createUserChapterProgress: jest.fn(),
  createUserCourseProgress: jest.fn(),
  getById: jest.fn(),
  getChaptersCountByCourseIds: jest.fn(),
  getLessonsCountByChapterIds: jest.fn(),
  getCompletedLessonsForUser: jest.fn(),
  getCompletedChaptersForUser: jest.fn(),
};

const mockAchievementRepository = {
  getAllUserAchievementProgress: jest.fn(),
  getAllAchievements: jest.fn(),
  createUserAchievement: jest.fn(),
};

const mockCache = {
  getAchievementByTypeAndThreshold: jest.fn(),
  getLessonCountForChapter: jest.fn(),
  getChapterCountForCourse: jest.fn(),
  getAchievementByCourseId: jest.fn(),
  setChapterCountForCourse: jest.fn(),
  setLessonCountForChapter: jest.fn(),
  initializeCache: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService(
      mockUserRepository,
      mockLessonRepository,
      mockAchievementRepository,
      mockCache
    );
  });

  describe('getAchievementsForUser', () => {
    it('should return completed achievements without retreiving progress data when gets finished achievements', async () => {
      // Arrange
      const userId = 1;
      const mockAchievements: IUserAchievement[] = [
        {
          achievement_id: 1,
          name: 'Complete First Lesson',
          type: 'lesson',
          threshold: 1,
          completed: true,
          earned_at: new Date(),
          course_id: null
        },
        {
          achievement_id: 2,
          name: 'Complete First Chapter',
          type: 'chapter',
          threshold: 1,
          completed: true,
          earned_at: new Date(),
          course_id: null
        },
      ];

      const expectedDtos: UserAchievementDto[] = [
        {
          achievement_id: 1,
          name: 'Complete First Lesson',
          earned_at: mockAchievements[0].earned_at,
          completed: true,
          progress: 1,
        },
        {
          achievement_id: 2,
          name: 'Complete First Chapter',
          earned_at: mockAchievements[1].earned_at,
          completed: true,
          progress: 1,
        },
      ];

      mockAchievementRepository.getAllUserAchievementProgress.mockResolvedValue(mockAchievements);
      mockLessonRepository.getCompletedLessonsForUser.mockResolvedValue(0);
      mockLessonRepository.getCompletedChaptersForUser.mockResolvedValue(0);

      // Act
      const result = await userService.getAchievementsForUser(userId);

      // Assert
      expect(mockAchievementRepository.getAllUserAchievementProgress).toHaveBeenCalledWith(userId);
      expect(mockLessonRepository.getCompletedLessonsForUser).not.toHaveBeenCalled();
      expect(mockLessonRepository.getCompletedChaptersForUser).not.toHaveBeenCalled();
      expect(result).toEqual(expectedDtos);
    });
  });

  describe('getAchievementsForUser', () => {
    it('should return incomplete achievements with prepared progress data when gets unfinished achievements', async () => {
      // Arrange
      const userId = 1;
      const mockAchievements: IUserAchievement[] = [
        {
          achievement_id: 1,
          name: 'Complete Two Lessons',
          type: 'lesson',
          threshold: 2,
          completed: false,
          earned_at: new Date(),
          course_id: null
        },
        {
          achievement_id: 2,
          name: 'Complete One Chapter',
          type: 'chapter',
          threshold: 1,
          completed: false,
          earned_at: new Date(),
          course_id: null
        },
      ];

      const expectedDtos: UserAchievementDto[] = [
        {
          achievement_id: 1,
          name: 'Complete Two Lessons',
          earned_at: mockAchievements[0].earned_at,
          completed: false,
          progress: 1,
        },
        {
          achievement_id: 2,
          name: 'Complete One Chapter',
          earned_at: mockAchievements[1].earned_at,
          completed: false,
          progress: 0,
        },
      ];

      mockAchievementRepository.getAllUserAchievementProgress.mockResolvedValue(mockAchievements);
      mockLessonRepository.getCompletedLessonsForUser.mockResolvedValue(1);
      mockLessonRepository.getCompletedChaptersForUser.mockResolvedValue(0);

      // Act
      const result = await userService.getAchievementsForUser(userId);

      // Assert
      expect(mockAchievementRepository.getAllUserAchievementProgress).toHaveBeenCalledWith(userId);
      expect(mockLessonRepository.getCompletedLessonsForUser).toHaveBeenCalledWith(userId);
      expect(mockLessonRepository.getCompletedChaptersForUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedDtos);
    });
  });

  describe('getAchievementsForUser', () => {
    it('should throw NotFoundError when no achievements found', async () => {
      // Arrange
      const userId = 1;
      mockAchievementRepository.getAllUserAchievementProgress.mockResolvedValue(null);
      mockLessonRepository.getCompletedLessonsForUser.mockResolvedValue(1);
      mockLessonRepository.getCompletedChaptersForUser.mockResolvedValue(0);

      // Act & Assert
      await expect(userService.getAchievementsForUser(userId)).rejects.toThrow(
        new NotFoundError('There are no achievements registered in the database.')
      );

      // Assert
      expect(mockAchievementRepository.getAllUserAchievementProgress).toHaveBeenCalledWith(userId);
      expect(mockLessonRepository.getCompletedLessonsForUser).not.toHaveBeenCalled();
      expect(mockLessonRepository.getCompletedChaptersForUser).not.toHaveBeenCalled();
    });
  });
});