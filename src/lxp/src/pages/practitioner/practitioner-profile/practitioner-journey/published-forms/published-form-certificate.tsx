import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { saveHealthCertificateDetails } from '@/store/pqa/pqa.actions';
import {
  getSmartStartCourseConfig,
  isEcdConnectCourse,
  isSupportedCourseCertificate,
} from '@/utils/certificate/certificate.constants';
import {
  formatCertificateDate,
  generateCertificateId,
  sanitizeCertificateFileName,
  urlToBase64,
} from '@/utils/certificate/certificate.utils';
import { generateEcdConnectCourseCertificate } from '@/utils/certificate/generateEcdConnectCourseCertificate';
import { generateHealthSafetyCertificate } from '@/utils/certificate/generateHealthAndSafetyCertificate';
import { generateSmartStartCourseCertificate } from '@/utils/certificate/generateSmartStartCourseCertificate';
import { BannerWrapper, Button, FormInput, Typography } from '@ecdlink/ui';
import { useState } from 'react';
import signatureFile from '@/assets/certificates/signatureFile.png';
import logoFile from '@/assets/certificates/logoFile.png';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';

export type PublishedFormCertificateProps = {
  completedVisitId?: string;
  certificateName?: string;
  visitCompletedDate?: string;
  certificateRegNr?: string;
  courseName?: string;
  courseCompletedDate?: string;
  onBack: (value: boolean) => void;
};

export const PublishedFormCertificate: React.FC<
  PublishedFormCertificateProps
> = ({
  completedVisitId,
  certificateName,
  visitCompletedDate,
  certificateRegNr,
  courseName,
  courseCompletedDate,
  onBack,
}) => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const smartStartCourseConfig = courseName
    ? getSmartStartCourseConfig(courseName)
    : undefined;
  const isEcdConnectCourseCertificate = Boolean(
    courseName && isEcdConnectCourse(courseName)
  );
  const isSmartStartCourseCertificate = Boolean(smartStartCourseConfig);

  const [pdfFieldName, setPdfFieldName] = useState(
    certificateName || `${practitioner?.user?.firstName}`
  );

  const saveAndDownload = async () => {
    if (isSmartStartCourseCertificate) {
      await downloadSmartStartCourseCertificate();
      return;
    }

    if (isEcdConnectCourseCertificate) {
      await downloadEcdConnectCourseCertificate();
      return;
    }

    const certificateId = generateCertificateId('HSC', certificateRegNr);
    const { long: visitDateLong, short: visitDateShort } =
      formatCertificateDate(visitCompletedDate);

    await appDispatch(
      saveHealthCertificateDetails({
        visitId: completedVisitId!,
        certificateName: pdfFieldName,
        certificateRegNr: certificateId,
      })
    )
      .unwrap()
      .then(() => {
        downloadHealthSafetyCertificate(
          certificateId,
          visitDateLong,
          visitDateShort
        );
      })
      .catch((error) => {
        console.error('Failed to save certificate name:', error);
      });
  };

  const downloadSmartStartCourseCertificate = async () => {
    const { long: completionDateLong, short: completionDateShort } =
      formatCertificateDate(courseCompletedDate);

    const pdf = await generateSmartStartCourseCertificate(
      smartStartCourseConfig!.templateImage,
      pdfFieldName,
      practitioner?.user?.idNumber || '',
      completionDateLong,
      smartStartCourseConfig!.color,
      smartStartCourseConfig!.fieldPositions
    );

    pdf.save(
      `SmartStart_Course_${sanitizeCertificateFileName(
        courseName!
      )}_${sanitizeCertificateFileName(
        pdfFieldName
      )}_${completionDateShort}.pdf`
    );
    onBack(false);
  };

  const downloadEcdConnectCourseCertificate = async () => {
    const certificateId = generateCertificateId('T', certificateRegNr);
    const { long: completionDateLong, short: completionDateShort } =
      formatCertificateDate(courseCompletedDate);
    const logoB64 = await urlToBase64(logoFile);
    const sigB64 = await urlToBase64(signatureFile);

    const pdf = generateEcdConnectCourseCertificate(
      logoB64,
      sigB64,
      pdfFieldName,
      courseName!,
      completionDateLong,
      certificateId
    );

    pdf.save(
      `ECDConnect_Course_${sanitizeCertificateFileName(
        courseName!
      )}_${sanitizeCertificateFileName(
        pdfFieldName
      )}_${completionDateShort}.pdf`
    );
    onBack(false);
  };

  const downloadHealthSafetyCertificate = async (
    certificateId: string,
    visitDateLong: string,
    visitDateShort: string
  ) => {
    const logoB64 = await urlToBase64(logoFile);
    const sigB64 = await urlToBase64(signatureFile);

    const pdf = generateHealthSafetyCertificate(
      logoB64,
      sigB64,
      pdfFieldName,
      visitDateLong,
      certificateId
    );

    pdf.save(
      `ECDConnect_HealthSafetyCheck_${pdfFieldName}_${visitDateShort}.pdf`
    );
    onBack(false);
  };

  return (
    <BannerWrapper
      size="normal"
      title="Check certificate details"
      renderBorder={true}
      showBackground={false}
      displayOffline={!isOnline}
      renderOverflow
      onClose={() => onBack(false)}
      onBack={() => onBack(false)}
    >
      <div className="mt-4 px-4">
        <Typography
          color={'textDark'}
          className=""
          type="h2"
          text={`Check certificate details`}
        />
        <Typography
          className="mb-2"
          type="body"
          color="textMid"
          text={`This is how your name will appear on your certifcate.`}
        />

        <FormInput
          className="mb-4 w-full"
          label={`Name`}
          placeholder={''}
          type={'text'}
          maxCharacters={40}
          maxLength={40}
          onChange={(event) => setPdfFieldName(event.target.value)}
          value={pdfFieldName}
        />

        <div className="mt-auto">
          <Button
            onClick={saveAndDownload}
            disabled={
              pdfFieldName === '' ||
              (Boolean(courseName) &&
                !isSupportedCourseCertificate(courseName!))
            }
            className="mt-auto w-full"
            size="normal"
            color="quatenary"
            type="filled"
            icon="DownloadIcon"
            text="Save & download"
            textColor="white"
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
