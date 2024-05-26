import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import config from 'src/config';
import app from 'src/app';
import express from 'express';


const { expect } = chai;
chai.use(chaiHttp);

const serverUrl = 'http://localhost:8888'; // Адрес запущенного сервера


const mockExerciseApp = express();

describe('Attempt controller', () => {

  before(async () => {
    mockExerciseApp.get('/api/chess_exercise/:exerciseId', (req, res) => {
      console.log('/api/chess_exercise/:exerciseId');
      const exerciseId = parseInt(req.params.exerciseId); // Преобразуем exerciseId в число

      const validExerciseIds = [1, 2, 3];

      if (validExerciseIds.includes(exerciseId)) { // Проверяем, есть ли exerciseId в списке допустимых
        res.status(200).json({ message: 'OK' });
      } else {
        res.status(404).json({ message: 'Exercise not found' });
      }
    });

    mockExerciseApp.listen(8080, 'localhost');

    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 30000,
    };
    await mongoose.connect(config.mongoAddress, mongooseOpts);

    // Очищаем коллекцию до выполнения всех тестов
    await mongoose.connection.db.collection('attempt').deleteMany({});
    await mongoose.disconnect();

    // Запуск сервера
    await app();
  });

  after(async () => {
    // Очищаем коллекцию после выполнения всех тестов
    await mongoose.connection.db.collection('attempt').deleteMany({});
    await mongoose.disconnect();
  });

  it('should save the attempt', (done) => {
    const attempts = [
      {
        studentId: 90000,
        timeSpent: 'PT1H0M0S',
        solved: true,
        exerciseId: 1,
      },
      {
        studentId: 80000,
        timeSpent: 'PT1H0M0S',
        solved: true,
        exerciseId: 2,
      },
      {
        studentId: 70000,
        timeSpent: 'PT1H0M0S',
        solved: true,
        exerciseId: 3,
      },
      {
        studentId: 80000,
        timeSpent: 'PT1H0M0S',
        solved: true,
        exerciseId: 1,
      },
      {
        studentId: 70000,
        timeSpent: 'PT1H0M0S',
        solved: true,
        exerciseId: 3,
      },
      {
        studentId: 80000,
        timeSpent: 'PT1H0M0S',
        solved: true,
        exerciseId: 1,
      },
      {
        studentId: 90000,
        timeSpent: 'PT1H0M0S',
        solved: true,
        exerciseId: 1,
      },
      {
        studentId: 80000,
        timeSpent: 'PT1H0M0S',
        solved: false,
        exerciseId: 1,
      },
      {
        studentId: 90000,
        timeSpent: 'PT1H0M0S',
        solved: true,
        exerciseId: 1,
      },
      {
        studentId: 80000,
        timeSpent: 'PT1H0M0S',
        solved: false,
        exerciseId: 1,
      },
      {
        studentId: 90000,
        timeSpent: 'PT1H0M0S',
        solved: true,
        exerciseId: 1,
      },
      {
        studentId: 80000,
        timeSpent: 'PT1H0M0S',
        solved: false,
        exerciseId: 1,
      },
    ];

    let count = 0; // Счетчик выполненных запросов

    for (const attempt of attempts) {
      chai.request(serverUrl)
        .post('/api/attempt')
        .send(attempt)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').eql('Attempt added successfully');
          expect(res.body.attempt).to.have.property('studentId').eql(attempt.studentId);
          expect(res.body.attempt).to.have.property('timeSpent').eql(attempt.timeSpent);
          expect(res.body.attempt).to.have.property('solved').eql(attempt.solved);
          expect(res.body.attempt).to.have.property('exerciseId').eql(attempt.exerciseId);
          expect(res.body.attempt).to.have.property('datetime');
          expect(res.body.attempt).to.have.property('_id');

          count++;
          if (count === attempts.length) {
            done(); // Вызываем done() только после выполнения всех запросов
          }
        });
    }
  });

  it('should not save the attempt', (done) => {
    const attempt = {
      studentId: 90000,
      timeSpent: 'PT1H0M0S',
      solved: true,
      exerciseId: 44,
    };

    chai.request(serverUrl)
      .post('/api/attempt')
      .send(attempt)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('errorMessage').eql('Attempt cannot be added as exercise with the id 44 does not exist');
        done();
      });
  });

  it('should return list of attempts related to a specific exercise', (done) => {
    const exerciseId = 1;
    const size = 5;
    const from = 3;

    chai.request(serverUrl)
      .get(`/api/attempt?exerciseId=${exerciseId}&size=${size}&from=${from}`)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(Object.keys(res.body).length).to.equal(size);

        for (const e of res.body) {
          expect(e).to.have.property('exerciseId').eql(exerciseId);

        }

        done(); // Вызываем done() только после всех проверок
      });
  });

  it('should return the total number of attempts that relate to each of the elements exercises', (done) => {
    const exerciseIds = [1, 2, 3];

    chai.request(serverUrl)
      .post('/api/attempt/_counts')
      .send({ exerciseIds: exerciseIds })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body).to.deep.equal({ '1': 9, '2': 1, '3': 2 });
        done();
      });
  });
});
