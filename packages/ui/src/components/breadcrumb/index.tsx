import { ArrowSmRightIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';

export interface BreadcrumbProps {
  paths: { name: string; url: string; state?: unknown }[];
}

export const Breadcrumb = ({ paths }: BreadcrumbProps) => {
  return (
    <nav aria-label="breadcrumb" className="flex">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {paths?.map((path, index) => {
          const isLast = index === paths.length - 1;

          return (
            <li
              key={index}
              className={`inline-flex items-center ${
                isLast ? 'text-textMid' : 'text-secondary'
              }`}
            >
              {!isLast ? (
                <>
                  {path.url ? (
                    <Link
                      to={{
                        pathname: path.url,
                        state: path.state,
                      }}
                      className="inline-flex items-center text-sm font-medium hover:text-gray-900"
                    >
                      {path.name}
                      <ArrowSmRightIcon className="text-textMid ml-3 h-5 w-5" />
                    </Link>
                  ) : (
                    <span className="inline-flex cursor-not-allowed items-center text-sm font-medium">
                      {path.name}
                      <ArrowSmRightIcon className="text-textMid ml-3 h-5 w-5" />
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm font-medium">{path.name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
