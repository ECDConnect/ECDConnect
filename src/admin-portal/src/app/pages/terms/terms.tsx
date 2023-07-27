import { useEffect, useState } from 'react';
import logo from '../../../assets/Logo-ECDConnect-white.svg';
import { ArrowLeftIcon, XIcon } from '@heroicons/react/solid';
import { useHistory } from 'react-router';
import { Typography } from '@ecdlink/ui';
import { Config } from '@ecdlink/core';

export function TermsPage(props: any) {
  const [content, setContent] = useState(null);
  const history = useHistory();

  console.log(Config);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append('Referer', Config.authApi);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      operationName: 'openConsent',
      variables: {
        locale: 'en-za',
        type: 'TermsAndConditions',
      },
      query:
        'query openConsent($locale: String, $type: String) {  openConsent(locale: $locale, type: $type) {    id    name    type    description  }}',
    });

    fetch(Config.graphQlApi, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => setContent(result?.data?.openConsent[0].description))
      .catch((error) => console.log('error', error));
  });

  return (
    <div>
      <header className="bg-primary static">
        <div className="container mx-auto flex h-16 justify-between">
          <div className="hidden items-stretch  lg:flex">
            <button
              onClick={() => history.goBack()}
              type="button"
              className="text-secondary outline-none text-14 inline-flex w-full cursor-pointer items-center border border-transparent px-4 py-2 font-medium "
            >
              <ArrowLeftIcon className="mr-1 text-white md:h-6 md:w-6">
                {' '}
              </ArrowLeftIcon>
            </button>
          </div>
          <a
            rel="noopener noreferrer"
            href="/"
            aria-label="Back to homepage"
            className="flex items-center p-2"
          >
            <img className="h-100 w-150" src={logo} alt="Login Logo" />
          </a>
          <div className="flex items-center md:space-x-4"></div>
          <button title="Open menu" type="button" className="p-4 lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6 dark:text-gray-100"
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

      <div className="flex h-screen flex-col items-center justify-center">
        <div
          className="p-12 pr-60"
          style={{
            height: '100vh' /* Adjust the height as needed */,
            overflow: ' auto',
          }}
        >
          {content && (
            <Typography type={'markdown'} text={content} className="w-full" />
          )}
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
