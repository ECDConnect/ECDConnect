import { BannerWrapper, Button, Typography, renderIcon } from '@ecdlink/ui';

interface ProgrammeTypeTextsProps {
  title?: string;
  subtitle?: string;
  text?: string[];
}

interface ModelTypeProps {
  modelTypeObject: ProgrammeTypeTextsProps;
  setOpenModelInfo: (e: boolean) => void;
}

export const ModelInfo: React.FC<ModelTypeProps> = ({
  setOpenModelInfo,
  modelTypeObject,
}) => {
  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={modelTypeObject?.title}
      color={'primary'}
      onBack={() => setOpenModelInfo(false)}
      className="pb-16"
    >
      <div className="p-4">
        <Typography
          type="h3"
          className="mr-2"
          color="textDark"
          text={modelTypeObject?.subtitle}
        ></Typography>
        <div className="mt-4">
          {modelTypeObject?.text?.map((item) => {
            return (
              <Typography
                type="body"
                className="mr-2 mt-1"
                color="textMid"
                text={item}
              ></Typography>
            );
          })}
        </div>
        <Button
          type="filled"
          color="primary"
          className={'mt-4 w-full'}
          onClick={() => setOpenModelInfo(false)}
        >
          {renderIcon('XIcon', 'h-4 w-4 text-white mr-2')}
          <Typography
            type="h6"
            className="mr-2"
            color="white"
            text={'Close'}
          ></Typography>
        </Button>
      </div>
    </BannerWrapper>
  );
};
