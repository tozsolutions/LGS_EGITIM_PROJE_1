import { Router, Request, Response } from 'express';
import { AuthRequest, authenticate, authorize } from '../middleware/auth';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, PAGINATION } from '../../shared/constants';
import { UserRole, Subject, Difficulty } from '../../shared/types';
import db from '../config/database';
import logger from '../utils/logger';
import Joi from 'joi';

const router = Router();

// Validation schemas
const questionSchema = Joi.object({
  subject: Joi.string().valid(...Object.values(Subject)).required().messages({
    'any.only': 'Geçerli bir ders seçiniz',
    'any.required': 'Ders seçimi gereklidir'
  }),
  topic: Joi.string().min(3).max(200).required().messages({
    'string.min': 'Konu en az 3 karakter olmalıdır',
    'string.max': 'Konu en fazla 200 karakter olabilir',
    'any.required': 'Konu gereklidir'
  }),
  difficulty: Joi.string().valid(...Object.values(Difficulty)).required().messages({
    'any.only': 'Geçerli bir zorluk seviyesi seçiniz',
    'any.required': 'Zorluk seviyesi gereklidir'
  }),
  content: Joi.string().min(10).required().messages({
    'string.min': 'Soru içeriği en az 10 karakter olmalıdır',
    'any.required': 'Soru içeriği gereklidir'
  }),
  options: Joi.array().items(
    Joi.object({
      text: Joi.string().min(1).required().messages({
        'string.min': 'Seçenek metni boş olamaz',
        'any.required': 'Seçenek metni gereklidir'
      }),
      isCorrect: Joi.boolean().required()
    })
  ).min(2).max(6).required().messages({
    'array.min': 'En az 2 seçenek olmalıdır',
    'array.max': 'En fazla 6 seçenek olabilir',
    'any.required': 'Seçenekler gereklidir'
  }),
  explanation: Joi.string().min(10).optional().messages({
    'string.min': 'Açıklama en az 10 karakter olmalıdır'
  }),
  points: Joi.number().min(1).max(10).default(1),
  timeLimit: Joi.number().min(30).max(600).default(60)
});

const querySchema = Joi.object({
  page: Joi.number().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: Joi.number().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
  subject: Joi.string().valid(...Object.values(Subject)).optional(),
  difficulty: Joi.string().valid(...Object.values(Difficulty)).optional(),
  topic: Joi.string().optional(),
  search: Joi.string().min(3).optional()
});

// GET /api/v1/questions - Get all questions with filtering and pagination
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { page, limit, subject, difficulty, topic, search } = value;
    const offset = (page - 1) * limit;

    // Build query
    let query = db('questions')
      .select(
        'questions.*',
        'users.first_name as creator_first_name',
        'users.last_name as creator_last_name'
      )
      .leftJoin('users', 'questions.created_by', 'users.id')
      .where('questions.is_active', true);

    // Apply filters
    if (subject) {
      query = query.where('questions.subject', subject);
    }

    if (difficulty) {
      query = query.where('questions.difficulty', difficulty);
    }

    if (topic) {
      query = query.where('questions.topic', 'like', `%${topic}%`);
    }

    if (search) {
      query = query.where(function() {
        this.where('questions.content', 'like', `%${search}%`)
            .orWhere('questions.topic', 'like', `%${search}%`);
      });
    }

    // Get total count for pagination
    const totalQuery = query.clone();
    const totalResult = await totalQuery.count('* as total').first();
    const total = parseInt(totalResult?.total as string) || 0;

    // Apply pagination and ordering
    const questions = await query
      .orderBy('questions.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Get options for each question
    const questionIds = questions.map(q => q.id);
    const options = questionIds.length > 0 ? await db('question_options')
      .whereIn('question_id', questionIds)
      .orderBy('order_index') : [];

    // Group options by question
    const optionsMap = options.reduce((acc, option) => {
      if (!acc[option.question_id]) {
        acc[option.question_id] = [];
      }
      acc[option.question_id].push({
        id: option.id,
        text: option.text,
        isCorrect: option.is_correct
      });
      return acc;
    }, {} as Record<number, any[]>);

    // Format response
    const formattedQuestions = questions.map(question => ({
      id: question.id,
      subject: question.subject,
      topic: question.topic,
      difficulty: question.difficulty,
      content: question.content,
      options: optionsMap[question.id] || [],
      explanation: question.explanation,
      points: question.points,
      timeLimit: question.time_limit,
      createdBy: {
        firstName: question.creator_first_name,
        lastName: question.creator_last_name
      },
      createdAt: question.created_at,
      updatedAt: question.updated_at
    }));

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      message: 'Sorular başarıyla getirildi',
      data: formattedQuestions,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    logger.error('Get questions error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
});

