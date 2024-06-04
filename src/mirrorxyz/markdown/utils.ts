export function isTweetEmbed(urlString: string) {
  try {
    const url = new URL(urlString)
    const pathParts = url.pathname.split('/')

    if (
      ['twitter.com', 'x.com'].includes(url.hostname) &&
      pathParts[2] === 'status'
    )
      return pathParts[3] // Return the tweet ID
  } catch (e) {
    // Invalid URL
  }
  return null
}

export const getImgSizes = (src: string) => {
  const url = new URL(src),
    params = new URLSearchParams(url.search),
    width = Number(params.get('width')) || 1000,
    height = Number(params.get('height')) || 500

  return { width, height }
}
