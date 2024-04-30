import { useLazyQuery, useMutation } from '@apollo/client';
import {
  HealthCareWorkerTemplate,
  TeamLeadsTemplate,
  UploadHealthCareWorkers,
  UploadTeamLeads,
  importAll,
} from '@ecdlink/graphql';
import { useForm } from 'react-hook-form';
import FormFileInput from '../../../../../admin-portal/src/app/components/form-file-input/form-file-input';
import { useEffect, useState } from 'react';
import { b64toBlob, useNotifications, NOTIFICATION } from '@ecdlink/core';
import {
  ArrowLeftIcon,
  DownloadIcon,
  LockClosedIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/solid';
import { useHistory } from 'react-router';
import { Alert, Button } from '@ecdlink/ui';

const acceptedFormats = ['xls', 'xlsx'];
const allowedFileSize = 13631488;

export default function UploadBulkUser(props: any) {
  const { setValue, handleSubmit } = useForm();
  const history = useHistory();
  const { setNotification } = useNotifications();
  // props.location.state?.component === 'team-leads'
  const [templateDownloaded, setTemplateDownloaded] = useState<boolean>(false);
  const [docErrors, setDocErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [getExcelTemplateGenerator, { data: templateData }] = useLazyQuery(
    HealthCareWorkerTemplate,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const [getTeamLeadsExcelTemplateGenerator, { data: teamLeadsTemplateData }] =
    useLazyQuery(TeamLeadsTemplate, {
      fetchPolicy: 'cache-and-network',
    });

  const [importTeamLeads] = useMutation(UploadTeamLeads);
  const [importPractitioners, loading] = useMutation(UploadHealthCareWorkers);

  const onSubmit = async (values: any) => {
    const model = { ...values };

    if (model.templateFile?.file) {
      if (props.location.state?.component === 'team-leads') {
        setIsLoading(true);
        await importTeamLeads({
          variables: {
            file: model.templateFile?.file,
          },
        }).then((res) => {
          if (res.data?.importTeamLeads.validationErrors.length !== 0) {
            setDocErrors(res.data?.importTeamLeads.validationErrors);
            const errors = res.data?.importTeamLeads?.validationErrors?.errors;
            if (errors?.length) {
              setNotification({
                title: `${errors[0]}`,
                variant: NOTIFICATION.ERROR,
              });
            }
          } else {
            setNotification({
              title: `Successfully Uploaded ${
                res.data?.importTeamLeads?.createdUsers?.length ?? 0
              } team leads!`,
              variant: NOTIFICATION.SUCCESS,
            });
          }

          setIsLoading(false);
        });
      } else {
        // if is not team leads, upload to chw
        setIsLoading(true);
        await importPractitioners({
          variables: {
            file: model.templateFile?.file,
          },
        })
          .then((res) => {
            if (
              res?.data?.importHealthCareWorkers?.validationErrors?.length > 0
            ) {
              const errorList =
                res.data.importHealthCareWorkers.validationErrors;

              setNotification({
                title: `Please see error details below. (${errorList.length} errors)`,
                variant: NOTIFICATION.ERROR,
              });
              setDocErrors(errorList);
              setIsLoading(false);
            } else {
              setNotification({
                title: `Successfully Uploaded ${
                  res.data?.importHealthCareWorkers?.createdUsers?.length ?? 0
                } CHWs!`,
                variant: NOTIFICATION.SUCCESS,
              });
              setIsLoading(false);
            }
          })
          .finally(() => setIsLoading(false));
      }
    }
  };

  useEffect(() => {
    if (
      teamLeadsTemplateData &&
      teamLeadsTemplateData.teamLeadTemplateGenerator &&
      !templateDownloaded &&
      props.location.state?.component === 'team-leads'
    ) {
      const b64Data =
        teamLeadsTemplateData.teamLeadTemplateGenerator.base64File;
      const contentType =
        teamLeadsTemplateData.teamLeadTemplateGenerator.fileType;
      const fileName = teamLeadsTemplateData.teamLeadTemplateGenerator.fileName;
      const extension =
        teamLeadsTemplateData.teamLeadTemplateGenerator.extension;
      const blob = b64toBlob(b64Data, contentType);

      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}${extension}`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTemplateDownloaded(true);
    }
  }, [teamLeadsTemplateData, templateDownloaded]);

  useEffect(() => {
    if (
      templateData &&
      templateData.healthCareWorkerTemplateGenerator &&
      !templateDownloaded
    ) {
      const b64Data = templateData.healthCareWorkerTemplateGenerator.base64File;
      const contentType =
        templateData.healthCareWorkerTemplateGenerator.fileType;
      const fileName = templateData.healthCareWorkerTemplateGenerator.fileName;
      const extension =
        templateData.healthCareWorkerTemplateGenerator.extension;
      const blob = b64toBlob(b64Data, contentType);

      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}${extension}`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTemplateDownloaded(true);
    }
  }, [templateData, templateDownloaded]);

  const downloadContentTypeTemplate = async () => {
    setTemplateDownloaded(false);
    if (props.location.state?.component === 'team-leads') {
      await getTeamLeadsExcelTemplateGenerator();
    } else {
      await getExcelTemplateGenerator();
    }
  };

  return (
    <div className="bg-adminPortalBg h-full rounded-2xl p-4 ">
      <div className="flex flex-col">
        <div className="justify-self col-end-3 ">
          <button
            onClick={() => history.goBack()}
            type="button"
            className="cursor text-secondary outline-none text-14 inline-flex w-full items-center border border-transparent px-4 py-2 font-medium "
          >
            <ArrowLeftIcon className="text-secondary mr-1 h-4 w-4">
              {' '}
            </ArrowLeftIcon>
            Back
            {/* <span className="text-black pl-2"> / View User</span> */}
          </button>
        </div>
        <div className="flex flex-col pt-10">
          <h1 className="text-xl">
            Step 1: Download the{' '}
            {props.location.state?.component === 'team-leads'
              ? 'Team Leads'
              : 'CHWs'}{' '}
            template
          </h1>

          <p className="text-normal">
            Download the Excel template below and make sure all required fields
            are included. It includes instructions for each field. To avoid
            upload errors, do not modify the headers.
          </p>
          <div className="w-4/12 pt-4">
            <button
              onClick={() => {
                downloadContentTypeTemplate();
              }}
              type="submit"
              className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
            >
              <DownloadIcon className="mr-4 h-5 w-5"> </DownloadIcon>
              Download the template
            </button>
          </div>
        </div>

        <div className="my-12">
          <h1 className="text-xl">Step 2: Upload excel file</h1>
        </div>

        <div className="flex flex-row">
          <div className="w-6/12 rounded-md bg-white p-16">
            <form onSubmit={handleSubmit(onSubmit)} className=" ">
              <div className="pt-4 pb-8">
                <div className="sm:col-span-12">
                  <FormFileInput
                    acceptedFormats={acceptedFormats}
                    label={'Template Upload'}
                    nameProp={'templateFile'}
                    returnFullUrl={false}
                    setValue={setValue}
                    isImage={false}
                    allowedFileSize={allowedFileSize}
                  />
                </div>
              </div>
              <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-2 flex-shrink-0">
                  <Button
                    type="filled"
                    color="secondary"
                    className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                    isLoading={isLoading}
                    disabled={isLoading}
                    onClick={handleSubmit(onSubmit)}
                  >
                    <PaperAirplaneIcon className=" mr-1 h-4 w-4">
                      {' '}
                    </PaperAirplaneIcon>
                    Add & invite users
                  </Button>
                </div>
              </div>
            </form>

            {docErrors.length > 0 ? (
              <Alert
                className="mt-5 mb-3 rounded-md"
                message={`Error`}
                type="error"
                list={docErrors.map(
                  (error) =>
                    'Row ' +
                    error?.row +
                    ':' +
                    '</br>' +
                    (error.errors?.length ? error.errors.join('</br>') : '')
                )}
                listColor="errorMain"
              />
            ) : null}
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
