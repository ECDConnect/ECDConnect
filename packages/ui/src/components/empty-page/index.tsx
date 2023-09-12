type EmptyPageProps = {
  image: string;
  title: string;
  subTitle: string;
};

export const EmptyPage = ({ image, title, subTitle }: EmptyPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center pt-16 text-center">
      <img src={image} alt="alien" />
      <p className="text-textDark text-18 mt-4 mb-2 font-semibold">{title}</p>
      <p>{subTitle}</p>
    </div>
  );
};
