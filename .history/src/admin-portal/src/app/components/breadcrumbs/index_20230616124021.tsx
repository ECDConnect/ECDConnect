import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
    return (
        <nav aria-label="breadcrumb" className="w-full p-4 dark:bg-gray-800 dark:text-secorady-100">
            <ol className="flex h-8 space-x-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                            fill="currentColor"
                            className="w-2 h-2 mt-1 transform rotate-90 fill-current dark:text-gray-600"
                        >
                            <path d="M32 30.031h-32l16-28.061z"></path>
                        </svg>
                        {index === items.length - 1 ? (
                            <span className="flex items-center px-1 capitalize">{item.label}</span>
                        ) : (
                            <Link
                                to={item.url}
                                className="flex items-center px-1 capitalize hover:underline"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
