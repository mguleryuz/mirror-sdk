import extractMetaTags from './extract';
import requestAndResultsFormatter from './request';
import {
  defaultUrlValidatorSettings,
  isCustomMetaTagsValid,
  isThisANonHTMLUrl,
  optionSetup,
  validateAndFormatURL,
} from './utils';
import type { OpenGraphScraperOptions } from './types';

/**
 * sets up options for the fetch request and calls extract on html
 *
 * @param {object} options - options for ogs
 * @return {object} object with ogs results
 *
 */
export default async function setOptionsAndReturnOpenGraphResults(ogsOptions: OpenGraphScraperOptions) {
  const { options } = optionSetup(ogsOptions);

  if (options.html && options.url) throw new Error('Must specify either `url` or `html`, not both');

  if (options.html) {
    const ogObject = extractMetaTags(options.html, options);
    ogObject.success = true;
    return { ogObject, response: { body: options.html }, html: options.html };
  }

  const formattedUrl = validateAndFormatURL(options.url || '', (options.urlValidatorSettings || defaultUrlValidatorSettings));

  if (!formattedUrl.url) throw new Error('Invalid URL');

  if (!isCustomMetaTagsValid(options.customMetaTags || [])) throw new Error('Invalid Custom Meta Tags');

  options.url = formattedUrl.url;

  // trying to limit non html pages
  if (isThisANonHTMLUrl(options.url)) throw new Error('Must scrape an HTML page');

  // eslint-disable-next-line max-len
  if (options.blacklist && options.blacklist.some((blacklistedHostname) => options.url?.includes(blacklistedHostname))) {
    throw new Error('Host name has been black listed');
  }

  try {
    const { body, response } = await requestAndResultsFormatter(options);
    const ogObject = extractMetaTags(body, options);

    ogObject.requestUrl = options.url;
    ogObject.success = true;

    return { ogObject, response, html: body };
  } catch (exception: any) {
    if (exception && (exception.code === 'ENOTFOUND' || exception.code === 'EHOSTUNREACH' || exception.code === 'ENETUNREACH')) {
      throw new Error('Page not found');
    } else if (exception && (exception.name === 'AbortError')) {
      throw new Error('The operation was aborted due to timeout');
    }
    if (exception instanceof Error) throw exception;
    throw new Error('Page not found');
  }
}
