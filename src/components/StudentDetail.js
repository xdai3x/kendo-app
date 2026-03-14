import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../services/api';
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

  return (
    <div className="student-detail">
      {/* 戻るボタン */}
      <button className="back-button" onClick={onBack}>
        ← 生徒一覧に戻る
      </button>

      <div className="profile-header">
        <div className="avatar-section">
          <div className="avatar-circle">⚔️</div>
          <h1>{profile.name}</h1>
          <p className="grade-info">{profile.grade}年生</p>
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