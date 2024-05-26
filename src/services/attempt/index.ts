import Attempt from 'src/model/attempt';
import { fetchDataFromSpringBootAPI } from 'src/services/exercise';


export const addAttempt = async (data: { studentId: string, timeSpent: number, solved: boolean, exerciseId: number }) => {

  const { studentId, timeSpent, solved, exerciseId } = data;

  // Проверка валидности exerciseId
  const validExerciseId = await fetchDataFromSpringBootAPI(exerciseId);

  if (!validExerciseId) {
    throw new Error(`Attempt cannot be added as exercise with the id ${exerciseId} does not exist`);
  }

  const newAttempt = new Attempt({
    studentId,
    timeSpent,
    solved,
    exerciseId,
    datetime: new Date(),
  });

  await newAttempt.save();
  return newAttempt;
};


export const getAttempts = async (exerciseId: string, size?: string, from?: string) => {
  const limit = size ? parseInt(size) : 10;
  const skip = from ? parseInt(from) : 0;

  const attempts = await Attempt.find({ exerciseId })
    .sort({ datetime: -1 })
    .skip(skip)
    .limit(limit)
    .exec();

  return attempts;
};

export const getAttemptsCounts = async (exerciseIds: number[]) => {
  const counts: { [key: number]: number } = {};
  exerciseIds.forEach((id: number) => {
    counts[id] = 0;
  });

  const results = await Attempt.aggregate([
    { $match: { exerciseId: { $in: exerciseIds } } },
    { $group: { _id: "$exerciseId", count: { $sum: 1 } } },
  ]);

  results.forEach((result: { _id: number, count: number }) => {
    counts[result._id] = result.count;
  });

  return counts;
};
