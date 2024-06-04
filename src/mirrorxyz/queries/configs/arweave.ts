const url = 'https://arweave.net/graphql'

const transactions = (first: number, addresses: string[]) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
              {
                  transactions(
                    first: ${first}
                      tags: [
                          {
                              name: "App-Name",
                              values: ["MirrorXYZ"],
                          },
                          {
                              name: "Contributor",
                              values: ${JSON.stringify(addresses)}
                          }
                      ]
                      sort: HEIGHT_DESC) {
                          edges {
                              node {
                                  id
                                  block {
                                    timestamp
                                  }
                                  tags {
                                    name
                                    value
                                  }
                              }
                          }
                      }
              }
          `,
    }),
  }

  return { url, options }
}

const transaction = (transactions: string[]) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
      {
        transactions(
          tags: [
            {
              name: "App-Name",
              values: ["MirrorXYZ"]
            },
            {
              name: "Original-Content-Digest",
              values: ${JSON.stringify(transactions)}
            }
          ]
        ) {
          edges {
            node {
              id
              block {
                timestamp
              }
            }
          }
        }
      }
      `,
    }),
  }

  return { url, options }
}

export default {
  transactions,
  transaction,
}
