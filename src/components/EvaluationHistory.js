import React, { useState, useEffect } from 'react';
import { getUserProfile, getAllStudents, markAsRead } from '../services/api';
import './EvaluationHistory.css';

const EvaluationHistory = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      loadHistory();
    }
  }, [selectedStudentId]);

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
      setError('生徒一覧の読み込みに失敗しました');
    }
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile(selectedStudentId);
      setEvaluations(data.recentEvaluations || []);
      setError(null);
    } catch (err) {
      setError('履歴の読み込みに失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 既読チェックの処理
  const handleReadToggle = async (evaluationId, currentIsRead) => {
    try {
      const newIsRead = !currentIsRead;
      await markAsRead(evaluationId, newIsRead);
      
      // ローカルの状態を更新
      setEvaluations(prevEvaluations => 
        prevEvaluations.map(evaluation => 
          evaluation.evaluationId === evaluationId
            ? { ...evaluation, isRead: newIsRead }
            : evaluation
        )
      );
    } catch (error) {
      console.error('Error toggling read status:', error);
      alert('既読状態の更新に失敗しました');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日（${weekday}）`;
  };

  const getScoreColor = (score) => {
    if (score >= 9) return '#4caf50';
    if (score >= 7) return '#667eea';
    if (score >= 5) return '#ffa726';
    return '#f44336';
  };

  const selectedStudent = students.find(s => s.userId === selectedStudentId);

  if (loading && !selectedStudentId) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="evaluation-history">
      <div className="history-header">
        <h2>評価履歴</h2>
      </div>

      {/* 生徒選択 */}
      <div className="student-selector">
        <label htmlFor="student-name">生徒を選択</label>
        <select
          id="student-name"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          {students.map(student => (
            <option key={student.userId} value={student.userId}>
              {student.name} (
              {student.grade >= 7
                ? `中学${student.grade - 6}`
                : `${student.grade}`}
                年生)
            </option>
          ))}
        </select>
      </div>

      {/* 選択中の生徒情報 */}
      {selectedStudent && (
        <div className="selected-student-card">
          <span className="avatar-mini">⚔️</span>
          <div className="student-details">
            <h3>{selectedStudent.name}</h3>
            <p>{selectedStudent.grade}年生 · {selectedStudent.totalPoints}pt</p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={loadHistory}>再試行</button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>読み込み中...</p>
        </div>
      ) : evaluations.length === 0 ? (
        <div className="history-empty">
          <div className="empty-icon">📋</div>
          <p>まだ評価がありません</p>
          <p className="empty-subtitle">「評価入力」タブから最初の評価を記録しましょう</p>
        </div>
      ) : (
        <>
          <div className="history-stats">
            <div className="stat-item">
              <span className="stat-label">総評価回数</span>
              <span className="stat-value">{evaluations.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">平均点</span>
              <span className="stat-value">
                {(evaluations.reduce((sum, e) => sum + e.totalScore, 0) / evaluations.length).toFixed(1)}
              </span>
            </div>
          </div>

          <div className="history-list">
            {evaluations.map((evaluation, index) => (
              <div 
                key={evaluation.evaluationId || index} 
                className={`history-item ${evaluation.isRead ? 'read' : 'unread'}`}
              >
                <div className="history-item-header">
                  <div className="header-left">
                    <h3>{formatDate(evaluation.date)}</h3>
                    {!evaluation.isRead && (
                      <span className="unread-badge">未読</span>
                    )}
                  </div>
                  <div 
                    className="total-badge"
                    style={{ backgroundColor: getScoreColor(evaluation.totalScore / 5) }}
                  >
                    {evaluation.totalScore} / 50
                  </div>
                </div>

                <div className="scores-grid">
                  <div className="score-box">
                    <span className="score-label">声</span>
                    <span 
                      className="score-number"
                      style={{ color: getScoreColor(evaluation.scores.voice) }}
                    >
                      {evaluation.scores.voice}
                    </span>
                  </div>
                  <div className="score-box">
                    <span className="score-label">素振り</span>
                    <span 
                      className="score-number"
                      style={{ color: getScoreColor(evaluation.scores.swing) }}
                    >
                      {evaluation.scores.swing}
                    </span>
                  </div>
                  <div className="score-box">
                    <span className="score-label">踏み込み</span>
                    <span 
                      className="score-number"
                      style={{ color: getScoreColor(evaluation.scores.footwork) }}
                    >
                      {evaluation.scores.footwork}
                    </span>
                  </div>
                  <div className="score-box">
                    <span className="score-label">防具</span>
                    <span 
                      className="score-number"
                      style={{ color: getScoreColor(evaluation.scores.armor) }}
                    >
                      {evaluation.scores.armor}
                    </span>
                  </div>
                  <div className="score-box">
                    <span className="score-label">礼儀</span>
                    <span 
                      className="score-number"
                      style={{ color: getScoreColor(evaluation.scores.manner) }}
                    >
                      {evaluation.scores.manner}
                    </span>
                  </div>
                </div>

                {evaluation.teacherComment && (
                  <div className="teacher-comment">
                    <span className="comment-icon">💬</span>
                    <p>{evaluation.teacherComment}</p>
                  </div>
                )}

                {/* 既読チェックボックス */}
                <div className="read-checkbox-container">
                  <label className="read-checkbox-label">
                    <input
                      type="checkbox"
                      checked={evaluation.isRead || false}
                      onChange={() => handleReadToggle(
                        evaluation.evaluationId, 
                        evaluation.isRead
                      )}
                    />
                    <span className="checkbox-text">見ました</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EvaluationHistory;