import { useLazyQuery, useMutation } from '@apollo/client';
import {
  CoachesTemplate,
  PractitionersTemplate,
  UploadCoaches,
  UploadPractitioners,
  ValidatePractitionerImportSheet,
} from '@ecdlink/graphql';
import { useForm, useWatch } from 'react-hook-form';
import FormFileInput from '../../../../../admin-portal/src/app/components/form-file-input/form-file-input';
import { useCallback, useEffect, useState } from 'react';
import { b64toBlob, useNotifications, NOTIFICATION } from '@ecdlink/core';
import {
  ArrowLeftIcon,
  DownloadIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/solid';
import { useHistory } from 'react-router';
import { Alert, Button, LoadingSpinner, Typography } from '@ecdlink/ui';
import { useTenant } from '../../hooks/useTenant';
import { pluralize } from '../pages.utils';
import ROUTES from '../../routes/app.routes-constants';

const acceptedFormats = ['xls', 'xlsx'];
const allowedFileSize = 13631488;

export default function UploadBulkUser(props: any) {
  const tenant = useTenant();
  const { setValue, handleSubmit, getValues, control } = useForm();
  const { templateFile } = useWatch({ control });
  const history = useHistory();
  const { setNotification } = useNotifications();
  // props.location.state?.component === 'practitioners'
  const [templateDownloaded, setTemplateDownloaded] = useState<boolean>(false);
  const [docErrors, setDocErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCheckFile, setisLoadingCheckFile] = useState(false);

  const [getCoachesExcelTemplateGenerator, { data: coachesTemplateData }] =
    useLazyQuery(CoachesTemplate, {
      fetchPolicy: 'cache-and-network',
    });
  const [disableAddButton, setDisableAddButton] = useState(true);
  const [userReadyToBeUpload, setUsersReadyToBeUpload] = useState(false);

  const [
    getPractitionerExcelTemplateGenerator,
    { data: practitionersTemplateData },
  ] = useLazyQuery(PractitionersTemplate, {
    fetchPolicy: 'cache-and-network',
  });

  const [
    validatePractitionerImportSheet,
    { data: validatePractitionerImportSheetData },
  ] = useLazyQuery(ValidatePractitionerImportSheet, {
    fetchPolicy: 'cache-and-network',
  });

  const [importPractitioners] = useMutation(UploadPractitioners);
  const [importCoaches, loading] = useMutation(UploadCoaches);

  const onSubmit = async (values: any) => {
    const model = { ...values };

    if (model.templateFile?.file) {
      if (props.location.state?.component === 'practitioners') {
        setIsLoading(true);
        await importPractitioners({
          variables: {
            file: model.templateFile?.file,
          },
        }).then((res) => {
          if (res.data?.importPractitioners.validationErrors.length !== 0) {
            setDocErrors(res.data?.importPractitioners.validationErrors);
            const errors =
              res.data?.importPractitioners?.validationErrors?.errors;
            if (errors?.length) {
              setNotification({
                title: `${errors[0]}`,
                variant: NOTIFICATION.ERROR,
              });
            }
          } else {
            setNotification({
              title: `Successfully Uploaded ${
                res.data?.importPractitioners?.createdUsers?.length ?? 0
              } practitioners!`,
              variant: NOTIFICATION.SUCCESS,
            });
            history.push(ROUTES.USERS.PRACTITIONERS);
          }

          setIsLoading(false);
        });
      } else {
        setIsLoading(true);
        await importCoaches({
          variables: {
            file: model.templateFile?.file,
          },
        })
          .then((res) => {
            if (res?.data?.importCoaches?.validationErrors?.length > 0) {
              const errorList = res.data.importCoaches.validationErrors;

              setNotification({
                title: `Please see error details below. (${errorList.length} errors)`,
                variant: NOTIFICATION.ERROR,
              });
              setDocErrors(errorList);
              setIsLoading(false);
            } else {
              setNotification({
                title:
                  `Successfully Uploaded ${
                    res.data?.importCoaches?.createdUsers?.length ?? 0
                  } ` + pluralize(tenant.modules.coachRoleName),
                variant: NOTIFICATION.SUCCESS,
              });
              setIsLoading(false);
              history.push(ROUTES.USERS.COACHES);
            }
          })
          .finally(() => setIsLoading(false));
      }
    }
  };

  // Practitioners
  useEffect(() => {
    if (
      practitionersTemplateData &&
      practitionersTemplateData.practitionerTemplateGenerator &&
      !templateDownloaded &&
      props.location.state?.component === 'practitioners'
    ) {
      const b64Data =
        practitionersTemplateData.practitionerTemplateGenerator.base64File;
      const contentType =
        practitionersTemplateData.practitionerTemplateGenerator.fileType;
      const fileName =
        practitionersTemplateData.practitionerTemplateGenerator.fileName;
      const extension =
        practitionersTemplateData.practitionerTemplateGenerator.extension;
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
  }, [
    practitionersTemplateData,
    props.location.state?.component,
    templateDownloaded,
  ]);

  // Coaches
  useEffect(() => {
    if (
      coachesTemplateData &&
      coachesTemplateData.coachTemplateGenerator &&
      !templateDownloaded
    ) {
      const b64Data = coachesTemplateData.coachTemplateGenerator.base64File;
      const contentType = coachesTemplateData.coachTemplateGenerator.fileType;
      const fileName = coachesTemplateData.coachTemplateGenerator.fileName;
      const extension = coachesTemplateData.coachTemplateGenerator.extension;
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
  }, [coachesTemplateData, templateDownloaded]);

  const downloadContentTypeTemplate = async () => {
    setTemplateDownloaded(false);
    if (props.location.state?.component === 'practitioners') {
      await getPractitionerExcelTemplateGenerator();
    } else {
      await getCoachesExcelTemplateGenerator();
    }
  };

  const handleCheckFile = useCallback(async () => {
    setisLoadingCheckFile(true);
    const model = { ...getValues() };
    const isValidFile = await validatePractitionerImportSheet({
      variables: {
        file: model.templateFile?.file,
      },
    }).then((res) => {
      if (
        res.data?.validatePractitionerImportSheet?.validationErrors.length !== 0
      ) {
        setDocErrors(
          res.data?.validatePractitionerImportSheet?.validationErrors
        );
        const errors =
          res.data?.validatePractitionerImportSheet?.validationErrors;
        if (errors?.length === 0) {
          setDisableAddButton(false);
        }
      } else {
        setDisableAddButton(false);
        setUsersReadyToBeUpload(true);
        setNotification({
          title: `Check file passed!`,
          variant: NOTIFICATION.SUCCESS,
        });
      }
    });
    setisLoadingCheckFile(false);
  }, [getValues, setNotification, validatePractitionerImportSheet]);

  return (
    <div className="bg-adminPortalBg h-screen rounded-2xl p-4 ">
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
            {props.location.state?.component === 'practitioners'
              ? 'Practitioners'
              : pluralize(tenant.modules.coachRoleName)}{' '}
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
          <div className="w-full rounded-md ">
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <div className="mb-8 rounded-xl bg-white px-16 pt-16 pb-12">
                <div className="mb-2 sm:col-span-12">
                  <FormFileInput
                    acceptedFormats={acceptedFormats}
                    label={'Template Upload'}
                    nameProp={'templateFile'}
                    returnFullUrl={false}
                    setValue={setValue}
                    isImage={false}
                    allowedFileSize={allowedFileSize}
                    isWizardComponent={true}
                    onFileChange={() => {
                      setDocErrors([]);
                      setDisableAddButton(true);
                      setUsersReadyToBeUpload(false);
                    }}
                    isFileInput={true}
                  />
                </div>
                {isLoadingCheckFile && (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner
                      size="small"
                      className="mt-4"
                      spinnerColor="secondary"
                      backgroundColor="uiBg"
                    />
                    <Typography
                      type={'help'}
                      hasMarkup
                      text={'Checking upload...'}
                      className={'mt-4'}
                      color={'infoMain'}
                    />
                  </div>
                )}
                {!isLoadingCheckFile && (
                  <Button
                    type="outlined"
                    color="secondary"
                    isLoading={isLoadingCheckFile}
                    disabled={isLoadingCheckFile || !templateFile}
                    onClick={handleCheckFile}
                    text="Check file"
                    textColor="secondary"
                    className="my-4 rounded-2xl px-28"
                    icon="DocumentSearchIcon"
                  ></Button>
                )}
                {docErrors?.length > 0 ? (
                  <div>
                    <Typography
                      type={'body'}
                      hasMarkup
                      text={
                        'Try downloading the template again and follow the instructions.'
                      }
                      className={'mt-5'}
                      color={'textMid'}
                    />
                    <Alert
                      className="mt-2 mb-3 rounded-md"
                      title={`${docErrors?.length} issues with your upload:`}
                      type="error"
                      list={docErrors.map(
                        (error) =>
                          `Row ${error.row}: ${error?.errorDescription} ${
                            error?.errors[0] ? ':' + error?.errors[0] : ''
                          }`
                      )}
                      listColor="textDark"
                    />
                  </div>
                ) : null}
                {userReadyToBeUpload && (
                  <div className="flex flex-col gap-4">
                    <Alert
                      className="mt-2 rounded-md"
                      title={`Users ready for upload`}
                      type="success"
                    />
                    <Alert
                      className="rounded-md"
                      title={`An invitation will be sent to all new users when you click add.`}
                      type="info"
                    />
                  </div>
                )}
              </div>
              <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-2 flex-shrink-0">
                  <Button
                    type="filled"
                    color="secondary"
                    className="bg-secondary hover:bg-uiMid focus:outline-none mb-16 inline-flex items-center rounded-md rounded-2xl border border-transparent px-4 py-2.5 px-16 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                    isLoading={isLoading}
                    disabled={isLoading || disableAddButton}
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
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
