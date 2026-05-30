import React, { useState, useEffect } from 'react';
import { getAllStudents, getUserProfile } from '../services/api';  // ← getUserProfile を追加
import './StudentList.css';

const StudentList = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      const studentsData = data.students || [];
      
      // ← ここから追加：各生徒の未読評価件数を取得
      const studentsWithUnread = await Promise.all(
        studentsData.map(async (student) => {
          try {
            const profileData = await getUserProfile(student.userId);
            const unreadCount = (profileData.recentEvaluations || []).filter(
              evaluation => !evaluation.isRead
            ).length;
            return {
              ...student,
              unreadCount: unreadCount
            };
          } catch (err) {
            console.error(`Error fetching profile for ${student.userId}:`, err);
            return {
              ...student,
              unreadCount: 0
            };
          }
        })
      );
      // ← ここまで追加
      
      setStudents(studentsWithUnread);
      setError(null);
    } catch (err) {
      setError('一覧の読み込みに失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>❌ {error}</p>
        <button onClick={loadStudents}>再試行</button>
      </div>
    );
  }

  return (
    <div className="student-list">
      <div className="list-header">
        <p className="student-count">{students.length}名</p>
      </div>

      <div className="student-grid">
        {students.map((student) => (
          <div 
            key={student.userId} 
            className="student-card"
            onClick={() => onSelectStudent(student.userId)}
          >

            {/* 未読バッジ */}
            {student.unreadCount > 0 && (
              <div className="unread-badge">
                {student.unreadCount}
              </div>
            )}
            
            <div className="student-avatar">
              <span className="avatar-icon">
                {student.grade >= 4 ? '🐥' : '🐣'}
              </span>
            </div>
            <div className="student-info">
              <h3>{student.name}</h3>
              <p className="student-grade">
                {student.grade >= 7 ? `中学${student.grade - 6}` : `${student.grade}`}
                年生
              </p>
              <p className="student-points">{student.totalPoints}pt</p>
            </div>
            <div className="card-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;