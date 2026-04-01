import React from 'react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import './RadarChartView.css';

const RadarChartView = ({ latestEvaluation, averageScores }) => {
  if (!latestEvaluation) {
    return (
      <div className="radar-chart-empty">
        <p>評価データがありません</p>
      </div>
    );
  }

  // レーダーチャート用のデータを作成
  const data = [
    { 
      skill: '声の大きさ', 
      latest: latestEvaluation.scores.voice,
      average: averageScores?.voice || 0,
      fullMark: 10 
    },
    { 
      skill: '素振り', 
      latest: latestEvaluation.scores.swing,
      average: averageScores?.swing || 0,
      fullMark: 10 
    },
    { 
      skill: '足さばき', 
      latest: latestEvaluation.scores.footwork,
      average: averageScores?.footwork || 0,
      fullMark: 10 
    },
    { 
      skill: '着装（道着袴、防具）', 
      latest: latestEvaluation.scores.armor,
      average: averageScores?.armor || 0,
      fullMark: 10 
    },
    { 
      skill: '礼儀作法', 
      latest: latestEvaluation.scores.manner,
      average: averageScores?.manner || 0,
      fullMark: 10 
    },
  ];

  return (
    <div className="radar-chart-view">
      <div className="radar-chart-header">
        <h3>能力チャート</h3>
        <p className="radar-chart-date">最終評価: {latestEvaluation.date}</p>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]} 
            tick={{ fill: '#999', fontSize: 10 }}
          />
          <Radar
            name="最新の評価"
            dataKey="latest"
            stroke="#667eea"
            fill="#667eea"
            fillOpacity={0.6}
          />
          {averageScores && (
            <Radar
              name="平均"
              dataKey="average"
              stroke="#ffa726"
              fill="#ffa726"
              fillOpacity={0.3}
            />
          )}
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="score-summary">
        <div className="score-summary-item">
          <span className="label">最新の合計:</span>
          <span className="value">{latestEvaluation.totalScore}</span>
          <span className="max">/ 50</span>
        </div>
        {averageScores && (
          <div className="score-summary-item">
            <span className="label">平均:</span>
            <span className="value">
              {Math.round(
                (averageScores.voice + averageScores.swing + 
                 averageScores.footwork + averageScores.armor + 
                 averageScores.manner) * 10
              ) / 10}
            </span>
            <span className="max">/ 50</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadarChartView;