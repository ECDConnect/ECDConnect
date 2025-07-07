import { Colours, renderIcon } from '@ecdlink/ui';

interface TagProps {
  icon?: string;
  title: string;
  subTitle?: string;
  color: Colours;
}

export const Tag = ({ icon, title, subTitle, color }: TagProps) => (
  <div className={`flex items-center bg-${color} rounded-2xl px-3 py-1`}>
    {icon && renderIcon(icon, 'w-5 h-5 mr-1 text-white')}
    <p className="text-white">{title}</p>
    <p className="ml-1 text-white">{subTitle}</p>
  </div>
);
