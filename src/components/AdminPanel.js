import React, { useState } from 'react';
import EvaluationInput from './EvaluationInput';
import AddStudentModal from './AddStudentModal';
import { addStudent, getAllStudents } from '../services/api';
import './AdminPanel.css';

const AdminPanel = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('evaluate');
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddStudent = async (name, grade) => {
    await addStudent(name, grade);
    setSuccessMessage(`${name}さんを追加しました`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEvaluationSuccess = () => {
    setSuccessMessage('評価を保存しました');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <button className="back-button" onClick={onBack}>
          ← 戻る
        </button>
        <h1>⚙️ 管理画面</h1>
      </div>

      {successMessage && (
        <div className="success-banner">
          ✅ {successMessage}
        </div>
      )}

      <nav className="admin-nav">
        <button
          className={activeTab === 'evaluate' ? 'active' : ''}
          onClick={() => setActiveTab('evaluate')}
        >
          評価入力
        </button>
        <button
          className={activeTab === 'addStudent' ? 'active' : ''}
          onClick={() => setActiveTab('addStudent')}
        >
          生徒追加
        </button>
      </nav>

      <div className="admin-content">
        {activeTab === 'evaluate' && (
          <EvaluationInput onSuccess={handleEvaluationSuccess} />
        )}
        
        {activeTab === 'addStudent' && (
          <div className="add-student-section">
            <h2>新しい生徒を追加</h2>
            <p className="description">
              生徒の名前と学年を入力して、道場に新しいメンバーを追加しましょう。
            </p>
            <button 
              className="add-student-btn-large"
              onClick={() => setShowAddModal(true)}
            >
              ➕ 追加
            </button>
          </div>
        )}
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

export default AdminPanel;