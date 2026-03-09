import { jsPDF } from 'jspdf';

export const useProgressGenerateSummaryPdfReport = () => {
  // Convert jsPDF to Blob
  const htmlToPdfBlob = (src: HTMLElement, width: number): Promise<Blob> => {
    const doc = new jsPDF('portrait', 'pt', 'a4');

    return new Promise((resolve, reject) => {
      doc.html(src, {
        callback: function (doc) {
          try {
            const blob = doc.output('blob');
            resolve(blob);
          } catch (err) {
            reject(err);
          }
        },
        x: 15,
        y: 15,
        width: 550,
        windowWidth: 750,
      });
    });
  };

  const generateReportAndReturnBlob = async (
    src: HTMLElement,
    width: number
  ) => {
    return await htmlToPdfBlob(src, width);
  };

  const sharePdfReport = async (blob: Blob, filenameSuffix?: string) => {
    const file = new File(
      [blob],
      `ProgressSummary${filenameSuffix || ''}.pdf`,
      { type: 'application/pdf' }
    );

    // Check if Web Share API is available at all
    if (navigator.share) {
      try {
        // Try sharing with file first
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Progress Summary',
            text: 'Here is the progress summary PDF.',
            files: [file],
          });
          console.log('Shared successfully');
        } else {
          // Fallback: download instead of sharing
          downloadPdf(blob, filenameSuffix);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Share cancelled by user');
        } else {
          console.error('Sharing failed', err);
          // Fallback to download
          downloadPdf(blob, filenameSuffix);
        }
      }
    } else {
      // No share API - download directly
      downloadPdf(blob, filenameSuffix);
    }
  };

  const downloadPdf = (blob: Blob, filenameSuffix?: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ProgressSummary${filenameSuffix || ''}.pdf`;
    document.body.appendChild(a); // Required for Firefox
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Functionality without share question/option
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

  const asyncGenerateReport = async (
    src: HTMLElement,
    width: number,
    filenameSuffix?: string
  ) => {
    await captureHtml(src, width, filenameSuffix);
  };

  return {
    generateReportAndReturnBlob,
    sharePdfReport,
    asyncGenerateReport,
  };
};
