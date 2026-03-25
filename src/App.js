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
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectStudent = (userId) => {
    setSelectedStudentId(userId);
    setActiveTab('detail');
  };

  const handleBackToList = () => {
    setSelectedStudentId(null);
    setActiveTab('list');
  };

  const handleAdminClick = () => {
    console.log('管理ボタンがクリックされました'); // デバッグ用
    console.log('TEACHER_PASSWORD:', config.TEACHER_PASSWORD); // デバッグ用
    
    const password = prompt('管理者パスワードを入力してください:');
    console.log('入力されたパスワード:', password); // デバッグ用
    
    if (password === config.TEACHER_PASSWORD) {
      console.log('認証成功'); // デバッグ用
      setActiveTab('admin');
    } else if (password !== null) {
      console.log('認証失敗'); // デバッグ用
      alert('パスワードが間違っています');
    }
  };

  const handleBackFromAdmin = () => {
    setActiveTab('list');
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚔️ 三原台剣友会成長記録 ⚔️</h1>
        <p>（試運転中）</p>
      </header>

      {activeTab !== 'admin' && (
        <nav className="app-nav">
          <button
            className={activeTab === 'list' || activeTab === 'detail' ? 'active' : ''}
            onClick={() => setActiveTab('list')}
          >
            生徒一覧
          </button>
          <button
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            履歴
          </button>
          <button
            className="admin-button"
            onClick={handleAdminClick}
          >
            ⚙️ 管理
          </button>
        </nav>
      )}

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
        {activeTab === 'admin' && (
          <AdminPanel onBack={handleBackFromAdmin} />
        )}
      </main>
    </div>
  );
}

export default App;