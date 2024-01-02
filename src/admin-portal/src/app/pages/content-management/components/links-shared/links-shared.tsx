import { Button, FormInput, Typography } from '@ecdlink/ui';
import { FormEvent, useEffect, useState } from 'react';
import { LinkPerSection, LinksSharedProps } from './links-shared.types';
import { gql, useQuery } from '@apollo/client';
import { LanguageId } from '../../../../constants/language';

export const LinksShared = ({ contentType }: LinksSharedProps) => {
  const [linksPerSectionData, setLinksPerSectionData] = useState<
    LinkPerSection[]
  >([]);

  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false);

  const getAllCall = `GetAll${contentType.name}`;

  const fields = contentType.fields?.map((field) => field.fieldName) ?? [];

  const query = gql` 
    query ${getAllCall} ($localeId: String) {
      ${getAllCall} (localeId: $localeId) {
        id
        ${fields.join('\n')}
        }
      }
  `;

  const {
    data: contentData,
    // refetch: refetchContent,
    // loading: loadingContent,
  } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: LanguageId.enZa,
    },
  });

  console.log({ contentData, query });

  // TODO: sectionsQuantity
  const sectionsQuantity = 2;
  // TODO: linksQuantity
  const linksQuantity = 10;

  const setInitialState = () => {
    const linksPerSectionData = new Array(sectionsQuantity)
      .fill(0)
      .map((_, index) => ({
        section: '',
        links: new Array(linksQuantity).fill(0).map((_, index) => ({
          text: '',
          link: '',
        })),
      }));

    setLinksPerSectionData(linksPerSectionData);
  };

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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    // TODO: call api
    console.log({ payload: linksPerSectionData });
  };

  useEffect(() => {
    setInitialState();
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <Typography type="h1" color="textDark" text={contentType.description} />
      <Typography
        type="h4"
        color="textMid"
        // TODO: hint
        text="Links & resources for practitioners"
        className="mb-11"
      />
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
            <div className="mb-4 flex w-full flex-col gap-4 md:flex-row">
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
