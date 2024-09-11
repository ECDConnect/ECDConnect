import { jsPDF } from 'jspdf';

export const useProgressGenerateSummaryPdfReport = () => {
  const generateReport = (src: HTMLElement, width: number) => {
    const doc = new jsPDF('portrait', 'pt', 'a4');

    doc.html(src, {
      callback: function (doc) {
        // Save the PDF
        doc.save('ProgressSummary.pdf');
      },
      x: 15,
      y: 15,
      width: 550, //target width in the PDF document
      windowWidth: 750, //window width in CSS pixels
    });
  };
  return { generateReport };
};
