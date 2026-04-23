import { jsPDF } from 'jspdf';

export const useProgressGenerateSummaryPdfReport = () => {
  // Convert jsPDF to Blob
  const htmlToPdfBlob = (src: HTMLElement, width: number): Promise<Blob> => {
    const doc = new jsPDF('portrait', 'pt', 'a4');
    doc.setFont('Helvetica', 'normal', 'normal');
    doc.setFontSize(10);

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
    const filename = `ProgressSummary${filenameSuffix || ''}.pdf`;
    const file = new File([blob], filename, { type: 'application/pdf' });

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          title: 'Progress Summary Report',
          text: `Here is the progress summary PDF`,
          files: [file],
        });
        return; // Success
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Share failed, falling back to download', err);
        }
      }
    }

    downloadPdf(blob, filenameSuffix);
  };

  const downloadPdf = (blob: Blob, filenameSuffix?: string) => {
    const filename = `ProgressSummary${filenameSuffix || ''}.pdf`;
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    // Small delay helps Chrome on Mac properly register the download
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  };

  // Functionality without share question/option
  const captureHtml = (
    src: HTMLElement,
    width: number,
    filenameSuffix?: string
  ) => {
    const doc = new jsPDF('portrait', 'pt', 'a4');
    doc.setFont('Helvetica', 'normal', 'normal');
    doc.setFontSize(10);

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
