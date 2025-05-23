import { Button, DialogPosition, FormInput, Typography } from '@ecdlink/ui';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ConnectItem, LinksSharedProps } from './links-shared.types';
import { gql, useMutation, useQuery } from '@apollo/client';
import { LanguageId } from '../../../../constants/language';
import ContentLoader from '../../../../components/content-loader/content-loader';
import { useDialog } from '@ecdlink/core';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';

export const LinksShared = ({
  contentType,
  onClose: cancelEdit,
}: LinksSharedProps) => {
  const [connectItems, setResourcesLinks] = useState<ConnectItem[]>([]);
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false);
  const dialog = useDialog();
  const urlRegex =
    /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;

  const getAllCall = `GetAll${contentType.name}`;

  const query = gql` 
    query ${getAllCall} ($localeId: String) {
      ${getAllCall} (localeId: $localeId) {
        id
        link
        buttonText
        __typename
        }
      }
  `;

  const createMutation = gql`
    mutation UpdateResourceConnectItem(
      $input: [CMSConnectItemModelInput]
      $localeId: UUID!
    ) {
      updateResourceConnectItem(input: $input, localeId: $localeId)
    }
  `;

  const {
    data: linksData,
    loading: loadingLinks,
    refetch,
  } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: LanguageId.enZa,
    },
  });

  const [createContent, { loading }] = useMutation(createMutation);

  const connectQuantitiy = 10;
  const setInitialState = useCallback(() => {
    const connectLinks = new Array(connectQuantitiy).fill(0).map(() => ({
      text: '',
      link: '',
      contentTypeId: 28,
      contentId: -1,
      linkedConnect: 0,
    })) as ConnectItem[];

    const currentLinks = linksData?.[getAllCall] ?? [];

    connectLinks?.forEach((link, index) => {
      link.text = currentLinks?.[index]?.buttonText ?? '';
      link.link = currentLinks?.[index]?.link ?? '';
      link.contentId = currentLinks?.[index]?.id ?? -1;
    });

    setResourcesLinks(connectLinks);
  }, [linksData, getAllCall]);

  const onChangeLink =
    (resourceIndex: number) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      const [fieldName, index] = name.split('_');
      const selectedResource = connectItems?.[resourceIndex];
      const newConnectItemData = [...connectItems];

      if (fieldName === 'buttonText') {
        newConnectItemData[index].text = value;
      } else if (fieldName === 'linkText') {
        newConnectItemData[index].link = value;
      }
      newConnectItemData[index].linkedConnect =
        selectedResource?.contentId ?? -1;
      setResourcesLinks(newConnectItemData);
    };

  const onCheckLinkError = (
    isToCheck: boolean,
    index: number,
    fieldType: 'text' | 'link'
  ) => {
    if (!isToCheck) return false;

    let hasEmptyField =
      !connectItems[index]?.[fieldType] &&
      (index === 0 ||
        !!connectItems[index]?.[fieldType === 'text' ? 'link' : 'text']);

    if (fieldType === 'link' && connectItems[index].link !== '') {
      hasEmptyField = !urlRegex.test(connectItems[index].link);
    }

    return hasEmptyField;
  };

  const onFormatPayload = () => {
    const payload = connectItems
      ?.filter((link) => (link.text && link.link) || link.contentId !== -1)
      .map((link) => ({
        buttonText: link.text,
        link: link.link,
        contentTypeId: link.contentTypeId,
        contentId: link.contentId,
        linkedConnect: 0,
      }));
    return payload;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    setIsSubmitButtonClicked(true);
    const hasEmptyField = connectItems.some((link, index) =>
      index === 0
        ? !link.text || !link.link || !urlRegex.test(link.link)
        : !link.text !== !link.link || (link.link && !urlRegex.test(link.link))
    );

    if (hasEmptyField) return;

    await createContent({
      variables: {
        input: onFormatPayload(),
        localeId: LanguageId.enZa,
      },
    }).then(() => {
      refetch();
    });
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

  const errorLinkMessage = (index) => {
    var connectItem = connectItems[index];

    if (index === 0) {
      if (connectItem.link === '') {
        return 'This field is required.';
      } else if (!urlRegex.test(connectItem.link)) {
        return 'Please add a valid link.';
      }
    } else {
      if (connectItem.link === '') {
        return 'You must add a link for the filled button text.';
      } else if (!urlRegex.test(connectItem.link)) {
        return 'Please add a valid link.';
      }
    }
    return '';
  };

  if (loadingLinks) return <ContentLoader />;

  return (
    <form onSubmit={onSubmit}>
      <div className="flex w-full justify-between">
        <div>
          <Typography type="h1" color="textDark" text="Community links" />
          <Typography
            type="h3"
            color="textDark"
            text="Social media links for practitioners & coaches"
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
      {new Array(connectQuantitiy).fill(0).map((_, linkIndex) => (
        <div
          key={linkIndex}
          className="flex w-full flex-row gap-4 overflow-auto whitespace-nowrap rounded-md bg-white"
        >
          <FormInput
            name={`buttonText_` + linkIndex}
            label={linkIndex === 0 ? `Button text *` : `Button text`}
            placeholder="Add text"
            value={connectItems[linkIndex]?.text}
            className="w-full"
            maxCharacters={40}
            maxLength={40}
            onChange={onChangeLink(linkIndex)}
            {...(onCheckLinkError(isSubmitButtonClicked, linkIndex, 'text') && {
              error: {
                type: 'required',
                message:
                  linkIndex === 0
                    ? 'This field is required.'
                    : 'You must add a text for the filled link.',
              },
            })}
          />
          <FormInput
            name={`linkText_` + linkIndex}
            label={linkIndex === 0 ? `Link *` : `Link`}
            placeholder="Add link..."
            value={connectItems[linkIndex]?.link}
            className="w-full"
            onChange={onChangeLink(linkIndex)}
            {...(onCheckLinkError(isSubmitButtonClicked, linkIndex, 'link') && {
              error: {
                type: 'required',
                message: errorLinkMessage(linkIndex),
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
        className="mt-3 w-full rounded-2xl py-2 px-20 hover:opacity-80 md:w-auto"
      />
    </form>
  );
};
