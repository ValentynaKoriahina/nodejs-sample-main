import mongoose, { Document, Schema } from 'mongoose';

// Определение интерфейса для документа Attempt
export interface IAttempt extends Document {
  studentId: number;
  timeSpent: string; // формат ISO 8601
  solved: boolean;
  exerciseId: number;
  datetime: Date;
}

// Создание схемы для сущности Attempt
const attemptSchema = new Schema({
  studentId: {
    type: Number,
    required: true,
  },
  timeSpent: {
    type: String,
    required: true,
    validate: {
      validator: function(value: string) {
        // Проверка формата timeSpent
        const timeSpentRegex = /^PT\d+H\d+M\d+S$/;
        return timeSpentRegex.test(value);
      },
      message: 'Invalid timeSpent format',
    },
  },
  solved: {
    type: Boolean,
    required: true,
  },
  exerciseId: {
    type: Number,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
}, {
  collection: 'attempt', // Явно указываем имя коллекции
});

// Создание модели на основе схемы
const Attempt = mongoose.model<IAttempt>('Attempt', attemptSchema);

export default Attempt;
