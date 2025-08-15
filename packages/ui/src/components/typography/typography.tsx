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
  autoLink?: boolean;
  fontSize?: TypographyFontSizes;
  weight?: TypographyWeight;
  underline?: boolean;
  lineHeight?: TypographyLineHeight;
  hover?: boolean;
  color?: Colours;
  align?: TypographyAlign;
  onClick?: () => void;
}

const linkifyText = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s<>"']+)/g;
  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`
  );
};

export const Typography: React.FC<TypographyProps> = ({
  type,
  text,
  color = 'black',
  weight,
  lineHeight,
  align,
  fontSize,
  hasMarkup = false,
  autoLink = false,
  underline = false,
  hover = false,
  className,
  onClick,
  inputRef,
  ...restProps
}) => {
  const getTag = (type: TypographyType, text?: string) => {
    let processedText = text;

    if (autoLink && text && !hasMarkup) {
      processedText = linkifyText(text);
    }

    let splitText;
    if (processedText && processedText.includes('\n')) {
      splitText = processedText.split('\n').map((str, ix) =>
        str ? (
          <span
            key={`paragraph-${ix}`}
            className={`mt-${ix !== 0 ? '3' : '0'} block`}
            dangerouslySetInnerHTML={autoLink ? { __html: str } : undefined}
          >
            {!autoLink ? str : null}
          </span>
        ) : null
      );
    }

    switch (type) {
      case 'markdown':
        return (
          <article
            ref={inputRef}
            onClick={onClick}
            className={classNames('prose', className)}
            dangerouslySetInnerHTML={{ __html: processedText || '' }}
            {...restProps}
          />
        );
      case 'h1':
        return (
          <h1
            ref={inputRef}
            onClick={onClick}
            className={classNames(
              styles.getFontStyleByType(type, weight),
              className,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
            dangerouslySetInnerHTML={
              autoLink ? { __html: processedText || '' } : undefined
            }
          >
            {!autoLink ? splitText ?? processedText : null}
          </h1>
        );
      case 'h2':
        return (
          <h2
            ref={inputRef}
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
            dangerouslySetInnerHTML={
              autoLink ? { __html: processedText || '' } : undefined
            }
          >
            {!autoLink ? splitText ?? processedText : null}
          </h2>
        );
      case 'h3':
        return (
          <h3
            ref={inputRef}
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
            dangerouslySetInnerHTML={
              autoLink ? { __html: processedText || '' } : undefined
            }
          >
            {!autoLink ? splitText ?? processedText : null}
          </h3>
        );
      case 'h4':
        return (
          <h4
            ref={inputRef}
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
            dangerouslySetInnerHTML={
              autoLink ? { __html: processedText || '' } : undefined
            }
          >
            {!autoLink ? splitText ?? processedText : null}
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
            dangerouslySetInnerHTML={
              autoLink ? { __html: processedText || '' } : undefined
            }
          >
            {!autoLink ? splitText ?? processedText : null}
          </h5>
        );
      case 'h6':
        return (
          <h6
            ref={inputRef}
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
            dangerouslySetInnerHTML={
              autoLink ? { __html: processedText || '' } : undefined
            }
          >
            {!autoLink ? splitText ?? processedText : null}
          </h6>
        );
      case 'span':
        return (
          <span
            ref={inputRef}
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
            dangerouslySetInnerHTML={
              autoLink ? { __html: processedText || '' } : undefined
            }
          >
            {!autoLink ? splitText ?? processedText : null}
          </span>
        );
      case 'unspecified':
        return (
          <div
            ref={inputRef}
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
            dangerouslySetInnerHTML={
              autoLink ? { __html: processedText || '' } : undefined
            }
          >
            {!autoLink ? splitText ?? stripPTag(processedText) : null}
          </div>
        );
      case 'buttonSmall':
      case 'button':
        return (
          <p
            ref={inputRef}
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
            dangerouslySetInnerHTML={
              autoLink ? { __html: processedText || '' } : undefined
            }
          >
            {!autoLink ? splitText ?? processedText : null}
          </p>
        );
      case 'body':
      case 'help':
      case 'small':
      default:
        return (
          <p
            ref={inputRef}
            onClick={onClick}
            className={classNames(
              `${fontSize ? `text-${fontSize}` : ''}`,
              styles.getFontStyleByType(type, weight, underline, hover),
              className,
              `${align ? `text-${align}` : ''}`,
              `text-${color}`,
              `${lineHeight ? `leading-${lineHeight}` : ''}`
            )}
            dangerouslySetInnerHTML={
              autoLink ? { __html: processedText || '' } : undefined
            }
          >
            {!autoLink ? splitText ?? processedText : null}
          </p>
        );
    }
  };

  if (hasMarkup) {
    return (
      <div
        ref={inputRef}
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
