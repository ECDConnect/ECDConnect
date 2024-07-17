import { ClubLeaderDto, DetailClubDto } from '@/models/club/club.dto';
import { MenuListDataItem } from '@ecdlink/ui';

export interface AddIssuesAndTasksItem {
  menuIcon: MenuListDataItem['menuIcon'];
  iconBackgroundColor: MenuListDataItem['iconBackgroundColor'];
  backgroundColor: MenuListDataItem['backgroundColor'];
  title: MenuListDataItem['title'];
  subTitle: MenuListDataItem['subTitle'];
  onActionClick: MenuListDataItem['onActionClick'];
}

export interface IssuesAndTasksProps {
  issuesAndTasks: MenuListDataItem[];
  setIssuesAndTasks: (issuesAndTasks: MenuListDataItem[]) => void;
  club?: DetailClubDto;
  totalMembers: number;
  currentLeader?: ClubLeaderDto;
  nextLeader?: ClubLeaderDto;
  isLeaderRequestSent: boolean;
  isLeaderAcceptedOverSixMonths: boolean;
  onOnlineNavigation: (path: string) => void;
}
