import { Typography, Card } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import * as styles from './childrenPerAgeGroup.styles';
import { ChildrenPerAgeGroupProps } from './childrenperAgeGroup.types';
import { differenceInCalendarMonths } from 'date-fns';

export const ChildrenPerAgeGroup: React.FC<ChildrenPerAgeGroupProps> = ({
  childrenForPractitionerList,
}) => {
  const [ageGroup1, setAgeGroup1] = useState(0);
  const [ageGroup2, setAgeGroup2] = useState(0);
  const [ageGroup3, setAgeGroup3] = useState(0);
  const [ageGroup4, setAgeGroup4] = useState(0);

  const handleAgeGroups = (childAgeInMonths: any) => {
    if (childAgeInMonths < 18) {
      setAgeGroup1((prevState) => prevState + 1);
      return;
    }
    if (childAgeInMonths >= 18 && childAgeInMonths < 36) {
      setAgeGroup2((prevState) => prevState + 1);
      return;
    }
    if (childAgeInMonths >= 36 && childAgeInMonths < 72) {
      setAgeGroup3((prevState) => prevState + 1);
      return;
    }
    if (childAgeInMonths >= 72) setAgeGroup4((prevState) => prevState + 1);
  };

  useEffect(() => {
    if (!!childrenForPractitionerList?.length) {
      childrenForPractitionerList?.map((item) => {
        const childBirthDate = item?.user?.dateOfBirth
          ? new Date(item?.user?.dateOfBirth)
          : undefined;

        const childAgeInMonths = differenceInCalendarMonths(
          new Date(),
          new Date(childBirthDate || new Date())
        );

        return handleAgeGroups(childAgeInMonths);
      });

      return () => {
        setAgeGroup1(0);
        setAgeGroup2(0);
        setAgeGroup3(0);
        setAgeGroup4(0);
      };
    }
  }, [childrenForPractitionerList]);

  return (
    <div>
      <Card className={styles.perAgeCard} borderRaduis={'xl'} shadowSize={'md'}>
        <div className="ml-4 mt-4 pt-4">
          <Typography
            text={'Children per age group'}
            type="body"
            className="mb-4"
          />
        </div>
        <div className="mx-6">
          <div className="flex justify-between">
            <div>
              <div className="mt-4 mb-3 text-4xl font-semibold text-black">
                {ageGroup1}
              </div>
              <Typography text={'< 18 mths'} type="body" className="mb-4" />
            </div>
            <div>
              <div className="mt-4 mb-3 text-4xl font-semibold text-black">
                {ageGroup2}
              </div>
              <Typography
                text={'18 mths - 2 years'}
                type="body"
                className="mb-4"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="pb-2">
              <div className="mt-4 mb-3 text-4xl font-semibold text-black">
                {ageGroup3}
              </div>
              <Typography text={'3 - 5 years'} type="body" className="mb-4" />
            </div>
            <div className="mr-10 pb-2">
              <div className="mt-4 mb-3 text-4xl font-semibold text-black">
                {ageGroup4}
              </div>
              <Typography text={'6 - 10 years'} type="body" className="mb-4" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
