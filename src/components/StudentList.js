import React, { useState, useEffect } from 'react';
import { getAllStudents, addStudent } from '../services/api';
import AddStudentModal from './AddStudentModal';
import config from '../config';  // ← この行を追加
import './StudentList.css';

const StudentList = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data.students || []);
      setError(null);
    } catch (err) {
      setError('生徒一覧の読み込みに失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (name, grade) => {
    await addStudent(name, grade);
    await loadStudents(); // 一覧を再読み込み
  };

  const handleAddStudentClick = () => {
    const password = prompt('指導者パスワードを入力してください:');
    if (password === config.TEACHER_PASSWORD) {
      setShowAddModal(true);
    } else {
      alert('パスワードが間違っています');
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
        <h2>生徒一覧</h2>
        <p className="student-count">{students.length}名</p>
      </div>

      <div className="student-grid">
        {students.map((student) => (
          <div 
            key={student.userId} 
            className="student-card"
            onClick={() => onSelectStudent(student.userId)}
          >
            <div className="student-avatar">
              <span className="avatar-icon">⚔️</span>
            </div>
            <div className="student-info">
              <h3>{student.name}</h3>
              <p className="student-grade">{student.grade}年生</p>
              <p className="student-points">{student.totalPoints}pt</p>
            </div>
            <div className="card-arrow">→</div>
          </div>
        ))}
      </div>

      <div className="add-student-section">
        <button 
          className="add-student-btn" 
          onClick={handleAddStudentClick} // ← 変更
        >
          ➕Add
        </button>
      </div>

      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddStudent}
        />
      )}
    </div>
  );
};

export default StudentList;