export type ConfigType = {
  graphQlApi: string;
  authApi: string;
  themeUrl: string;
  facebookAppId: string | undefined;
  googleClientId: string | undefined;
  configUrl: string | undefined;
  // Testing aid: when true, non-production environments may surface the OA sign-up
  // auth code in the UI. Absent/false in production so the extra request is never made.
  exposeAuthCodesForTesting?: boolean;
};

export const Config: ConfigType = {
  graphQlApi: '',
  authApi: '',
  themeUrl: '',
  facebookAppId: '',
  googleClientId: '',
  configUrl: '',
  exposeAuthCodesForTesting: false,
};

export const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['clean'], // remove formatting button
];

// export const toolbarOptions = [
//   ['bold', 'italic', 'underline', 'strike'],
//   [{ align: [] }],

//   [{ list: 'ordered' }, { list: 'bullet' }],
//   [{ indent: '-1' }, { indent: '+1' }],

//   [{ size: ['small', false, 'large', 'huge'] }],
//   [{ header: [1, 2, 3, 4, 5, 6, false] }],
//   ['link', 'image', 'video'],
//   [{ color: [] }, { background: [] }],

//   ['clean'], // remove formatting button
// ];
