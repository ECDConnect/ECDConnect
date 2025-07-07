import { useEffect, useMemo, useState } from 'react';
import logo from '../../../assets/Logo-ECDConnect-white.svg';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { useHistory } from 'react-router';
import { LoadingSpinner, Typography } from '@ecdlink/ui';
import { Config, ContentConsentTypeEnum } from '@ecdlink/core';
import { LanguagesModels } from './terms-types';
import LanguageSelector from '../../components/language-selector/language-selector';

export function TermsPage(props: any) {
  const [content, setContent] = useState(null);
  const history = useHistory();
  const languages = LanguagesModels;
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    languages?.find((item) => item?.locale === 'en-za')?.id
  );

  const selectedLocale = useMemo(
    () => languages?.find((item) => item?.id === selectedLanguage)?.locale,
    [languages, selectedLanguage]
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append('Referer', Config.authApi);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      operationName: 'openConsent',
      variables: {
        locale: selectedLocale,
        type: ContentConsentTypeEnum.AdminTermsAndConditions,
      },
      query:
        'query openConsent($locale: String, $name: String) {  openConsent(locale: $locale, name: $name) {    id    name    type    description  }}',
    });
    setIsLoading(true);
    fetch(Config.graphQlApi, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        setContent(result?.data?.openConsent[0].description);
        setErrorMessage('');
        setIsLoading(false);
      })
      .catch((error) => {
        console.log('error', error);
        setErrorMessage("There's no consent in the language selected.");
        setIsLoading(false);
      });
  }, [selectedLocale]);

  return (
    <div>
      <header className="bg-primary static">
        <div className="container mx-auto flex h-16 justify-between">
          <div className="visible items-stretch sm:flex  md:flex lg:flex">
            <button
              onClick={() => history.goBack()}
              type="button"
              className="text-secondary outline-none text-14 inline-flex w-16 cursor-pointer items-center border border-transparent px-4 py-2 font-medium "
            >
              <ArrowLeftIcon className="mr-1 text-white md:h-6 md:w-6" />
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

      <div className="h-100vh flex flex-col items-center justify-center">
        <div className="bg-adminPortalBg w-full px-12 py-4">
          <div className="justify-left my-4 mt-2 flex w-6/12 items-center gap-2">
            <Typography type={'body'} text={'Change language:'} />
            <LanguageSelector
              languages={languages}
              selectLanguage={setSelectedLanguage}
              currentLanguageId={selectedLanguage}
              disabled={false}
            />
          </div>
        </div>
        <div
          className="p-12"
          style={{
            height: '100vh' /* Adjust the height as needed */,
            overflow: ' auto',
          }}
        >
          {isLoading && (
            <LoadingSpinner
              size="big"
              className="my-12 p-4"
              spinnerColor="white"
              backgroundColor="secondary"
            />
          )}
          {content && !errorMessage && !isLoading && (
            <Typography type={'markdown'} text={content} className="w-full" />
          )}
          {errorMessage && !isLoading && (
            <Typography
              type={'markdown'}
              text={errorMessage}
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
