export interface LoadingSpinnerProps {
  className?: string;
}

export const ContentLoader = ({ className }: LoadingSpinnerProps) => {
  return (
    <div className="flex h-full  items-center justify-center">
      <div
        className={`flex flex-col items-center justify-center px-1 ${className}`}
      >
        <div
          className={`animate-spinner border-t-secondary h-28 w-28 rounded-full border-4 border-t-4 border-white`}
        ></div>
        <div className="text-secondary mt-4">loading ....</div>
      </div>
    </div>
  );
};

export default ContentLoader;
