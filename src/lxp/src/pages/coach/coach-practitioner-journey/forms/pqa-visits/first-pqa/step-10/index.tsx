import { Divider, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useLayoutEffect } from 'react';

export const Step10 = ({ setEnableButton, smartStarter }: DynamicFormProps) => {
  const name = smartStarter?.user?.firstName || smartStarter?.firstName;

  // TODO: add N7
  const isFilledSelfAssessment = false;

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="Discuss the self-assessment form"
        color="textDark"
      />
      <Typography
        type="h4"
        text="Go through all of the points below with the franchisee."
        color="textMid"
      />
      <Divider dividerType="dashed" className="my-4" />
      {isFilledSelfAssessment ? (
        <>{/* TODO: add N7 */}</>
      ) : (
        <>
          <Typography
            type="h3"
            text={`${name} did not fill in the self-assessment form on Funda App.`}
            color="textDark"
          />
          <Typography
            type="body"
            text={`If ${name} filled in the paper version of the self-assessment form, please review ${name}’s answers now.`}
            color="textDark"
            className="mt-4"
          />
        </>
      )}
    </div>
  );
};
