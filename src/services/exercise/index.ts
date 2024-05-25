import axios from 'axios';
import config from 'src/config';

// Контроллер для получения количества объектов Attempt для каждого exerciseId
export const fetchDataFromSpringBootAPI = async (exerciseId: number) => {
  
  try {
    await axios.get(`${config.chessApiAddress}/chess_exercise/${exerciseId}`);
    return true;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return false;
    } else {
      console.error('Ошибка при запросе данных из API Spring Boot:', error);
      throw error;
    }
  }
};
