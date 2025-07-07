import { Button, Typography } from '../../components';
import { renderIcon } from '../../utils';
import * as styles from './fad-button.styles';
import { FADButtonProps } from './fad-button.types';

const FADButton: React.FC<FADButtonProps> = ({
  title,
  icon,
  type,
  click,
  textToggle,
  iconDirection,
  size,
  ...props
}) => {
  return (
    <Button
      type={type}
      size={size ? size : textToggle ? 'large' : 'large-round'}
      onClick={click}
      {...props}
    >
      {iconDirection === 'left' && renderIcon(icon, styles.icon)}
      {textToggle && (
        <Typography
          className={styles.text}
          type="body"
          fontSize={size === 'small' ? '14' : '16'}
          weight="bold"
          color={type === 'ghost' ? props.color : 'white'}
          text={title}
        ></Typography>
      )}
      {/* <div className={styles.textToggle(textToggle)}>{title}</div> */}
      {iconDirection === 'right' && renderIcon(icon, styles.icon)}
    </Button>
  );
};

export { FADButton };
