import React, { useState } from 'react';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import EvaluationInput from './components/EvaluationInput';
import EvaluationHistory from './components/EvaluationHistory';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectStudent = (userId) => {
    setSelectedStudentId(userId);
    setActiveTab('detail');
  };

  const handleBackToList = () => {
    setSelectedStudentId(null);
    setActiveTab('list');
  };

  const handleEvaluationSuccess = (data) => {
    setSuccessData(data);
    setShowSuccessModal(true);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setRefreshKey(prev => prev + 1);
    setActiveTab('detail');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚔️ 剣道教室アプリ</h1>
        <p>生徒の成長を可視化しよう</p>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'list' || activeTab === 'detail' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          生徒一覧
        </button>
        <button
          className={activeTab === 'evaluate' ? 'active' : ''}
          onClick={() => setActiveTab('evaluate')}
        >
          評価入力
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          履歴
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'list' && (
          <StudentList onSelectStudent={handleSelectStudent} />
        )}
        {activeTab === 'detail' && selectedStudentId && (
          <StudentDetail 
            key={refreshKey}
            userId={selectedStudentId}
            onBack={handleBackToList}
          />
        )}
        {activeTab === 'evaluate' && (
          <EvaluationInput onSuccess={handleEvaluationSuccess} />
        )}
        {activeTab === 'history' && (
          <EvaluationHistory key={refreshKey} />
        )}
      </main>

      {showSuccessModal && successData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🎉 評価を保存しました！</h2>
            <div className="modal-points">
              +{successData.earnedPoints}
            </div>
            <p className="modal-label">ポイント獲得</p>
            
            {successData.rankChanged && (
              <div className="rank-up-box">
                <h3>段位昇格！</h3>
                <p className="new-rank">{successData.newRank.name}</p>
              </div>
            )}
            
            <p className="modal-message">{successData.message}</p>
            <button className="modal-close" onClick={closeModal}>
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;