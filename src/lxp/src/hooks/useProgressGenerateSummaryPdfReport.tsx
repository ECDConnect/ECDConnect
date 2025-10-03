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

  const generateReportAndShare = async (
    src: HTMLElement,
    width: number,
    filenameSuffix?: string
  ) => {
    const blob = await htmlToPdfBlob(src, width);

    const file = new File(
      [blob],
      `ProgressSummary${filenameSuffix || ''}.pdf`,
      {
        type: 'application/pdf',
      }
    );

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Progress Summary',
          text: 'Here is the progress summary PDF.',
          files: [file],
        });
        console.log('Shared successfully');
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      // Fallback: Download the PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ProgressSummary${filenameSuffix || ''}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
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
    generateReportAndShare,
    asyncGenerateReport,
  };
};
