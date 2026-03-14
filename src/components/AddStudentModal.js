import React, { useState } from 'react';
import './AddStudentModal.css';

const AddStudentModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('1');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('名前を入力してください');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      await onSuccess(name.trim(), parseInt(grade));
      onClose();
    } catch (err) {
      setError('生徒の追加に失敗しました');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-student-modal" onClick={(e) => e.stopPropagation()}>
        <h2>新しい生徒を追加</h2>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="student-name">生徒の名前 *</label>
            <input
              id="student-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 山田太郎"
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label>学年 *</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="1">1年生</option>
              <option value="2">2年生</option>
              <option value="3">3年生</option>
              <option value="4">4年生</option>
              <option value="5">5年生</option>
              <option value="6">6年生</option>
            </select>
          </div>
          
          <div className="button-group">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={submitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={submitting}
            >
              {submitting ? '追加中...' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;