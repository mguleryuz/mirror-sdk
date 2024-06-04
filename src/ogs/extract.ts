import { load } from 'cheerio'

import fallback from './fallback'
import fields from './fields'
import mediaSetup from './media'

import type { OgObjectInteral, OpenGraphScraperOptions } from './types'

/**
 * extract all of the meta tags needed for ogs
 *
 * @param {sting} body - the body of the fetch request
 * @param {object} options - options for ogs
 * @return {object} object with ogs results
 *
 */
export default function extractMetaTags(
  body: string,
  options: OpenGraphScraperOptions
) {
  let ogObject: OgObjectInteral = {}
  const $ = load(body)
  const metaFields = fields.concat(options.customMetaTags || [])

  // find all of the open graph info in the meta tags
  $('meta').each((index, meta) => {
    if (!meta.attribs || (!meta.attribs.property && !meta.attribs.name)) return
    const property = meta.attribs.property || meta.attribs.name
    const content = meta.attribs.content || meta.attribs.value
    metaFields.forEach((item) => {
      if (item && property.toLowerCase() === item.property.toLowerCase()) {
        if (!item.multiple) {
          // @ts-ignore
          ogObject[item.fieldName] = content
          // @ts-ignore
        } else if (!ogObject[item.fieldName]) {
          // @ts-ignore
          ogObject[item.fieldName] = [content]
          // @ts-ignore
        } else if (Array.isArray(ogObject[item.fieldName])) {
          // @ts-ignore
          ogObject[item.fieldName].push(content)
        }
      }
    })
  })

  // take all of the customMetaTags out of base of ogObject and store them into ogObject.customMetaTags
  if (options.customMetaTags) {
    options.customMetaTags.forEach((customMetaTag) => {
      // @ts-ignore
      if (ogObject[customMetaTag.fieldName]) {
        ogObject.customMetaTags = {
          ...ogObject.customMetaTags,
          // @ts-ignore
          [customMetaTag.fieldName]: ogObject[customMetaTag.fieldName],
        }
        // @ts-ignore
        delete ogObject[customMetaTag.fieldName]
      }
    })
  }

  // formats the multiple media values
  ogObject = mediaSetup(ogObject)

  // if onlyGetOpenGraphInfo isn't set, run the open graph fallbacks
  if (!options.onlyGetOpenGraphInfo) {
    ogObject = fallback(ogObject, options, $, body)

    $('script').each((index, script) => {
      if (
        script.attribs.type &&
        script.attribs.type === 'application/ld+json'
      ) {
        if (!ogObject.jsonLD) ogObject.jsonLD = []
        ogObject.jsonLD.push(JSON.parse($(script).text()))
      }
    })
  }

  return ogObject
}
