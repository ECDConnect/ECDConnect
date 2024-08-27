import { jsPDF } from 'jspdf';

export const useProgressGenerateSummaryPdfReport = () => {
  const generateReport = (src: HTMLElement, width: number) => {
    const doc = new jsPDF('portrait');

    doc.html(src, {
      callback: function (doc) {
        // Save the PDF
        doc.save('ProgressSummary.pdf');
      },
      x: 15,
      y: 15,

      width: 170, //target width in the PDF document
      windowWidth: width, //window width in CSS pixels
    });
  };
  return { generateReport };
};
