import Pregnant from '@/assets/pregnant.svg';
import Infant from '@/assets/infant.svg';
import P1 from '@/assets/pillar/p1.svg';
import P2 from '@/assets/pillar/p2.svg';
import P3 from '@/assets/pillar/p3.svg';
import P4 from '@/assets/pillar/p4.svg';
import P5 from '@/assets/pillar/p5.svg';

export const activitiesTypes = {
  careForMom: 'Care for mom',
  careForBaby: 'Care for baby',
  pillar1: 'Pillar 1: Nutrition',
  pillar2: 'Pillar 2: Love, talk and play',
  pillar3: 'Pillar 3: Protection',
  pillar4: 'Pillar 4: Healthcare',
  pillar5: 'Pillar 5: Extra care',
};

export const activitiesColours = {
  pillar2: {
    primaryColor: '#FFCE41',
    secondaryColor: '#FFF3CF',
  },
  pillar3: {
    primaryColor: '#D8C498',
    secondaryColor: '#F3EFE8',
  },
  pillar4: {
    primaryColor: '#EE83B3',
    secondaryColor: '#FADAE8',
  },
};

export const activitiesList = [
  {
    id: activitiesTypes.careForMom,
    menuIconUrl: Pregnant,
    title: 'Care for moms',
    backgroundColor: 'uiBg',
    iconBackgroundColor: 'tertiary',
  },
  {
    id: activitiesTypes.careForBaby,
    menuIconUrl: Infant,
    title: 'Care for baby',
    backgroundColor: 'uiBg',
    iconBackgroundColor: 'tertiary',
    className: 'mb-7',
  },
  {
    id: activitiesTypes.pillar1,
    menuIconUrl: P1,
    title: 'Pillar 1: Nutrition',
    hexBackgroundColor: '#a2dadd4d',
    iconHexBackgroundColor: '#8CDBDF',
  },
  {
    id: activitiesTypes.pillar2,
    menuIconUrl: P2,
    title: 'Pillar 2: Love, talk and play',
    hexBackgroundColor: '#ffd65f4d',
    iconHexBackgroundColor: '#ffe78b',
  },
  {
    id: activitiesTypes.pillar3,
    menuIconUrl: P3,
    title: 'Pillar 3: Protection',
    hexBackgroundColor: '#d7cbb14d',
    iconHexBackgroundColor: '#D8C398',
  },
  {
    id: activitiesTypes.pillar4,
    menuIconUrl: P4,
    title: 'Pillar 4: Health care',
    hexBackgroundColor: '#ee83b34d',
    iconHexBackgroundColor: '#EE83B3',
  },
  {
    id: activitiesTypes.pillar5,
    menuIconUrl: P5,
    title: 'Pillar 5: Extra care',
    hexBackgroundColor: '#f9aa8f4d',
    iconHexBackgroundColor: '#FF9D7B',
  },
];
