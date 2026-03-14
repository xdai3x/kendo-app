import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ユーザー情報を取得
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    console.log('API Full Response:', response.data); // デバッグ用
    return response.data;  // { user: {...}, recentEvaluations: [...] } を返す
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// 評価を追加（userIdを引数で受け取る）
export const addEvaluation = async (userId, date, scores, comment = '') => {
  try {
    const response = await api.post('/evaluations', {
      userId,  // 動的に受け取ったuserIdを使用
      date,
      scores,
      teacherComment: comment
    });
    return response.data;
  } catch (error) {
    console.error('Error adding evaluation:', error);
    throw error;
  }
};

// 全生徒を取得
export const getAllStudents = async () => {
  try {
    const response = await api.get('/users');
    console.log('Students API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all students:', error);
    throw error;
  }
};

// 生徒を追加
export const addStudent = async (name, grade) => {
  try {
    const response = await api.post('/users', {
      name,
      grade
    });
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

export default api;