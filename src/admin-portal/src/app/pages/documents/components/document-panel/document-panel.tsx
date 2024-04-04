import { DocumentDto, WorkflowStatusDto } from '@ecdlink/core';
import { Button, Divider, Typography, renderIcon } from '@ecdlink/ui';

/* eslint-disable-next-line */
export interface DocumentPanelProps {
  item: DocumentDto;
  workflowStatus: WorkflowStatusDto[];
  closeDialog: (value: boolean) => void;
}

export default function DocumentPanel(props: DocumentPanelProps) {
  return (
    <div className="space-y-8 divide-y divide-gray-200">
      <div className="pt-8">
        <div className="flex w-8/12 items-center justify-items-start gap-1">
          <Typography
            type={'body'}
            hover={true}
            weight="bold"
            text={'Client:'}
            color={'textDark'}
          />
          <Typography
            type={'body'}
            hover={true}
            text={props?.item?.clientName}
            color={'textDark'}
          />
        </div>
        <div className="flex w-8/12 items-center justify-items-start gap-1">
          <Typography
            type={'body'}
            hover={true}
            weight="bold"
            text={'CHW:'}
            color={'textDark'}
          />
          <Typography
            type={'body'}
            hover={true}
            text={props?.item?.createdByName}
            color={'textDark'}
          />
        </div>
        <div className="flex w-8/12 items-center justify-items-start gap-1">
          <Typography
            type={'body'}
            hover={true}
            weight="bold"
            text={'Document type:'}
            color={'textDark'}
          />
          <Typography
            type={'body'}
            hover={true}
            text={props?.item?.documentType?.description}
            color={'textDark'}
          />
        </div>
        <Divider dividerType="dashed" className="py-8" />
        <div className="flex w-full items-center justify-between">
          <Typography
            type={'h3'}
            hover={true}
            text={'Document'}
            color={'textDark'}
          />
          <Button
            type={'outlined'}
            color={'tertiary'}
            onClick={() => {}}
            className="rounded-xl px-2"
          >
            <div className="flex flex-row items-center">
              {renderIcon('DownloadIcon', `text-tertiary h-4 w-4 mr-2`)}
              <a href={props?.item?.reference} download className="">
                Download
              </a>
            </div>
          </Button>
        </div>
        <img
          src={props?.item?.reference}
          alt=""
          className="h-8/12 w-full pt-4"
        />
      </div>
    </div>
    // </form>
  );
}
