import principalAdminCheckPreschoolCodeImg from '@/assets/principal_preschool_code_top.png';
import principalAdminCheckPreschoolCodeImgBottom from '@/assets/principal_preschool_code_bottom.png';
import { useTenant } from '@/hooks/useTenant';
import { BannerWrapper, Button, Typography, renderIcon } from '@ecdlink/ui';

export const PrincipalCheckPreschoolCode: React.FC<{
  setPrincipalPreschoolCodeTutorial: (item: boolean) => void;
}> = ({ setPrincipalPreschoolCodeTutorial }) => {
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;

  return (
    <div className="h-screen overflow-auto">
      <BannerWrapper
        title={'Preschool code'}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() => setPrincipalPreschoolCodeTutorial(false)}
        onClose={() => setPrincipalPreschoolCodeTutorial(false)}
      />
      <div className="h-screen overscroll-y-auto p-4">
        <Typography
          color={'primary'}
          type={'h3'}
          text={`Where your principal can find the preschool code:`}
        />
        <Typography
          color={'primary'}
          type={'h3'}
          text={`Step 1: Ask the principal log in to ${appName} & tap the profile button in the top right:`}
          className="my-6"
        />
        <div className="flex w-full justify-center">
          <img
            src={principalAdminCheckPreschoolCodeImg}
            alt="principal cpreschool code tutorial"
            className="w-full"
          />
        </div>
        <Typography
          color={'primary'}
          type={'h3'}
          text={`Step 2: Ask them to tap “Preschool”:`}
          className="my-6"
        />
        <div className="flex w-full justify-center">
          <img
            src={principalAdminCheckPreschoolCodeImgBottom}
            alt="principal cpreschool code tutorial"
            className="w-full"
          />
        </div>
        <div className="mb-12 mt-2 flex w-full justify-center">
          <Button
            type="filled"
            color="quatenary"
            className={'mt-1 mb-2 w-11/12'}
            onClick={() => setPrincipalPreschoolCodeTutorial(false)}
          >
            {renderIcon('XIcon', 'mr-2 text-white w-5')}
            <Typography type={'help'} text={'Close'} color={'white'} />
          </Button>
        </div>
      </div>
    </div>
  );
};
