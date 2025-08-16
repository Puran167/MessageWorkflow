import jsPDF from 'jspdf';

export function exportMessageToPDF(message) {
  const doc = new jsPDF();
  doc.text(`Title: ${message.title}`, 10, 10);
  doc.text(`Content: ${message.content}`, 10, 20);
  doc.text(`Status: ${message.status}`, 10, 30);
  doc.text('History:', 10, 40);
  message.historyLog.forEach((h, i) => {
    doc.text(`${h.role}: ${h.status} (${new Date(h.date).toLocaleString()})`, 10, 50 + i * 10);
  });
  doc.save('message.pdf');
}