// GET /api/v1/questions/random - Get random questions for practice
router.get('/random', authenticate, async (req: Request, res: Response) => {
  try {
    const { subject, difficulty, count = 10 } = req.query;
    
    let query = db('questions')
      .select(
        'questions.*',
        'users.first_name as creator_first_name',
        'users.last_name as creator_last_name'
      )
      .leftJoin('users', 'questions.created_by', 'users.id')
      .where('questions.is_active', true);

    if (subject) {
      query = query.where('questions.subject', subject);
    }

    if (difficulty) {
      query = query.where('questions.difficulty', difficulty);
    }

    const questions = await query
      .orderByRaw('RANDOM()')
      .limit(Math.min(parseInt(count as string) || 10, 50));

    // Get options for each question
    const questionIds = questions.map(q => q.id);
    const options = questionIds.length > 0 ? await db('question_options')
      .whereIn('question_id', questionIds)
      .orderBy('order_index') : [];

    // Group options by question
    const optionsMap = options.reduce((acc, option) => {
      if (!acc[option.question_id]) {
        acc[option.question_id] = [];
      }
      acc[option.question_id].push({
        id: option.id,
        text: option.text,
        // Don't show correct answers in random practice mode
        isCorrect: undefined
      });
      return acc;
    }, {} as Record<number, any[]>);

    // Format response (hide correct answers and explanations for practice)
    const formattedQuestions = questions.map(question => ({
      id: question.id,
      subject: question.subject,
      topic: question.topic,
      difficulty: question.difficulty,
      content: question.content,
      options: optionsMap[question.id] || [],
      points: question.points,
      timeLimit: question.time_limit,
      createdAt: question.created_at
    }));

    res.json({
      success: true,
      message: 'Rastgele sorular getirildi',
      data: formattedQuestions
    });

  } catch (error) {
    logger.error('Get random questions error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
});

// GET /api/v1/questions/:id - Get question by ID
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.id);
    if (!questionId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Geçerli bir soru ID\'si giriniz'
      });
    }

    const question = await db('questions')
      .select(
        'questions.*',
        'users.first_name as creator_first_name',
        'users.last_name as creator_last_name'
      )
      .leftJoin('users', 'questions.created_by', 'users.id')
      .where({ 'questions.id': questionId, 'questions.is_active': true })
      .first();

    if (!question) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.QUESTION_NOT_FOUND
      });
    }

    // Get question options
    const options = await db('question_options')
      .where({ question_id: questionId })
      .orderBy('order_index');

    res.json({
      success: true,
      message: 'Soru başarıyla getirildi',
      data: {
        id: question.id,
        subject: question.subject,
        topic: question.topic,
        difficulty: question.difficulty,
        content: question.content,
        options: options.map(option => ({
          id: option.id,
          text: option.text,
          isCorrect: option.is_correct
        })),
        explanation: question.explanation,
        points: question.points,
        timeLimit: question.time_limit,
        createdBy: {
          firstName: question.creator_first_name,
          lastName: question.creator_last_name
        },
        createdAt: question.created_at,
        updatedAt: question.updated_at
      }
    });

  } catch (error) {
    logger.error('Get question by ID error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
});

