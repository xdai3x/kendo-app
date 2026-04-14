import React, { useState, useEffect } from 'react';
import { getUserProfile, markAsRead } from '../services/api';
import RadarChartView from './RadarChartView';
import './StudentDetail.css';

const StudentDetail = ({ userId, onBack }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile(userId);
      setProfile({
        ...data.user,
        recentEvaluations: data.recentEvaluations
      });
      setError(null);
    } catch (err) {
      setError('プロフィールの読み込みに失敗しました');
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
      setProfile(prevProfile => ({
        ...prevProfile,
        recentEvaluations: prevProfile.recentEvaluations.map(evaluation => 
          evaluation.evaluationId === evaluationId
            ? { ...evaluation, isRead: newIsRead }
            : evaluation
        )
      }));
    } catch (error) {
      console.error('Error toggling read status:', error);
      alert('既読状態の更新に失敗しました');
    }
  };

  const calculateAverageScores = (evaluations) => {
    if (!evaluations || evaluations.length === 0) return null;

    const totals = { voice: 0, swing: 0, footwork: 0, armor: 0, manner: 0 };
    evaluations.forEach(evaluation => {
      totals.voice += evaluation.scores.voice;
      totals.swing += evaluation.scores.swing;
      totals.footwork += evaluation.scores.footwork;
      totals.armor += evaluation.scores.armor;
      totals.manner += evaluation.scores.manner;
    });

    const count = evaluations.length;
    return {
      voice: Math.round(totals.voice / count * 10) / 10,
      swing: Math.round(totals.swing / count * 10) / 10,
      footwork: Math.round(totals.footwork / count * 10) / 10,
      armor: Math.round(totals.armor / count * 10) / 10,
      manner: Math.round(totals.manner / count * 10) / 10,
    };
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
        <button onClick={loadProfile}>再試行</button>
      </div>
    );
  }

  if (!profile) return null;

  const progressPercent = profile.nextRankInfo 
    ? ((profile.totalPoints - profile.currentRankInfo.requiredPoints) / 
       (profile.nextRankInfo.requiredPoints - profile.currentRankInfo.requiredPoints) * 100)
    : 100;

  const averageScores = calculateAverageScores(profile.recentEvaluations);
  const latestEvaluation = profile.recentEvaluations?.[0];
  const recentHistory = profile.recentEvaluations?.slice(0, 5) || [];

  return (
    <div className="student-detail">
      {/* 戻るボタン */}
      <button className="back-button" onClick={onBack}>
        一覧に戻る
      </button>

      <div className="profile-header">
        <div className="avatar-section">
          <div className="avatar-circle">⚔️</div>
          <h1>{profile.name}</h1>
          <p className="grade-info">{profile.grade >= 7 ? `中学${profile.grade - 6}` : `${profile.grade}`}年生</p>
        </div>
        
        <div className="rank-card">
          <h2>{profile.currentRankInfo.name}</h2>
          <div className="points-display">
            <span className="points-number">{profile.totalPoints}</span>
            <span className="points-label">ポイント</span>
          </div>
        </div>
      </div>

      {profile.nextRankInfo && (
        <div className="next-rank-section">
          <p>次の段位まで: <strong>{profile.pointsToNextRank}</strong> ポイント</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="next-rank-name">→ {profile.nextRankInfo.name}</p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>総評価回数</h3>
          <p className="stat-value">{profile.recentEvaluations?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>獲得バッジ</h3>
          <p className="stat-value">{profile.badges?.length || 0}</p>
        </div>
      </div>

      {/* 最新の評価詳細 */}
      {latestEvaluation && (
        <div className="latest-evaluation-section">
          <h3>📝 最新の評価</h3>
          <div className="latest-evaluation-card">
            <div className="evaluation-header">
              <span className="evaluation-date">{formatDate(latestEvaluation.date)}</span>
              <span 
                className="evaluation-total"
                style={{ color: getScoreColor(latestEvaluation.totalScore / 5) }}
              >
                {latestEvaluation.totalScore} / 50
              </span>
            </div>

            <div className="evaluation-scores-detail">
              <div className="score-item">
                <span className="score-label">声の大きさ</span>
                <div className="score-bar-container">
                  <div 
                    className="score-bar"
                    style={{ 
                      width: `${latestEvaluation.scores.voice * 10}%`,
                      backgroundColor: getScoreColor(latestEvaluation.scores.voice)
                    }}
                  ></div>
                  <span className="score-value">{latestEvaluation.scores.voice}</span>
                </div>
              </div>
              <div className="score-item">
                <span className="score-label">素振りの正確さ</span>
                <div className="score-bar-container">
                  <div 
                    className="score-bar"
                    style={{ 
                      width: `${latestEvaluation.scores.swing * 10}%`,
                      backgroundColor: getScoreColor(latestEvaluation.scores.swing)
                    }}
                  ></div>
                  <span className="score-value">{latestEvaluation.scores.swing}</span>
                </div>
              </div>
              <div className="score-item">
                <span className="score-label">踏み込み足</span>
                <div className="score-bar-container">
                  <div 
                    className="score-bar"
                    style={{ 
                      width: `${latestEvaluation.scores.footwork * 10}%`,
                      backgroundColor: getScoreColor(latestEvaluation.scores.footwork)
                    }}
                  ></div>
                  <span className="score-value">{latestEvaluation.scores.footwork}</span>
                </div>
              </div>
              <div className="score-item">
                <span className="score-label">防具のつけ方</span>
                <div className="score-bar-container">
                  <div 
                    className="score-bar"
                    style={{ 
                      width: `${latestEvaluation.scores.armor * 10}%`,
                      backgroundColor: getScoreColor(latestEvaluation.scores.armor)
                    }}
                  ></div>
                  <span className="score-value">{latestEvaluation.scores.armor}</span>
                </div>
              </div>
              <div className="score-item">
                <span className="score-label">礼儀作法</span>
                <div className="score-bar-container">
                  <div 
                    className="score-bar"
                    style={{ 
                      width: `${latestEvaluation.scores.manner * 10}%`,
                      backgroundColor: getScoreColor(latestEvaluation.scores.manner)
                    }}
                  ></div>
                  <span className="score-value">{latestEvaluation.scores.manner}</span>
                </div>
              </div>
            </div>

            {latestEvaluation.teacherComment && (
              <div className="teacher-comment-box">
                <div className="comment-icon">💬</div>
                <div className="comment-content">
                  <p className="comment-label">コメント</p>
                  <p className="comment-text">{latestEvaluation.teacherComment}</p>
                </div>
              </div>
            )}
            {/* 既読チェックボックス */}
            <div className={`latest-evaluation-card ${!latestEvaluation.isRead ? 'unread' : ''}`}>
              <label className="read-checkbox-label">
                <input
                  type="checkbox"
                  checked={latestEvaluation.isRead || false}
                  onChange={() => handleReadToggle(
                    latestEvaluation.evaluationId, 
                    latestEvaluation.isRead
                  )}
                />
                <span className="checkbox-text">見ました</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* レーダーチャート */}
      {profile.recentEvaluations && profile.recentEvaluations.length > 0 && (
        <RadarChartView 
          latestEvaluation={profile.recentEvaluations[0]}
          averageScores={averageScores}
        />
      )}  
    </div>
  );
};

export default StudentDetail;