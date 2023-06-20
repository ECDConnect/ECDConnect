import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const paths = pathname.split('/').filter((path) => path !== '');

  return (
    <nav aria-label="breadcrumb" className="w-full p-4">
      <ol className="flex h-8 space-x-2">
        {paths.map((path, index) => {
          const url = `/${paths.slice(0, index + 1).join('/')}`;
          const label = path.charAt(0).toUpperCase() + path.slice(1);

          return (
            <li key={index} className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                fill="currentColor"
                className="mt-1 h-2 w-2 rotate-90 transform fill-current dark:text-gray-600"
              >
                <path d="M32 30.031h-32l16-28.061z"></path>
              </svg>
              {index === paths.length - 1 ? (
                <span className="flex items-center px-1 capitalize">
                  {label}
                </span>
              ) : (
                <Link
                  to={url}
                  className="text-secondary flex items-center px-1 capitalize hover:underline"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