// POST /api/v1/questions - Create new question (Teacher/Admin only)
router.post('/', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = questionSchema.validate(req.body);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { subject, topic, difficulty, content, options, explanation, points, timeLimit } = value;

    // Validate that at least one option is correct
    const correctOptions = options.filter((opt: any) => opt.isCorrect);
    if (correctOptions.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'En az bir doğru seçenek olmalıdır'
      });
    }

    // Create question in transaction
    const result = await db.transaction(async (trx) => {
      // Insert question
      const [questionId] = await trx('questions').insert({
        subject,
        topic,
        difficulty,
        content,
        explanation,
        points,
        time_limit: timeLimit,
        created_by: req.user!.id,
        is_active: true
      });

      // Insert options
      for (let i = 0; i < options.length; i++) {
        await trx('question_options').insert({
          question_id: questionId,
          text: options[i].text,
          is_correct: options[i].isCorrect,
          order_index: i
        });
      }

      return questionId;
    });

    logger.info('Question created successfully', { 
      questionId: result, 
      subject, 
      createdBy: req.user!.id 
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.QUESTION_CREATED,
      data: { questionId: result }
    });

  } catch (error) {
    logger.error('Create question error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
});

// PUT /api/v1/questions/:id - Update question (Teacher/Admin only)
router.put('/:id', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), async (req: AuthRequest, res: Response) => {
  try {
    const questionId = parseInt(req.params.id);
    if (!questionId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Geçerli bir soru ID\'si giriniz'
      });
    }

    const { error, value } = questionSchema.validate(req.body);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Check if question exists and user has permission
    const existingQuestion = await db('questions')
      .where({ id: questionId, is_active: true })
      .first();

    if (!existingQuestion) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.QUESTION_NOT_FOUND
      });
    }

    // Only allow the creator or admin to edit
    if (req.user!.role !== UserRole.ADMIN && existingQuestion.created_by !== req.user!.id) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    const { subject, topic, difficulty, content, options, explanation, points, timeLimit } = value;

    // Validate that at least one option is correct
    const correctOptions = options.filter((opt: any) => opt.isCorrect);
    if (correctOptions.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'En az bir doğru seçenek olmalıdır'
      });
    }

    // Update question in transaction
    await db.transaction(async (trx) => {
      // Update question
      await trx('questions')
        .where({ id: questionId })
        .update({
          subject,
          topic,
          difficulty,
          content,
          explanation,
          points,
          time_limit: timeLimit,
          updated_at: new Date()
        });

      // Delete existing options
      await trx('question_options')
        .where({ question_id: questionId })
        .del();

      // Insert new options
      for (let i = 0; i < options.length; i++) {
        await trx('question_options').insert({
          question_id: questionId,
          text: options[i].text,
          is_correct: options[i].isCorrect,
          order_index: i
        });
      }
    });

    logger.info('Question updated successfully', { 
      questionId, 
      updatedBy: req.user!.id 
    });

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.QUESTION_UPDATED
    });

  } catch (error) {
    logger.error('Update question error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
});

// DELETE /api/v1/questions/:id - Delete question (soft delete) (Teacher/Admin only)
router.delete('/:id', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), async (req: AuthRequest, res: Response) => {
  try {
    const questionId = parseInt(req.params.id);
    if (!questionId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Geçerli bir soru ID\'si giriniz'
      });
    }

    // Check if question exists and user has permission
    const existingQuestion = await db('questions')
      .where({ id: questionId, is_active: true })
      .first();

    if (!existingQuestion) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.QUESTION_NOT_FOUND
      });
    }

    // Only allow the creator or admin to delete
    if (req.user!.role !== UserRole.ADMIN && existingQuestion.created_by !== req.user!.id) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    // Check if question is used in any active exams
    const examUsage = await db('exam_questions')
      .join('exams', 'exam_questions.exam_id', 'exams.id')
      .where({ 
        'exam_questions.question_id': questionId,
        'exams.is_active': true 
      })
      .first();

    if (examUsage) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Bu soru aktif sınavlarda kullanıldığı için silinemez'
      });
    }

    // Soft delete
    await db('questions')
      .where({ id: questionId })
      .update({ 
        is_active: false,
        updated_at: new Date()
      });

    logger.info('Question deleted successfully', { 
      questionId, 
      deletedBy: req.user!.id 
    });

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.QUESTION_DELETED
    });

  } catch (error) {
    logger.error('Delete question error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
});

export default router;