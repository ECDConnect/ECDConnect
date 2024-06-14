import principalAdminCheckPreschoolCodeImg from '@/assets/principal_preschool_code.png';
import { BannerWrapper, Button, Typography, renderIcon } from '@ecdlink/ui';

export const PrincipalCheckPreschoolCode: React.FC<{
  setPrincipalPreschoolCodeTutorial: (item: boolean) => void;
}> = ({ setPrincipalPreschoolCodeTutorial }) => {
  return (
    <div>
      <BannerWrapper
        title={'Preschool code'}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() => setPrincipalPreschoolCodeTutorial(false)}
        onClose={() => setPrincipalPreschoolCodeTutorial(false)}
      />
      <div className="h-screen overscroll-y-auto">
        <div className="flex w-full justify-center">
          <img
            src={principalAdminCheckPreschoolCodeImg}
            alt="principal cpreschool code tutorial"
            className="ml-3"
          />
        </div>
        <div className="mb-8 flex w-full justify-center">
          <Button
            type="filled"
            color="quatenary"
            className={'mt-1 mb-2 w-11/12'}
            onClick={() => setPrincipalPreschoolCodeTutorial(false)}
          >
            {renderIcon('XIcon', 'mr-2 text-white w-5')}
            <Typography type={'help'} text={'Next'} color={'white'} />
          </Button>
        </div>
      </div>
    </div>
  );
};
