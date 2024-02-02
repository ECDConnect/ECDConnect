import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/store';
import { Divider, Typography } from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import OpenLink from '@/assets/openLink.svg';
import OpenBook from '@/assets/openBook.svg';
import { ConnectItem } from '@ecdlink/graphql';
import { communitySelectors, communityThunkActions } from '@/store/community';

export const COMMUNITY_TABS = {
  CONNECT: 0,
};

const HEADER_HEIGHT = 222;

export interface iConnectItem {
  name?: string;
  children?: ConnectItem[];
}

export const Connect: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const { height } = useWindowSize();

  const connectData = useSelector(communitySelectors.getConnectData);

  const connectItemData = useSelector(communitySelectors.getConnectItems);

  useEffect(() => {
    if (isOnline && connectData?.length === 0) {
      appDispatch(
        communityThunkActions.getAllConnect({
          locale: 'en-za',
        })
      );
    }
  }, [isOnline, appDispatch, connectData]);

  useEffect(() => {
    if (isOnline && connectItemData?.length === 0) {
      appDispatch(
        communityThunkActions.getAllConnectItem({
          locale: 'en-za',
        })
      );
    }
  }, [isOnline, appDispatch, connectItemData]);

  const { connectItems } = useMemo(() => {
    function getChildren(name: string) {
      let children: any = [];

      connectItemData?.forEach((element: ConnectItem) => {
        if (
          element?.linkedConnect &&
          element?.linkedConnect[0]?.name === name
        ) {
          children.push({ buttonText: element.buttonText, link: element.link });
        }
      });

      return children;
    }
    const connectItems = connectData?.map(
      (item): iConnectItem => ({
        name: item.name || '',
        children: getChildren(item?.name || ''),
      })
    );
    return { connectItems };
  }, [connectData, connectItemData]);

  const onLinkClicked = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div
      className="flex flex-col p-4"
      style={{ height: height - HEADER_HEIGHT }}
    >
      <div className="flex items-center gap-3 rounded-2xl p-4">
        <img className={''} src={OpenBook} alt="" />
        <Typography
          type="body"
          weight="bold"
          lineHeight="snug"
          color="textDark"
          className="text-3xl"
          text="Links & resoures"
        />
      </div>
      <Divider className="mb-4" dividerType="dashed" />

      {connectItems?.map((item) => (
        <div key={item.name}>
          <Typography
            type="h2"
            weight="bold"
            lineHeight="snug"
            color="textMid"
            className="mb-2"
            text={item?.name || ''}
          />

          {item?.children?.map((child) => (
            <div
              className="bg-uiBg mb-2 flex items-center gap-1 rounded-2xl p-4"
              key={child?.id}
            >
              <table
                className="border border-gray-100"
                width={`100%`}
                key={child?.link}
              >
                <tbody>
                  <tr>
                    <td width={`90%`}>{child?.buttonText}</td>
                    <td width={`10%`}>
                      <a
                        href={child?.link || ''}
                        onClick={() => {
                          onLinkClicked(child?.link || '');
                        }}
                      >
                        <img className={''} src={OpenLink} alt="" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}

          <Divider className="p-4" dividerType="dashed" />
        </div>
      ))}
    </div>
  );
};
