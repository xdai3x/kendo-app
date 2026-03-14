import React, { useState, useEffect } from 'react';
import { addEvaluation, getAllStudents } from '../services/api';
import './EvaluationInput.css';

const EvaluationInput = ({ onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [scores, setScores] = useState({
    voice: 5,
    swing: 5,
    footwork: 5,
    armor: 5,
    manner: 5
  });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data.students || []);
      // 最初の生徒を自動選択
      if (data.students && data.students.length > 0) {
        setSelectedStudentId(data.students[0].userId);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleScoreChange = (category, value) => {
    setScores(prev => ({ ...prev, [category]: parseInt(value) }));
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStudentId) {
      setError('生徒を選択してください');
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      const result = await addEvaluation(selectedStudentId, date, scores, comment);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      // フォームリセット
      setScores({ voice: 5, swing: 5, footwork: 5, armor: 5, manner: 5 });
      setComment('');
      setDate(new Date().toISOString().split('T')[0]);
      
    } catch (err) {
      setError('評価の保存に失敗しました');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { key: 'voice', label: '声の大きさ' },
    { key: 'swing', label: '素振りの正確さ' },
    { key: 'footwork', label: '踏み込み足の上手さ' },
    { key: 'armor', label: '防具のつけ方' },
    { key: 'manner', label: '礼儀作法' }
  ];

  const selectedStudent = students.find(s => s.userId === selectedStudentId);

  return (
    <div className="evaluation-input">
      <h2>評価入力</h2>
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 生徒選択 */}
        <div className="form-group">
          <label htmlFor="student-name">生徒を選択</label>
          <select
            id="student-name"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            required
          >
            {students.length === 0 && (
              <option value="">生徒がいません</option>
            )}
            {students.map(student => (
              <option key={student.userId} value={student.userId}>
                {student.name} ({student.grade}年生)
              </option>
            ))}
          </select>
        </div>

        {/* 選択中の生徒情報 */}
        {selectedStudent && (
          <div className="selected-student-info">
            <span className="avatar-mini">⚔️</span>
            <div>
              <strong>{selectedStudent.name}</strong>
              <span className="student-meta">
                {selectedStudent.grade}年生 · {selectedStudent.totalPoints}pt
              </span>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>稽古日</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="scores-section">
          {categories.map(({ key, label }) => (
            <div key={key} className="score-input-item">
              <label>{label}</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores[key]}
                  onChange={(e) => handleScoreChange(key, e.target.value)}
                  className="score-slider"
                />
                <span className="score-display">{scores[key]}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="total-display">
          <span>合計:</span>
          <span className="total-value">{totalScore}</span>
          <span className="total-max">/ 50</span>
        </div>

        <div className="form-group">
          <label>コメント（任意）</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="今日の稽古について..."
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={submitting || !selectedStudentId}
        >
          {submitting ? '保存中...' : '評価を保存'}
        </button>
      </form>
    </div>
  );
};

export default EvaluationInput;