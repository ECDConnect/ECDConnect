import { PractitionerProgressReportSummaryDto } from '@ecdlink/core';
import { Card, Typography } from '@ecdlink/ui';

export interface ProgressReportProps {
  progressSummary: PractitionerProgressReportSummaryDto;
}

const ProgressReport: React.FC<ProgressReportProps> = ({ progressSummary }) => {
  return (
    <>
      {progressSummary?.classSummaries?.map((item, index) => {
        return (
          <div className="p-8" key={index}>
            <div className="flex justify-between gap-2">
              <Typography
                className={'mr-1'}
                type={'h1'}
                color={'textDark'}
                text={`${progressSummary?.reportingPeriod} Progress Summary`}
              />
              <div>
                <div className="flex">
                  <Typography
                    className={'mr-1'}
                    type={'small'}
                    weight="bold"
                    color={'textDark'}
                    text={`Class:`}
                  />
                  <Typography
                    className={'mr-1'}
                    type={'small'}
                    color={'textDark'}
                    text={`${item?.className} (${item?.childCount} children)`}
                  />
                </div>
                <div className="flex">
                  <Typography
                    className={'mr-1'}
                    type={'small'}
                    weight="bold"
                    color={'textDark'}
                    text={`Practitioner:`}
                  />
                  <Typography
                    className={'mr-1'}
                    type={'small'}
                    color={'textDark'}
                    text={`${item?.practitionerFullName}`}
                  />
                </div>
              </div>
            </div>
            <div className="pt-8">
              <Typography
                className={'mr-1'}
                type={'h2'}
                weight="bold"
                color={'textDark'}
                text={`Number of children working on each skill`}
              />
              {item?.categories?.map((subItem, subItemIndex) => {
                const getBackgroundColor = (type: string) => {
                  switch (type) {
                    case '#d3276c':
                      return 'tertiaryAccent1';
                    case '#9e4d8e':
                      return 'uiLight';
                    case '#6974AF':
                      return 'uiMid';
                    default:
                      return 'secondaryAccent1';
                  }
                };

                return (
                  <div key={subItemIndex}>
                    <div className="flex items-center gap-4 pt-4">
                      <div
                        className={`h-12 w-12 rounded-full bg-${getBackgroundColor(
                          subItem?.color
                        )} flex items-center justify-center`}
                      >
                        <img
                          src={subItem?.imageUrl}
                          alt=""
                          className="h-8 w-8"
                        />
                      </div>
                      <Typography
                        className={'mr-1'}
                        type={'h2'}
                        weight="bold"
                        color={'textDark'}
                        text={`${subItem?.name}`}
                      />
                    </div>
                    {subItem?.subCategories?.map(
                      (subCategoriesItem, catIndex) => {
                        return (
                          <Card
                            className={'bg-uiBg mt-4 w-full rounded-xl p-4'}
                            key={catIndex}
                          >
                            <div className="flex items-center gap-2 pb-4">
                              <div className="bg-primaryAccent1 flex h-10 w-10 items-center justify-center rounded-full">
                                <img
                                  src={subCategoriesItem?.imageUrl}
                                  alt="subcategory"
                                  className="h-6 w-6"
                                />
                              </div>
                              <Typography
                                className={'mr-1'}
                                type={'h4'}
                                weight="bold"
                                color={'textDark'}
                                text={`${subCategoriesItem?.name}`}
                              />
                            </div>
                            {subCategoriesItem?.childrenPerSkill?.map(
                              (skillItem, skillIndex) => {
                                return (
                                  <div
                                    className="flex items-center gap-2"
                                    key={skillIndex}
                                  >
                                    <Typography
                                      className={'mr-1 pb-4'}
                                      type={'h3'}
                                      weight="bold"
                                      color={'textDark'}
                                      text={`${skillItem?.childCount}`}
                                    />
                                    <Typography
                                      className={'mr-1 pb-4'}
                                      type={'body'}
                                      color={'textMid'}
                                      text={`${skillItem?.skill}`}
                                    />
                                  </div>
                                );
                              }
                            )}
                          </Card>
                        );
                      }
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProgressReport;
