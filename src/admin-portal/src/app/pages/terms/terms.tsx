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
          <ul className="items-stretch hidden space-x-3 md:flex">
            <li className="flex">
              <a rel="noopener noreferrer" href="#" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent">Link</a>
            </li>
            <li className="flex">
              <a rel="noopener noreferrer" href="#" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent">Link</a>
            </li>
            <li className="flex">
              <a rel="noopener noreferrer" href="#" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent dark:text-violet-400 dark:border-violet-400">Link</a>
            </li>
            <li className="flex">
              <a rel="noopener noreferrer" href="#" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent">Link</a>
            </li>
          </ul>
          <button className="flex justify-end p-4 md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </header>
      <h1>TERMS AND CONDITIONS</h1>
    </div>
  );
}

export default TermsPage;
