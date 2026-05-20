import { jsPDF } from 'jspdf';

/**
 * Generates the ECD Connect Health & Safety Check Certificate of Completion as a PDF.
 *
 * @param logoBase64      - Base64 string of the ECD Connect logo (PNG/JPEG, with or without data URI prefix)
 * @param signatureBase64 - Base64 string of the signature image (PNG/JPEG, with or without data URI prefix)
 * @param recipientName   - Full name of the certificate recipient
 * @param completionDate  - Completion date string, e.g. "24 April 2026"
 * @param certificateId   - Certificate ID string, e.g. "ECDC-HSC-2026-00001"
 * @returns jsPDF instance (call .save('filename.pdf') or .output('blob') on it)
 */
export function generateHealthSafetyCertificate(
  logoBase64: string,
  signatureBase64: string,
  recipientName: string = 'Bulelwa Mahlangu',
  completionDate: string = '24 April 2026',
  certificateId: string = 'ECDC-HSC-2026-00001'
): jsPDF {
  // A4 landscape: 297 × 210 mm — portrait here to match the certificate
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth(); // 297
  const pageH = doc.internal.pageSize.getHeight(); // 210
  const cx = pageW / 2; // horizontal centre

  // ─── Background ────────────────────────────────────────────────────────────
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, pageH, 'F');

  // ─── Logo ──────────────────────────────────────────────────────────────────
  const logoSize = 28; // diameter of the logo image
  const logoX = cx - logoSize / 2;
  const logoY = 10;

  try {
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoSize, logoSize);
  } catch {
    // Logo image failed to load — this is non-fatal, so we just skip it
  }

  // ─── Title ─────────────────────────────────────────────────────────────────
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(22);
  doc.setTextColor(52, 73, 110); // steel-blue matching the certificate
  doc.text('Certificate of Completion', cx, 52, { align: 'center' });

  doc.setFontSize(22);
  doc.text('Health & Safety Check', cx, 62, { align: 'center' });

  // ─── "This certificate is awarded to" ────────────────────────────────────
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text('This certificate is awarded to', cx, 78, { align: 'center' });

  // ─── Recipient name ────────────────────────────────────────────────────────
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(28);
  doc.setTextColor(52, 73, 110);
  doc.text(recipientName, cx, 94, { align: 'center' });

  // Thin decorative line under name
  doc.setDrawColor(200, 210, 230);
  doc.setLineWidth(0.3);
  doc.line(cx - 60, 98, cx + 60, 98);

  // ─── Body text ─────────────────────────────────────────────────────────────
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);

  const bodyLines = [
    `for completing the ECD Connect Health & Safety Check on ${completionDate},`,
    'taking the time to review safety considerations across their early learning',
    'programme and reflect on areas for ongoing improvement.',
  ];

  let bodyY = 110;
  for (const line of bodyLines) {
    doc.text(line, cx, bodyY, { align: 'center' });
    bodyY += 6;
  }

  // ─── Signature ─────────────────────────────────────────────────────────────
  const sigW = 40;
  const sigH = 18;
  const sigX = cx - sigW / 2;
  const sigY = 130;

  try {
    doc.addImage(signatureBase64, 'PNG', sigX, sigY, sigW, sigH);
  } catch {
    // Signature image failed to load — this is non-fatal, so we just skip it
  }

  // Signature underline
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.line(sigX - 5, sigY + sigH + 1, sigX + sigW + 5, sigY + sigH + 1);

  // Signatory name & title
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text('Peter Schutte', cx, sigY + sigH + 6, { align: 'center' });
  doc.text('Head of ECD Connect', cx, sigY + sigH + 11, { align: 'center' });

  // ─── Footer disclaimer ─────────────────────────────────────────────────────
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text(
    'This certificate reflects a self-assessment completed by the practitioner using ECD Connect. It is not an inspection, audit, or formal accreditation.',
    cx,
    pageH - 10,
    { align: 'center', maxWidth: pageW - 30 }
  );

  // ─── Certificate ID (bottom-right) ─────────────────────────────────────────
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text(`Certificate ID: ${certificateId}`, pageW - 10, pageH - 5, {
    align: 'right',
  });

  return doc;
}
