import Typography from '../typography/typography';

interface NoteProps {
  title: string;
  subTitle: string;
  body: string;
}

export const Note = ({ title, subTitle, body }: NoteProps) => (
  <div className="bg-uiBg rounded-15 p-4">
    <Typography type="h3" text={title} color="textDark" />
    <Typography type="help" text={subTitle} color="textLight" />
    <Typography type="body" text={body} color="textMid" />
  </div>
);
