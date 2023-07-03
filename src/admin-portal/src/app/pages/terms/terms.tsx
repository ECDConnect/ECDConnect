import { useEffect, useState } from 'react';
import logo from '../../../assets/Logo-ECDConnect-white.svg';
import { ArrowLeftIcon, XIcon } from '@heroicons/react/solid';
import { useHistory } from 'react-router';

export function TermsPage(props: any) {
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  return (
    <div className="">

      <header className="bg-primary static">
        <div className="container flex justify-between h-16 mx-auto">
          <div className="items-stretch hidden  lg:flex">
            <button
              onClick={() => history.goBack()}
              type="button"
              className="text-secondary outline-none text-14 inline-flex w-full cursor-pointer items-center border border-transparent px-4 py-2 font-medium "
            >
              <ArrowLeftIcon className="text-white mr-1 md:h-6 md:w-6">
                {' '}
              </ArrowLeftIcon>

            </button>
          </div>
          <a rel="noopener noreferrer" href="/" aria-label="Back to homepage" className="flex items-center p-2">
            <img className="h-100 w-150" src={logo} alt="Login Logo" />

          </a>
          <div className="flex items-center md:space-x-4">


          </div>
          <button title="Open menu" type="button" className="p-4 lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 dark:text-gray-100">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </header>

      <div className='p-14'>
        <div className='py-4'>
          <h1 className='text-xl font-bold'>TERMS AND CONDITIONS</h1>

          <p className="text-normal">Items in these Terms and Conditions that are of importance or that carry a level of risk for you are in bold. Please pay special attention to these clauses and make sure you understand them. If you don’t understand something please get us to explain it to you.</p>
        </div>

        <div className='py-6'>
          <h1 className='text-md font-bold'>1. Definitions</h1>

        </div>

        <div className='py-6'>
          <h1 className='text-md font-bold'>2. Commencement, Duration, Termination</h1>

        </div>

        <div className='py-6'>
          <h1 className='text-md font-bold'>3. ECT Act</h1>

        </div>

        <div className='py-6'>
          <h1 className='text-md font-bold'>4. Conditions of access</h1>

        </div>

        <div className='py-6'>
          <h1 className='text-md font-bold'>5.	Service Delivery, Service Availability </h1>

        </div>

        <div className='py-6'>
          <h1 className='text-md font-bold'>6.	Communication, Complaints Handling and Dispute Resolution </h1>

        </div>

        <div className='py-6'>
          <h1 className='text-md font-bold'>7.	Software </h1>

        </div>

        <div className='py-6'>
          <h1 className='text-md font-bold'>8.	Security and Privacy</h1>

        </div>

        <div className='py-6'>
          <h1 className='text-md font-bold'>9.	POPIA </h1>

        </div>

        <div className='py-6'>
          <h1 className='text-md font-bold'>10.	Intellectual Property Rights </h1>

        </div>

        <div className='py-6'>
          <h1 className='text-md font-bold'>11.	Intellectual Property Rights </h1>

        </div>
        <div className='py-6'>
          <h1 className='text-md font-bold'>12.	Intellectual Property Rights </h1>

        </div>
        <div className='py-6'>
          <h1 className='text-md font-bold'>13.	Intellectual Property Rights </h1>

        </div>
      </div>
    </div>
  );
}

export default TermsPage;
