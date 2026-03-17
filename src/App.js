import React, { useState } from 'react';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import EvaluationHistory from './components/EvaluationHistory';
import AdminPanel from './components/AdminPanel';
import config from './config';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSelectStudent = (userId) => {
    setSelectedStudentId(userId);
    setActiveTab('detail');
  };

  const handleBackToList = () => {
    setSelectedStudentId(null);
    setActiveTab('list');
  };

  const handleAdminClick = () => {
    const password = prompt('パスワードを入力してください:');
    if (password === config.TEACHER_PASSWORD) {
      setIsAuthenticated(true);
      setActiveTab('admin');
    } else {
      alert('パスワードが間違っています');
    }
  };

  const handleBackFromAdmin = () => {
    setIsAuthenticated(false);
    setActiveTab('list');
    setRefreshKey(prev => prev + 1); // データを再読み込み
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setRefreshKey(prev => prev + 1);
    setActiveTab('detail');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚔️ 三原台剣友会成長記録（試運転中） ⚔️</h1>
        <p></p>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'list' || activeTab === 'detail' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          一覧
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          履歴
        </button>
        <button
          className={activeTab === 'evaluate' ? 'active' : ''}
          onClick={() => setActiveTab('evaluate')}
        >
          記録入力
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'list' && (
          <StudentList 
            key={refreshKey}
            onSelectStudent={handleSelectStudent} 
          />
        )}
        {activeTab === 'detail' && selectedStudentId && (
          <StudentDetail 
            key={refreshKey}
            userId={selectedStudentId}
            onBack={handleBackToList}
          />
        )}
        {activeTab === 'history' && (
          <EvaluationHistory key={refreshKey} />
        )}
        {activeTab === 'admin' && isAuthenticated && (
          <AdminPanel onBack={handleBackFromAdmin} />
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