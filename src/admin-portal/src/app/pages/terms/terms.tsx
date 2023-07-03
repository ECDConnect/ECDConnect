import { useEffect, useState } from 'react';
import logo from '../../../assets/Logo-ECDConnect-white.svg';

export function TermsPage(props: any) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="">
      <header className="bg-primary">
        <div className="container flex justify-between h-16 mx-auto ">
          <a rel="noopener noreferrer" href="#" aria-label="Back to homepage" className="flex items-center p-2">
            <img className="h-100 w-150" src={logo} alt="Login Logo" />
          </a>
          <ul className="hidden items-stretch space-x-3 md:flex">
            <li className="flex">
              <a
                rel="noopener noreferrer"
                href="#"
                className="-mb-1 flex items-center border-b-2 px-4 dark:border-transparent"
              >
                Link
              </a>
            </li>
            <li className="flex">
              <a
                rel="noopener noreferrer"
                href="#"
                className="-mb-1 flex items-center border-b-2 px-4 dark:border-transparent"
              >
                Link
              </a>
            </li>
            <li className="flex">
              <a
                rel="noopener noreferrer"
                href="#"
                className="dark:text-violet-400 dark:border-violet-400 -mb-1 flex items-center border-b-2 px-4 dark:border-transparent"
              >
                Link
              </a>
            </li>
            <li className="flex">
              <a
                rel="noopener noreferrer"
                href="#"
                className="-mb-1 flex items-center border-b-2 px-4 dark:border-transparent"
              >
                Link
              </a>
            </li>
          </ul>
          <button className="flex justify-end p-4 md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </header>
      <h1>TERMS AND CONDITIONS</h1>
    </div>
  );
}

export default TermsPage;
