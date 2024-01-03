import { Button, FormInput, Typography } from '@ecdlink/ui';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { LinkPerSection, LinksSharedProps } from './links-shared.types';
import { gql, useMutation, useQuery } from '@apollo/client';
import { LanguageId } from '../../../../constants/language';
import {
  CmsConnectItemModelInput,
  CmsConnectModelInput,
  ConnectItem,
} from '@ecdlink/graphql';
import ContentLoader from '../../../../components/content-loader/content-loader';

export const LinksShared = ({
  contentType,
  subContentType,
}: LinksSharedProps) => {
  const [linksPerSectionData, setLinksPerSectionData] = useState<
    LinkPerSection[]
  >([]);

  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false);

  const getAllCall = `GetAll${contentType.name}`;
  const subGetAllCall = `GetAll${subContentType.name}`;

  const fields =
    contentType.fields?.map((field) => {
      return field.fieldName;
    }) ?? [];

  const subFields =
    subContentType.fields?.map((field) => {
      if (field.fieldName === 'linkedConnect') {
        return `${field.fieldName} {
        id
      }`;
      }

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

  const subQuery = gql` 
    query ${subGetAllCall} ($localeId: String) {
      ${subGetAllCall} (localeId: $localeId) {
        id
        ${subFields.join('\n')}
        }
      }
  `;

  const createMutation = gql`
    mutation UpdateConnectSection(
      $input: [CMSConnectModelInput]
      $localeId: String
    ) {
      updateConnectSection(input: $input, localeId: $localeId)
    }
  `;

  const { data: sectionsData, loading: loadingSections } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: LanguageId.enZa,
    },
  });

  const {
    data: sectionsLinksData,
    refetch: refetchSectionsLinks,
    loading: loadingSectionsLinks,
  } = useQuery(subQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: LanguageId.enZa,
    },
  });

  const [createContent, { loading }] = useMutation(createMutation);

  const sectionsQuantity = contentType?.content?.length ?? 1;
  // TODO: define this dynamically
  const linksQuantity = 10;

  const setInitialState = useCallback(() => {
    const linksPerSectionData = new Array(sectionsQuantity).fill(0).map(() => ({
      section: '',
      links: new Array(linksQuantity).fill(0).map(() => ({
        text: '',
        link: '',
      })),
    }));

    const currentSections = sectionsData?.[getAllCall] ?? [];

    linksPerSectionData.forEach((sectionData, sectionIndex) => {
      sectionData.section =
        currentSections[sectionIndex]?.[
          contentType.fields?.[0]?.fieldName ?? ''
        ] ?? '';

      const links = sectionsLinksData?.[subGetAllCall]?.filter(
        (item: ConnectItem) =>
          item?.linkedConnect?.[0]?.id === currentSections[sectionIndex]?.id
      ) as ConnectItem[];

      sectionData.links.forEach((link, index) => {
        link.text = links[index]?.buttonText ?? '';
        link.link = links[index]?.link ?? '';
      });
    });

    setLinksPerSectionData(linksPerSectionData);
  }, [
    sectionsData,
    contentType.fields,
    getAllCall,
    sectionsQuantity,
    sectionsLinksData,
    subGetAllCall,
  ]);

  const onChangeSectionTitle =
    (sectionIndex: number) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;

      const newLinksPerSectionData = [...linksPerSectionData];

      newLinksPerSectionData[sectionIndex].section = value;

      setLinksPerSectionData(newLinksPerSectionData);
    };

  const onChangeLink =
    (sectionIndex: number) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      const [fieldName, index] = name.split('_');

      const newLinksPerSectionData = [...linksPerSectionData];

      if (fieldName === 'buttonText') {
        newLinksPerSectionData[sectionIndex].links[index].text = value;
      } else if (fieldName === 'buttonLink') {
        newLinksPerSectionData[sectionIndex].links[index].link = value;
      }

      setLinksPerSectionData(newLinksPerSectionData);
    };

  const onCheckLinkError = (
    isToCheck: boolean,
    sectionIndex: number,
    index: number,
    fieldType: 'text' | 'link'
  ) => {
    if (!isToCheck) return false;

    const hasEmptyField =
      !linksPerSectionData[sectionIndex]?.links[index]?.[fieldType] &&
      (index === 0 ||
        !!linksPerSectionData[sectionIndex]?.links[index]?.[
          fieldType === 'text' ? 'link' : 'text'
        ]);

    return hasEmptyField;
  };

  const onFormatPayload = () => {
    const payload: CmsConnectModelInput[] = contentType?.content?.map(
      (data, index) => ({
        contentTypeId: Number(contentType.id),
        contentId: Number(data.id),
        name: linksPerSectionData?.[index].section,
        links: linksPerSectionData?.[index].links
          .filter((link) => link.text && link.link)
          .map(
            (link) =>
              ({
                buttonText: link.text,
                link: link.link,
                contentId: -1,
                linkedConnect: -1,
                contentTypeId: Number(contentType.id),
              } as CmsConnectItemModelInput)
          ),
      })
    );

    return payload;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    setIsSubmitButtonClicked(true);

    const hasEmptyField = linksPerSectionData.some(
      (sectionData) =>
        !sectionData.section ||
        sectionData.links.some((link, index) =>
          index === 0 ? !link.text || !link.link : !link.text !== !link.link
        )
    );

    if (hasEmptyField) return;

    await createContent({
      variables: {
        input: onFormatPayload(),
        localeId: LanguageId.enZa,
      },
    }).then(() => {
      refetchSectionsLinks();
    });
  };

  useEffect(() => {
    setInitialState();
  }, [setInitialState]);

  if (loadingSections || loadingSectionsLinks) return <ContentLoader />;

  return (
    <form onSubmit={onSubmit}>
      <Typography type="h1" color="textDark" text={contentType.description} />
      <Typography type="h4" color="textMid" text={hint} className="mb-11" />
      {new Array(sectionsQuantity).fill(0).map((_, sectionIndex) => (
        <div key={sectionIndex} className="mb-11">
          <Typography
            type="h2"
            color="textDark"
            text={`Section ${sectionIndex + 1} links`}
          />
          <Typography
            type="help"
            color="textMid"
            text={`You must add at least 1 and no more than ${linksQuantity}. If you add a text item, you must add a link.`}
            className="mb-11"
          />
          <FormInput
            label="Section title *"
            placeholder="Add title"
            className="mb-4"
            value={linksPerSectionData[sectionIndex]?.section}
            onChange={onChangeSectionTitle(sectionIndex)}
            {...(isSubmitButtonClicked &&
              !linksPerSectionData[sectionIndex]?.section && {
                error: {
                  type: 'required',
                  message: 'This field is required.',
                },
              })}
          />
          {new Array(linksQuantity).fill(0).map((_, index) => (
            <div
              className="mb-4 flex w-full flex-col gap-4 md:flex-row"
              key={index}
            >
              <FormInput
                name={`buttonText_${index}`}
                className="w-full"
                label={`Button text ${index === 0 ? '*' : ''}`}
                placeholder="Add text"
                value={linksPerSectionData[sectionIndex]?.links[index]?.text}
                onChange={onChangeLink(sectionIndex)}
                {...(onCheckLinkError(
                  isSubmitButtonClicked,
                  sectionIndex,
                  index,
                  'text'
                ) && {
                  error: {
                    type: 'required',
                    message:
                      index === 0
                        ? 'This field is required.'
                        : 'You must add a text for the filled link.',
                  },
                })}
              />
              <FormInput
                name={`buttonLink_${index}`}
                className="w-full"
                label={`Link ${index === 0 ? '*' : ''}`}
                placeholder="Add link"
                value={linksPerSectionData[sectionIndex]?.links[index]?.link}
                onChange={onChangeLink(sectionIndex)}
                {...(onCheckLinkError(
                  isSubmitButtonClicked,
                  sectionIndex,
                  index,
                  'link'
                ) && {
                  error: {
                    type: 'required',
                    message:
                      index === 0
                        ? 'This field is required.'
                        : 'You must add a link for the filled button text.',
                  },
                })}
              />
            </div>
          ))}
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
