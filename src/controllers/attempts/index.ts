// import { Request, Response } from 'express';
// import Attempt from 'src/model/attempt';
// import axios from 'axios';


// // Контроллер для добавления нового объекта Attempt в базу данных
// export const addAttempt = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     // Извлечение данных из тела запроса
//     const { studentId, timeSpent, solved, exerciseId } = req.body;

//     // Создание нового объекта Attempt с текущей датой и временем
//     const newAttempt = new Attempt({
//       studentId,
//       timeSpent,
//       solved,
//       exerciseId,
//       datetime: new Date(), // Дата присваивается в контроллере
//     });

//     // Сохранение объекта в базу данных
//     await newAttempt.save();

//     return res.status(201).json({ message: 'Attempt added successfully', attempt: newAttempt });
//   } catch (error) {
//     return res.status(500).json({ message: 'Error adding attempt', error });
//   }
// };

// // Контроллер для получения списка объектов Attempt
// export const getAttempts = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { exerciseId, size, from } = req.query;

//     // Проверка наличия обязательного параметра exerciseId
//     if (!exerciseId) {
//       return res.status(400).json({ message: 'excerciseId is required' });
//     }

//     // Преобразование параметров в нужные типы данных
//     const limit = size ? parseInt(size as string) : 10;
//     const skip = from ? parseInt(from as string) : 0;

//     // Поиск объектов Attempt по exerciseId, сортировка и пагинация
//     const attempts = await Attempt.find({ exerciseId })
//       .sort({ datetime: -1 }) // Сортировка по убыванию времени
//       .skip(skip)
//       .limit(limit)
//       .exec();

//     return res.status(200).json(attempts);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error retrieving attempts', error });
//   }
// };

// // Контроллер для получения количества объектов Attempt для каждого exerciseId
// export const getAttemptsCounts = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { exerciseIds } = req.body;

//     // Проверка наличия обязательного параметра exerciseIds
//     if (!exerciseIds || !Array.isArray(exerciseIds)) {
//       return res.status(400).json({ message: 'exerciseIds is required and should be an array' });
//     }

//     // Создание объекта для хранения результатов с начальными значениями 0 для каждого exerciseId
//     const counts: { [key: number]: number } = {};
//     exerciseIds.forEach((id: number) => {
//       counts[id] = 0;
//     });

//     // Агрегационный запрос для получения количества объектов Attempt для каждого exerciseId
//     const results = await Attempt.aggregate([
//       { $match: { exerciseId: { $in: exerciseIds } } }, // Фильтр по exerciseIds
//       { $group: { _id: "$exerciseId", count: { $sum: 1 } } }, // Группировка по exerciseId и подсчет количества
//     ]);

//     // Обновление объекта counts на основе результатов агрегации
//     results.forEach((result: { _id: number, count: number }) => {
//       counts[result._id] = result.count;
//     });

//     // Отправка ответа
//     return res.status(200).json(counts);
//   } catch (error) {
//     // Обработка ошибок
//     return res.status(500).json({ message: 'Error retrieving counts', error });
//   }
// };

// // Контроллер для получения количества объектов Attempt для каждого exerciseId
// export const fetchDataFromSpringBootAPI = async () => {
//   const exerciseId = 111;
//   try {
//     const response = await axios.get(`http://localhost:8080/api/chess_exercise/${exerciseId}`);
//     console.log('response.data');
//     console.log(response.data);

//     // return response.data;
//   } catch (error: any) { // Указываем тип any для переменной error
//     if (error.response && error.response.status === 404) {
//       console.error('Ресурс не найден:', error);
//       // Ваш код для обработки ошибки 404
//     } else {
//       console.error('Ошибка при запросе данных из API Spring Boot:', error);
//       throw error;
//     }
//   }
// };


// src/controllers/attemptController.ts

import { Request, Response } from 'express';
import {
  addAttempt as addAttemptApi,
  getAttempts as getAttemptsApi,
  getAttemptsCounts as getAttemptsCountstApi,
} from 'src/services/attempt';

export const addAttempt = async (req: Request, res: Response): Promise<Response> => {
  try {
    const newAttempt = await addAttemptApi(req.body);
    return res.status(201).json({ message: 'Attempt added successfully', attempt: newAttempt });
  } catch (error: any) {
    const errorMessage = error.message;
    return res.status(500).json({ message: 'Error adding attempt', errorMessage });
  }
};

export const getAttempts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { exerciseId, size, from } = req.query;

    if (!exerciseId) {
      return res.status(400).json({ message: 'exerciseId is required' });
    }

    const attempts = await getAttemptsApi(exerciseId as string, size as string, from as string);
    return res.status(200).json(attempts);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving attempts', error });
  }
};

export const getAttemptsCounts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { exerciseIds } = req.body;

    if (!exerciseIds || !Array.isArray(exerciseIds)) {
      return res.status(400).json({ message: 'exerciseIds is required and should be an array' });
    }

    const counts = await getAttemptsCountstApi(exerciseIds);
    return res.status(200).json(counts);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving counts', error });
  }
};
