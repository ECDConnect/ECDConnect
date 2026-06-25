import { jsPDF } from 'jspdf';

const TEXT_COLOR: [number, number, number] = [39, 56, 90];

/**
 * Generates an ECD Connect training course certificate as a PDF.
 */
export function generateEcdConnectCourseCertificate(
  logoBase64: string,
  signatureBase64: string,
  recipientName: string,
  courseName: string,
  completionDate: string,
  certificateId: string = 'Certificate ID'
): jsPDF {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const cx = pageW / 2;

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, pageH, 'F');

  const logoSize = 30;
  const logoX = cx - logoSize / 2;
  const logoY = 10;

  try {
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoSize, logoSize);
  } catch {
    // Logo image failed to load — non-fatal
  }

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...TEXT_COLOR);
  doc.text('This is to certify that', cx, 52, { align: 'center' });

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...TEXT_COLOR);
  doc.text(recipientName, cx, 68, { align: 'center' });

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...TEXT_COLOR);

  const completionLine = `has completed the "${courseName}" training course`;
  const completionLines = doc.splitTextToSize(completionLine, pageW - 40);
  doc.text(completionLines, cx, 82, { align: 'center' });

  const completionLineHeight = completionLines.length * 6;
  const issueDateY = 82 + completionLineHeight + 8;

  doc.text(`Date of issue: ${completionDate}`, cx, issueDateY, {
    align: 'center',
  });

  const sigW = 40;
  const sigH = 18;
  const sigX = cx - sigW / 2;
  const sigY = issueDateY + 12;

  try {
    doc.addImage(signatureBase64, 'PNG', sigX, sigY, sigW, sigH);
  } catch {
    // Signature image failed to load — non-fatal
  }

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.line(sigX - 5, sigY + sigH + 1, sigX + sigW + 5, sigY + sigH + 1);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_COLOR);
  doc.text('Peter Schutte', cx, sigY + sigH + 6, { align: 'center' });
  doc.text('Head of ECD Connect', cx, sigY + sigH + 11, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(...TEXT_COLOR);
  doc.text(`Certificate ID: ${certificateId}`, pageW - 10, pageH - 5, {
    align: 'right',
  });

  return doc;
}
