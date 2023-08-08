export interface LoadingSpinnerProps {
  className?: string;
}

export const ContentLoader = ({ className }: LoadingSpinnerProps) => {
  return (
    <div className="h-full flex  justify-center items-center">
      <div
        className={`flex flex-col justify-center items-center px-1 ${className}`}
      >
        <div
          className={`h-28 w-28 animate-spinner rounded-full border-4 border-t-4 border-t-secondary border-white`}
        ></div>
        <div className="mt-4 text-secondary">loading ....</div>
      </div>
    </div>
  );
};

export default ContentLoader;
