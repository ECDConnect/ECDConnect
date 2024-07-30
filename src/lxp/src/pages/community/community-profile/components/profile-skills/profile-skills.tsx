import { ProfileSkillsDto } from '@ecdlink/core';
import { Button, Card, Divider, Typography, renderIcon } from '@ecdlink/ui';
import { useMemo } from 'react';

interface ProfileSkillsProps {
  userName: string;
  skills: ProfileSkillsDto[];
  action?: (item: boolean) => void;
  connectionProfile?: boolean;
}

export const ProfileSkills: React.FC<ProfileSkillsProps> = ({
  userName,
  skills,
  action,
  connectionProfile,
}) => {
  const renderProfileSkills = useMemo(() => {
    if (skills?.length > 0) {
      return skills?.map((item, index) => {
        return (
          <div key={item?.id}>
            <div className="flex items-center gap-2">
              <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-full p-2">
                {renderIcon(`${item?.imageName}`, 'h-6 w-6 text-white')}
              </div>
              <Typography
                type={'h3'}
                text={item?.name?.toUpperCase()}
                color={'textDark'}
              />
            </div>
            <Typography
              type={'h4'}
              text={item?.description}
              color={'textMid'}
              className="mt-2"
            />
            {skills?.length > 0 && index !== skills?.length - 1 && (
              <Divider className="text=primary my-2" dividerType="dashed" />
            )}
          </div>
        );
      });
    } else {
      return (
        <Typography
          type={'body'}
          text={connectionProfile ? 'None' : 'None - please add your skills.'}
          color={'textMid'}
          className="mt-2"
        />
      );
    }
  }, [skills?.length]);

  return (
    <div>
      <Card className="bg-adminBackground rounded-2xl p-4">
        <div>
          <div className="flex items-center justify-between">
            <Typography
              type={'h4'}
              text={`${userName}'s skills`}
              color={'textDark'}
              className="w-full"
            />
            {skills?.length === 0 && !connectionProfile && (
              <div className="flex w-full justify-end">
                <Button
                  className={'mt-3 rounded-xl'}
                  type="filled"
                  color="quatenary"
                  onClick={() => action && action(true)}
                  icon="PlusIcon"
                  textColor="white"
                  text="Add"
                  size="small"
                  iconPosition="end"
                />
              </div>
            )}
          </div>
          <Divider className="my-3" dividerType="dashed" />
          {renderProfileSkills}
          {skills?.length > 0 && !connectionProfile && (
            <div className="flex w-full justify-end">
              <Button
                className={'mt-3 rounded-xl'}
                type="filled"
                color="secondaryAccent2"
                onClick={() => action && action(true)}
                icon="PencilIcon"
                textColor="secondary"
                text="Edit"
                size="small"
                iconPosition="end"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
