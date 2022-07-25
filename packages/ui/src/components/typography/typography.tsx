import { Colours } from '../../models/Colours';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import {
  TypographyLineHeight,
  TypographyType,
  TypographyWeight,
  TypographyFontSizes,
  TypographyAlign,
} from './models/TypographyTypes';
import * as styles from './typography.styles';
import { classNames } from '../../utils/style-class.utils';
import { stripPTag } from '../../utils/typography.util';

export interface TypographyProps extends ComponentBaseProps {
  type: TypographyType;
  text?: string;
  hasMarkup?: boolean;
  fontSize?: TypographyFontSizes;
  weight?: TypographyWeight;
  underline?: boolean;
  lineHeight?: TypographyLineHeight;
  hover?: boolean;
  color?: Colours;
  align?: TypographyAlign;
  onClick?: () => void;
}

export const Typography: React.FC<TypographyProps> = ({
  type,
  text,
  color = 'black',
  weight,
  lineHeight,
  align,
  fontSize,
  hasMarkup = false,
  underline = false,
  hover = false,
  className,
  onClick,
}) => {
  const getTag = (type: TypographyType, text?: string) => {
    let splitText;
    if (text && text.includes('\n')) {
      splitText = text.split('\n').map((str, ix) => (
        <p key={`paragraph-${ix}`} className={`mt-${ix !== 0 ? '3' : '0'}`}>
          {str}
        </p>
      ));
    }

    switch (type) {
      case 'markdown':
        return (
          <article
            onClick={onClick}
            className="prose"
            dangerouslySetInnerHTML={{ __html: text || '' }}
          ></article>
        );
      case 'h1':
        return (
          <h1
            onClick={onClick}
            className={classNames(
              styles.getFontStyleByType(type, weight),
              className,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
          >
            {splitText ?? text}
          </h1>
        );
      case 'h2':
        return (
          <h2
            onClick={onClick}
            className={classNames(
              styles.getFontStyleByType(type, weight),
              className,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              'font-body',
              `${fontSize ? `text-${fontSize}` : ''}`,
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
          >
            {text}
          </h2>
        );
      case 'h3':
        return (
          <h3
            onClick={onClick}
            className={classNames(
              styles.getFontStyleByType(type),
              className,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              'font-body',
              `${fontSize ? `text-${fontSize}` : ''}`,
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
          >
            {splitText ?? text}
          </h3>
        );
      case 'h4':
        return (
          <h4
            onClick={onClick}
            className={classNames(
              styles.getFontStyleByType(type),
              className,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              'font-body',
              `${fontSize ? `text-${fontSize}` : ''}`,
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
          >
            {splitText ?? text}
          </h4>
        );
      case 'h5':
        return (
          <h5
            onClick={onClick}
            className={classNames(
              styles.getFontStyleByType(type),
              className,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              'font-body',
              `${fontSize ? `text-${fontSize}` : ''}`,
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
          >
            {splitText ?? text}
          </h5>
        );
      case 'h6':
        return (
          <h6
            onClick={onClick}
            className={classNames(
              styles.getFontStyleByType(type),
              className,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              'font-body',
              `${fontSize ? `text-${fontSize}` : ''}`,
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
          >
            {splitText ?? text}
          </h6>
        );
      case 'span':
        return (
          <span
            onClick={onClick}
            className={classNames(
              styles.getFontStyleByType(type, weight, underline, hover),
              className,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              'font-body',
              `${fontSize ? `text-${fontSize}` : ''}`,
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
          >
            {splitText ?? text}
          </span>
        );
      case 'unspecified':
        return (
          <div
            onClick={onClick}
            className={classNames(
              className,
              styles.getFontStyleByType(type, weight, underline, hover),
              `${fontSize ? `text-${fontSize}` : ''}`,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              'font-body',
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
          >
            {splitText ?? stripPTag(text)}
          </div>
        );
      case 'buttonSmall':
      case 'button':
        return (
          <p
            onClick={onClick}
            className={classNames(
              `${fontSize ? `text-${fontSize}` : ''}`,
              styles.getFontStyleByType(type, weight, underline, hover),
              className,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              'font-body',
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
          >
            {splitText ?? text}
          </p>
        );
      case 'body':
      case 'help':
      case 'small':

      default:
        return (
          <p
            onClick={onClick}
            className={classNames(
              `${fontSize ? `text-${fontSize}` : ''}`,
              styles.getFontStyleByType(type, weight, underline, hover),
              className,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
          >
            {splitText ?? text}
          </p>
        );
    }
  };

  if (hasMarkup) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: text || '' }}
        className={classNames(
          className,
          `${align ? `text-${align}` : ''}`,
          `text-${color}`,
          'font-body',
          `${fontSize ? `text-${fontSize}` : ''}`,
          `${lineHeight ? `leading-${lineHeight}` : ''}`
        )}
        onClick={onClick}
      ></div>
    );
  }

  return getTag(type, text);
};

export default Typography;
