import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { IonContent } from '@ionic/react';
import { Typography, Card, Button, BannerWrapper } from '@ecdlink/ui';
import { useTheme, useDialog } from '@ecdlink/core';
import { ReactComponent as Cebisa } from '@/assets/cebisa.svg';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useStoreSetup } from '@/hooks/useStoreSetup';
import { useAppDispatch } from '@/store';
import { authSelectors } from '@/store/auth';
import { classroomsSelectors } from '@/store/classroom';
import { userSelectors } from '@/store/user';
import { label } from '../child/child-notes/child-notes.styles';

export const SetupProfileWelcomePage: React.FC = () => {
  const history = useHistory();
  const { theme } = useTheme();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const classroom = useSelector(classroomsSelectors.getClassroom);

  useEffect(() => {
    console.log('hello');
  }, []);

  const onBack = () => {
    console.log('clicked back');
  };
  return (
    <IonContent scrollY={true}>
      <BannerWrapper
        size={'large'}
        renderBorder={true}
        showBackground={true}
        title={'Edit Profile'}
        subTitle={label}
        onBack={onBack}
        backgroundColour={'white'}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        displayOffline={!isOnline}
      >
        <div className="h-full pt-7">
          <div className="flex flex-col gap-11">
            <Typography
              color="white"
              type="h1"
              text="Hello, my name is Cebisa and I'm here to help you!"
            />
            <div>
              <Card
                className="bg-uiBg p-4 flex items-center flex-col gap-3"
                borderRaduis="lg"
                shadowSize="lg"
              >
                <div className="">
                  <Cebisa />
                </div>
                <Typography
                  color="textDark"
                  text="I'd like to get to know you."
                  type={'h3'}
                />
                <Typography
                  className="text-center"
                  color="textMid"
                  text="Please give me more information to make Funda App useful for you!"
                  type={'body'}
                />
              </Card>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 max-h-20">
            <Button
              size="normal"
              className="w-full"
              type="filled"
              color="primary"
              text="Start"
              textColor="white"
              icon="ArrowCircleRightIcon"
              onClick={() => console.log('go to the right page')}
            />
          </div>
        </div>
      </BannerWrapper>
    </IonContent>
  );
};
