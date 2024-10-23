import { jsPDF } from 'jspdf';

export const useProgressGenerateSummaryPdfReport = () => {
  // Generic function to generate a PDF from an HTML element so it's reusable
  const captureHtml = (
    src: HTMLElement,
    width: number,
    filenameSuffix?: string
  ) => {
    const doc = new jsPDF('portrait', 'pt', 'a4');

    return doc.html(src, {
      callback: function (doc) {
        // Save the PDF
        doc.save(`ProgressSummary${filenameSuffix || ''}.pdf`);
      },
      x: 15,
      y: 15,
      width: 550, //target width in the PDF document
      windowWidth: 750, //window width in CSS pixels
    });
  };

  const generateReport = (
    src: HTMLElement,
    width: number,
    filenameSuffix?: string
  ) => {
    captureHtml(src, width, filenameSuffix);
  };

  const asyncGenerateReport = async (
    src: HTMLElement,
    width: number,
    filenameSuffix?: string
  ) => {
    await captureHtml(src, width, filenameSuffix);
  };
  return { generateReport, asyncGenerateReport };
};
