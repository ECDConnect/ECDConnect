import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { useAppDispatch } from '@/store';
import { Divider, RoundIcon, Typography, renderIcon } from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import OpenLink from '@/assets/openLink.svg';
import OpenBook from '@/assets/openBook.svg';
import { CommunitySectionItemGg } from '@ecdlink/graphql/lib';

export const COMMUNITY_TABS = {
  CONNECT: 0,
};

const HEADER_HEIGHT = 222;

export interface ConnectItem {
  name?: string;
  children?: CommunitySectionItemGg[];
}

export const Connect: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const { height } = useWindowSize();

  const connectSections = useSelector(
    communitySelectors.getCommunityConnectDataForGGSelector
  );

  const connectSectionItems = useSelector(
    communitySelectors.GetCommunitySectionItemsGGSelector
  );

  useEffect(() => {
    if (isOnline) {
      appDispatch(
        communityThunkActions.getCommunitySectionGG({
          locale: 'en-za',
        })
      );
    }
  }, [isOnline, appDispatch]);

  useEffect(() => {
    if (isOnline) {
      appDispatch(
        communityThunkActions.getAllCommunitySectionItemGG({
          locale: 'en-za',
        })
      );
    }
  }, [isOnline, appDispatch]);

  function getChildren(name: string) {
    let children: any = [];

    connectSectionItems?.forEach((element) => {
      if (element?.linkedSection && element?.linkedSection[0]?.name === name) {
        children.push({ buttonText: element.buttonText, link: element.link });
      }
    });

    return children;
  }

  const { sectionItems } = useMemo(() => {
    const sectionItems = connectSections?.map(
      (item): ConnectItem => ({
        name: item.name || '',
        children: getChildren(item?.name || ''),
      })
    );
    sectionItems?.reverse();
    return { sectionItems };
  }, [connectSections, connectSectionItems]);

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

      {sectionItems?.map((section) => (
        <div key={section?.name}>
          <Typography
            type="h2"
            weight="bold"
            lineHeight="snug"
            color="textMid"
            className="mb-2"
            text={section?.name || ''}
          />

          {section.children?.map((item) => (
            <div className="bg-uiBg mb-2 flex items-center gap-1 rounded-2xl p-4">
              <table className="border border-gray-100" width={`100%`}>
                <tr>
                  <td width={`90%`}>{item?.buttonText}</td>
                  <td width={`10%`}>
                    <a
                      href={item?.link || ''}
                      onClick={() => {
                        onLinkClicked(item?.link || '');
                      }}
                    >
                      <img className={''} src={OpenLink} alt="" />
                    </a>
                  </td>
                </tr>
              </table>
            </div>
          ))}

          <Divider className="p-4" dividerType="dashed" />
        </div>
      ))}
    </div>
  );
};
