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
      'Round 1 Score': entry.round1Score ?? entry.totalScore,
      'Overall Score': entry.totalScore,
      'Accuracy (%)': entry.accuracy,
      'Questions Solved': entry.questionsSolved,
      'Status': entry.status,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(wb, ws, 'Official Leaderboard');
    
    const roundData = data.map(entry => ({
      'Rank': entry.rank,
      'Participant / Team Name': entry.participantName,
      'Team ID': entry.userId,
      'Department / College': entry.college || '',
      'Score': entry.round1Score ?? entry.totalScore,
    })).sort((a, b) => Number(b['Score']) - Number(a['Score']))
      .map((item, idx) => ({ 'Round Rank': idx + 1, ...item }));
    
    const rws = XLSX.utils.json_to_sheet(roundData);
    XLSX.utils.book_append_sheet(wb, rws, 'Round 1 Leaderboard');

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
    
    const head = [['Rank', 'Participant / Team', 'Score', 'Questions Solved', 'Accuracy', 'Status']];
    const body = data.map(entry => [
      entry.rank,
      entry.participantName,
      entry.round1Score ?? entry.totalScore,
      entry.questionsSolved,
      entry.accuracy + '%',
      entry.status
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
