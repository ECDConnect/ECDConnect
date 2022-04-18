/**
 * Method to strip default <p>...</p> in string from CMS text.
 * This should be done in the CMS
 * #TODO remove <p></p> tag from string
 **/
export const stripPTag = (taggedString?: string) => {
  return taggedString
    ? taggedString.replaceAll('<p>', '').replaceAll('</p>', '')
    : '';
};
