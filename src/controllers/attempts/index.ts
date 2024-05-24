// import log4js from 'log4js';
// import httpStatus from 'http-status';
// import { Request, Response } from 'express';
// import {
//   listGroups as listGroupsApi,
//   saveGroup as saveGroupApi,
// } from 'src/services/group';
// import { GroupSaveDto } from 'src/dto/group/groupSaveDto';
// import { InternalError } from 'src/system/internalError';


import { Request, Response } from 'express';
import Attempt from 'src/model/attempt';

// Контроллер для добавления нового объекта Attempt в базу данных
export const addAttempt = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Извлечение данных из тела запроса
    const { studentId, timeSpent, solved, exerciseId } = req.body;

    // Создание нового объекта Attempt с текущей датой и временем
    const newAttempt = new Attempt({
      studentId,
      timeSpent,
      solved,
      exerciseId,
      datetime: new Date(), // Дата присваивается в контроллере
    });

    // Сохранение объекта в базу данных
    await newAttempt.save();

    return res.status(201).json({ message: 'Attempt added successfully', attempt: newAttempt });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding attempt', error });
  }
};

// Контроллер для получения списка объектов Attempt
export const getAttempts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { exerciseId, size, from } = req.query;

    // Проверка наличия обязательного параметра exerciseId
    if (!exerciseId) {
      return res.status(400).json({ message: 'excerciseId is required' });
    }

    // Преобразование параметров в нужные типы данных
    const limit = size ? parseInt(size as string) : 10;
    const skip = from ? parseInt(from as string) : 0;

    // Поиск объектов Attempt по exerciseId, сортировка и пагинация
    const attempts = await Attempt.find({ exerciseId })
      .sort({ datetime: -1 }) // Сортировка по убыванию времени
      .skip(skip)
      .limit(limit)
      .exec();

    return res.status(200).json(attempts);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving attempts', error });
  }
};

// Контроллер для получения количества объектов Attempt для каждого exerciseId
export const getAttemptsCounts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { exerciseIds } = req.body;

    // Проверка наличия обязательного параметра exerciseIds
    if (!exerciseIds || !Array.isArray(exerciseIds)) {
      return res.status(400).json({ message: 'exerciseIds is required and should be an array' });
    }

    // Создание объекта для хранения результатов с явным указанием типов
    const counts: { [key: number]: number } = {};

    // Получение количества объектов Attempt для каждого exerciseId
    for (const id of exerciseIds) {
      const count = await Attempt.countDocuments({ exerciseId: id });
      counts[id] = count;
    }

    return res.status(200).json(counts);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving counts', error });
  }
};