import { LeaderboardEntry } from '../types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (data: LeaderboardEntry[]) => {
  // Format Data
  const formattedData = data.map(entry => ({
    'Rank': entry.rank,
    'Participant / Team Name': entry.participantName,
    'Team ID': entry.userId,
    'Department / College': entry.college || '',
    'Round 1 Score': entry.round1Score,
    'Round 2 Score': entry.round2Score,
    'Round 3 Score': entry.round3Score,
    'Overall / Cumulative Score': entry.totalScore,
    'Accuracy (%)': entry.accuracy,
    'Questions Solved': entry.questionsSolved,
    'Status': entry.status,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(formattedData);
  
  // Create sheets
  XLSX.utils.book_append_sheet(wb, ws, 'Overall Cumulative Leaderboard');
  
  // Add rounds 1, 2, 3 sheets
  [1, 2, 3].forEach(round => {
    const roundData = data.map(entry => {
        let rScore = 0;
        if(round === 1) rScore = entry.round1Score;
        else if(round === 2) rScore = entry.round2Score;
        else if(round === 3) rScore = entry.round3Score;
        
        return {
          'Rank': entry.rank, // Keeping overall rank for context, or we could sort
          'Participant / Team Name': entry.participantName,
          'Team ID': entry.userId,
          'Department / College': entry.college || '',
          [`Round ${round} Score`]: rScore,
        };
    }).sort((a, b) => b[`Round ${round} Score`] - a[`Round ${round} Score`])
      .map((item, idx) => ({ 'Round Rank': idx + 1, ...item }));
    
    const rws = XLSX.utils.json_to_sheet(roundData);
    XLSX.utils.book_append_sheet(wb, rws, `Round ${round} Leaderboard`);
  });

  XLSX.writeFile(wb, 'BugFest_Leaderboard.xlsx');
};

export const exportToPDF = (data: LeaderboardEntry[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('GENCRAFT — BUG FEST', 14, 22);
  doc.setFontSize(12);
  doc.text('Official Leaderboard Results', 14, 30);
  
  const head = [['Rank', 'Participant', 'R1', 'R2', 'R3', 'Total Score', 'Accuracy']];
  const body = data.map(entry => [
    entry.rank,
    entry.participantName,
    entry.round1Score,
    entry.round2Score,
    entry.round3Score,
    entry.totalScore,
    entry.accuracy + '%'
  ]);

  autoTable(doc, {
    startY: 40,
    head: head,
    body: body,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] }, // blue-600
  });

  doc.save('BugFest_Leaderboard.pdf');
};
