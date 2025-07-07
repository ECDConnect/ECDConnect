import { FormEvent, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

import { DialogPosition } from '../../models';
import { imageResize, renderIcon } from '../../utils';
import { Dialog } from '../dialog/dialog';

import { PictureIcon, FlipArrowIcon } from './icons';

type FileEventTarget = EventTarget & { files: FileList };

type VideoInput = {
  deviceId: string;
  label: string;
};

type CameraProps = {
  onGetPhoto: (photo: string) => void;
  onClose: () => void;
  resolutionLimit?: number;
};

export const Camera = ({
  onGetPhoto,
  onClose,
  resolutionLimit,
}: CameraProps) => {
  const [facingMode, setFacingMode] = useState<
    'user' | { exact: 'environment' }
  >({ exact: 'environment' });
  const [isAllowedSwitchCamera, setIsAllowedSwitchCamera] = useState(false);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>('');

  const videoConstraints: MediaTrackConstraints = {
    width: 480,
    height: 720,
    aspectRatio: 0.67,
    facingMode,
  };

  const onSwitchCamera = () => {
    //if (isAllowedSwitchCamera) {
    setFacingMode((prevState) =>
      prevState === 'user' ? { exact: 'environment' } : 'user'
    );
    //}
  };

  const handleImageUpload = (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as FileEventTarget;
    const file = target.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      async () => {
        var data = String(reader.result);
        var resizedImage = await imageResize(
          data!,
          resolutionLimit === undefined ? null : resolutionLimit!,
          null,
          null
        );
        onGetPhoto(resizedImage);
        onClose();
      },
      false
    );

    reader.readAsDataURL(file);
  };

  const onClear = () => {
    setPreview('');
  };

  const onSubmit = async () => {
    var resizedPreview = await imageResize(
      String(preview)!,
      resolutionLimit === undefined ? null : resolutionLimit,
      null,
      null
    );
    onGetPhoto(String(resizedPreview));
    onClose();
  };

  useEffect(() => {
    const gotDevices = (mediaDevices: MediaDeviceInfo[]) => {
      const availableVideoInputs: VideoInput[] = [];

      mediaDevices.forEach((mediaDevice) => {
        if (mediaDevice.kind === 'videoinput') {
          availableVideoInputs.push({
            deviceId: mediaDevice.deviceId,
            label: mediaDevice.label,
          });
        }
      });

      if (availableVideoInputs.length > 1) {
        setIsAllowedSwitchCamera(true);
      } else {
        setIsAllowedSwitchCamera(false);
      }
    };

    navigator?.mediaDevices?.enumerateDevices().then(gotDevices);
  }, []);

  return (
    <Dialog fullScreen visible position={DialogPosition.Top}>
      <div className="relative flex h-full w-full flex-col items-center justify-evenly	bg-black">
        <button
          className={'absolute top-0 ml-6 mt-8 self-start'}
          onClick={onClose}
        >
          {renderIcon('XIcon', 'w-6 h-6 text-white hover:text-uiLight')}
        </button>
        {preview ? (
          <div
            className="mt-10 grid content-center"
            style={{ height: '70%', marginTop: 40 }}
          >
            <img alt="preview" src={String(preview)} />
          </div>
        ) : (
          <Webcam
            className="mt-10"
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          >
            {({ getScreenshot }) => (
              <div className="flex w-full items-center justify-evenly">
                <input
                  id="actual-btn"
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  hidden
                />
                <label
                  htmlFor="actual-btn"
                  className="relative flex items-center"
                >
                  <span className="z-1 absolute h-8 w-10 rounded-md bg-white" />
                  <PictureIcon />
                </label>
                <button
                  onClick={() => {
                    const imageSrc = getScreenshot();
                    setPreview(imageSrc);
                  }}
                  className="h-24 w-24 rounded-full border-8 bg-white"
                />
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white"
                  onClick={onSwitchCamera}
                >
                  <FlipArrowIcon />
                </button>
              </div>
            )}
          </Webcam>
        )}
        {preview && (
          <div className="flex w-full justify-between px-6">
            <button className="h-14 w-14" onClick={onClear}>
              {renderIcon('XCircleIcon', 'h-full w-full text-uiBg')}
            </button>
            <button className="h-14 w-14" onClick={onSubmit}>
              {renderIcon('CheckCircleIcon', 'h-full w-full text-successMain')}
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
};
