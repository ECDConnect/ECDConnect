import {
  Alert,
  Button,
  DialogPosition,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ResourceLink, LinksSharedProps } from './links-shared.types';
import { gql, useMutation, useQuery } from '@apollo/client';
import { LanguageId } from '../../../../constants/language';
import ContentLoader from '../../../../components/content-loader/content-loader';
import { NOTIFICATION, useDialog, useNotifications } from '@ecdlink/core';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';

export const LinksSharedResource = ({
  contentType,
  onClose: cancelEdit,
}: LinksSharedProps) => {
  const { setNotification } = useNotifications();
  const [resourcesLinks, setResourcesLinks] = useState<ResourceLink[]>([]);
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false);
  const dialog = useDialog();
  const urlRegex =
    /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
  const getAllCall = `GetAll${contentType.name}`;
  const fields =
    contentType.fields?.map((field) => {
      return field.fieldName;
    }) ?? [];

  const hint = contentType?.content?.[0]?.contentValues?.find(
    (item) => item?.contentTypeField?.fieldName === 'hint'
  )?.value;

  const query = gql` 
    query ${getAllCall} ($localeId: String) {
      ${getAllCall} (localeId: $localeId) {
        id
        ${fields.join('\n')}
        }
      }
  `;

  const createMutation = gql`
    mutation UpdateCaregiverResourceLink(
      $input: [CMSResourceLinkModelInput]
      $localeId: UUID!
    ) {
      updateCaregiverResourceLink(input: $input, localeId: $localeId)
    }
  `;

  const {
    data: linksData,
    loading: loadingLinks,
    refetch: refetchLinks,
  } = useQuery(query, {
    fetchPolicy: 'network-only',
    variables: {
      localeId: LanguageId.enZa,
    },
  });

  const [createContent, { loading }] = useMutation(createMutation);

  const linksQuantity = 5;
  const setInitialState = useCallback(() => {
    const connectLinks = new Array(linksQuantity).fill(0).map(() => ({
      title: '',
      link: '',
      description: '',
      contentTypeId: 38,
      contentId: -1,
    })) as ResourceLink[];

    const currentLinks = linksData?.[getAllCall] ?? [];

    connectLinks?.forEach((link, index) => {
      link.title = currentLinks?.[index]?.title ?? '';
      link.link = currentLinks?.[index]?.link ?? '';
      link.description = currentLinks?.[index]?.description ?? '';
      link.contentId = currentLinks?.[index]?.id ?? -1;
    });

    setResourcesLinks(connectLinks);
  }, [linksData, getAllCall]);

  const onChangeLink =
    (resourceIndex: number) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      const [fieldName, index] = name.split('_');
      const selectedResource = resourcesLinks?.[resourceIndex];
      const newResourceLinkData = [...resourcesLinks];

      if (fieldName === 'resourceTitle') {
        newResourceLinkData[index].title = value;
      } else if (fieldName === 'resourceLink') {
        newResourceLinkData[index].link = value;
      } else if (fieldName === 'resourceDescription') {
        newResourceLinkData[index].description = value;
      }
      newResourceLinkData[index].linkedConnect =
        selectedResource?.contentId ?? -1;
      setResourcesLinks(newResourceLinkData);
    };

  const onCheckLinkError = (
    isToCheck: boolean,
    index: number,
    fieldType: 'title' | 'link' | 'description'
  ) => {
    if (!isToCheck) return false;

    let hasEmptyField =
      !resourcesLinks[index]?.[fieldType] &&
      (index < 2 || !!resourcesLinks[index]?.[fieldType]);

    if (fieldType === 'link' && resourcesLinks[index].link !== '') {
      hasEmptyField = !urlRegex.test(resourcesLinks[index].link);
    }

    return hasEmptyField;
  };

  const onFormatPayload = () => {
    const payload = resourcesLinks
      ?.filter(
        (link) =>
          (link.title && link.link && link.description) || link.contentId !== -1
      )
      .map((link) => ({
        title: link.title,
        link: link.link,
        description: link.description,
        contentTypeId: link.contentTypeId,
        contentId: link.contentId,
      }));
    return payload;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    setIsSubmitButtonClicked(true);
    const hasEmptyField = resourcesLinks.some((link, index) =>
      index < 2
        ? !link.title ||
          !link.link ||
          !link.description ||
          !urlRegex.test(link.link)
        : link.link && !urlRegex.test(link.link)
    );
    if (hasEmptyField) return;

    await createContent({
      variables: {
        input: onFormatPayload(),
        localeId: LanguageId.enZa,
      },
    }).then(() => {
      setNotification({
        title: ` Successfully changed!`,
        variant: NOTIFICATION.SUCCESS,
      });
      refetchLinks();
    });
  };

  const errorLinkMessage = (index) => {
    var connectItem = resourcesLinks[index];

    if (index < 2) {
      if (connectItem.link === '') {
        return 'This field is required.';
      } else if (!urlRegex.test(connectItem.link)) {
        return 'Please add a valid link.';
      }
    } else {
      if (connectItem.link === '') {
        return 'You must add a link for the resource';
      } else if (!urlRegex.test(connectItem.link)) {
        return 'Please add a valid link.';
      }
    }
    return '';
  };

  const onCancel = async () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title="Discard unsaved changes?"
          btnText={['Discard changes', 'Keep editing']}
          message={` If you leave now, you will lose all of your changes.`}
          onCancel={onClose}
          onSubmit={() => {
            cancelEdit();
            onClose();
          }}
        />
      ),
    });
  };

  useEffect(() => {
    setInitialState();
  }, [setInitialState]);

  if (loadingLinks) return <ContentLoader />;

  return (
    <form onSubmit={onSubmit}>
      <div className="flex justify-between">
        <div>
          <Typography
            type="h1"
            color="textDark"
            text="Child progress report links for caregivers"
          />
          <Typography
            type="h3"
            color="textDark"
            text="These links will be added to the child progress report PDF"
          />
        </div>
        <Button
          type="filled"
          text="Cancel"
          onClick={onCancel}
          className="rounded-xl px-2"
          color="errorBg"
          textColor="tertiary"
          icon="XIcon"
          iconPosition="end"
        />
      </div>
      <Alert
        className={'mt-5 mb-3'}
        message={
          'Some practitioners might print out the progress report for caregivers, so make sure that the links are easy for caregivers to type on their phones.'
        }
        type={'info'}
      />
      <Typography type="h4" color="textMid" text={hint} className="mb-11" />
      {new Array(linksQuantity).fill(0).map((_, linkIndex) => (
        <div key={linkIndex} className="bg mb-11">
          <Typography
            type="h2"
            color="textDark"
            text={`Resource link ${linkIndex + 1}`}
          />
          <Typography
            type="help"
            color="textMid"
            text={linkIndex < 2 ? `You must add at least 2 links` : `Optional`}
            className="mb-5"
          />
          <FormInput
            name={`resourceTitle_` + linkIndex}
            label={linkIndex < 2 ? `Title *` : `Title`}
            placeholder="Add a title..."
            subLabel="Must be no more than 30 characters."
            className="mb-4"
            maxCharacters={30}
            maxLength={30}
            value={resourcesLinks[linkIndex]?.title}
            onChange={onChangeLink(linkIndex)}
            {...(onCheckLinkError(
              isSubmitButtonClicked,
              linkIndex,
              'title'
            ) && {
              error: {
                type: 'required',
                message: linkIndex < 2 ? 'This field is required.' : '',
              },
            })}
          />
          <FormInput
            name={`resourceLink_` + linkIndex}
            label={linkIndex < 2 ? `Link *` : `Link`}
            placeholder="Add a link..."
            subLabel="Must be no more than 60 characters."
            className="mb-4"
            maxCharacters={60}
            maxLength={60}
            value={resourcesLinks[linkIndex]?.link}
            onChange={onChangeLink(linkIndex)}
            {...(onCheckLinkError(isSubmitButtonClicked, linkIndex, 'link') && {
              error: {
                type: 'required',
                message: errorLinkMessage(linkIndex),
              },
            })}
          />
          <FormInput
            name={`resourceDescription_` + linkIndex}
            label={linkIndex < 2 ? `Short description *` : `Short description`}
            placeholder="Add a short description..."
            subLabel="Must be no more than 60 characters."
            className="mb-4"
            maxCharacters={60}
            maxLength={60}
            value={resourcesLinks[linkIndex]?.description}
            onChange={onChangeLink(linkIndex)}
            {...(onCheckLinkError(
              isSubmitButtonClicked,
              linkIndex,
              'description'
            ) && {
              error: {
                type: 'required',
                message: linkIndex < 2 ? 'This field is required.' : '',
              },
            })}
          />
        </div>
      ))}
      <Button
        disabled={loading}
        isLoading={loading}
        buttonType="submit"
        type="filled"
        color="secondary"
        textColor="white"
        text="Save & publish"
        icon="SaveIcon"
        className="w-full rounded-2xl py-2 px-20 hover:opacity-80 md:w-auto"
      />
    </form>
  );
};
