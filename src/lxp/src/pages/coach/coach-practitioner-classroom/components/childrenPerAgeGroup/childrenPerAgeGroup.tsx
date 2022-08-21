import { getAge } from '@/utils/child/child-profile-utils';
import { Typography, Card } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import * as styles from './childrenPerAgeGroup.styles';
import { ChildrenPerAgeGroupProps } from './childrenperAgeGroup.types';

export const ChildrenPerAgeGroup: React.FC<ChildrenPerAgeGroupProps> = ({
  childrenForPractitionerList,
}) => {
  const [ageGroup1, setAgeGroup1] = useState(0);
  const [ageGroup2, setAgeGroup2] = useState(0);
  const [ageGroup3, setAgeGroup3] = useState(0);

  console.log(ageGroup3);

  const handleAgeGroups = (childAge: any) => {
    if (childAge?.years < 2 && childAge?.months < 7) {
      setAgeGroup1((prevState) => prevState + 1);
      return;
    }
    if (childAge?.years < 3 && childAge?.years > 1 && childAge?.months > 6) {
      setAgeGroup2((prevState) => prevState + 1);
      return;
    }
    if (childAge?.years >= 3) {
      setAgeGroup3((prevState) => prevState + 1);
      return;
    }
  };

  useEffect(() => {
    // eslint-disable-next-line array-callback-return
    if (childrenForPractitionerList) {
      childrenForPractitionerList?.map((item) => {
        console.log('entrou');
        const childBirthDate = item?.user?.dateOfBirth
          ? new Date(item?.user?.dateOfBirth)
          : undefined;

        const childAge = getAge(childBirthDate);
        handleAgeGroups(childAge);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                text={'18 mths - 3 years'}
                type="body"
                className="mb-4"
              />
            </div>
          </div>
          <div>
            <div className="pb-2">
              <div className="mt-4 mb-3 text-4xl font-semibold text-black">
                {ageGroup3}
              </div>
              <Typography text={'3 - 5 years'} type="body" className="mb-4" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
