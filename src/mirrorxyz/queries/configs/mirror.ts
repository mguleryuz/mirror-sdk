const url = 'https://mirror-api.com/graphql'

const publication = (publicationAddress: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      origin: 'https://mirror.xyz',
    },
    body: JSON.stringify({
      query: `
          query PublicationInfo($publicationAddress: String!) {
              projectFeed(projectAddress: $publicationAddress) {
                  displayName
                  avatarURL
                  domain
                  headerImage {
                      url
                  }
                  theme {
                      colorMode
                      accent
                  }
                  description
                  mailingListURL
                  members {
                      address
                      displayName
                      avatarURL
                  }
              }
          }
      `,
      variables: { publicationAddress },
    }),
  }

  return { url, options }
}

export default {
  publication,
}
