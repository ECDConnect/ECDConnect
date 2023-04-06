import Pregnant from '@/assets/pregnant.svg';
import Infant from '@/assets/infant.svg';
import P1 from '@/assets/pillar/p1.svg';
import P2 from '@/assets/pillar/p2.svg';
import P3 from '@/assets/pillar/p3.svg';
import P4 from '@/assets/pillar/p4.svg';
import P5 from '@/assets/pillar/p5.svg';

export const activitiesTypes = {
  healthCare: 'Healthcare',
  nutrition: 'Nutrition',
  pregnancyCare: 'Pregnancy care',
  dangerSigns: 'Danger signs',
  followUp: 'Follow up',
};

export const activitiesColours = {
  pillar1: {
    primaryColor: '#8CDBDF',
    secondaryColor: '#a2dadd4d',
  },
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
  pillar5: {
    primaryColor: '#FF9D7B',
    secondaryColor: '#FDE6DD',
  },
  other: {
    primaryColor: '#FAAB35',
    secondaryColor: '#FEF1E8',
  },
};

const activitiesListClassname = 'text-textDark text-lg font-bold';

export const activitiesList = [
  {
    id: activitiesTypes.healthCare,
    menuIconUrl: Pregnant,
    title: activitiesTypes.healthCare,
    hexBackgroundColor: '#FEF1E8',
    iconBackgroundColor: 'tertiary',
    className: activitiesListClassname,
  },
  {
    id: activitiesTypes.nutrition,
    menuIconUrl: Infant,
    title: activitiesTypes.nutrition,
    hexBackgroundColor: '#FEF1E8',
    iconBackgroundColor: 'tertiary',
    className: activitiesListClassname,
  },
  {
    id: activitiesTypes.pregnancyCare,
    menuIconUrl: P1,
    title: activitiesTypes.pregnancyCare,
    hexBackgroundColor: '#FEF1E8',
    iconBackgroundColor: 'tertiary',
    className: activitiesListClassname,
  },
  {
    id: activitiesTypes.dangerSigns,
    menuIconUrl: P2,
    title: activitiesTypes.dangerSigns,
    hexBackgroundColor: '#FEF1E8',
    iconBackgroundColor: 'tertiary',
    className: activitiesListClassname,
  },
];
