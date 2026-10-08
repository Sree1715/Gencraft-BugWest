import { LeaderboardEntry } from '../types';

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(script);
  });
};

export const exportToExcel = async (data: LeaderboardEntry[]) => {
  try {
    // Load SheetJS from CDN
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
    const XLSX = (window as any).XLSX;

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
    XLSX.utils.book_append_sheet(wb, ws, 'Overall Cumulative Leaderboard');
    
    [1, 2, 3].forEach(round => {
      const roundData = data.map(entry => {
          let rScore = 0;
          if(round === 1) rScore = entry.round1Score;
          else if(round === 2) rScore = entry.round2Score;
          else if(round === 3) rScore = entry.round3Score;
          
          return {
            'Rank': entry.rank,
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
  } catch (error) {
    console.error('Failed to export Excel:', error);
    alert('Failed to load the Excel export library. Please check your internet connection.');
  }
};

export const exportToPDF = async (data: LeaderboardEntry[]) => {
  try {
    // Load jsPDF from CDN
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js');
    
    const { jsPDF } = (window as any).jspdf;
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

    (doc as any).autoTable({
      startY: 40,
      head: head,
      body: body,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save('BugFest_Leaderboard.pdf');
  } catch (error) {
    console.error('Failed to export PDF:', error);
    alert('Failed to load the PDF export library. Please check your internet connection.');
  }
};
