import { MirrorPost, PublicationResponse, TransactionsResponse } from '../types'
import configs from './configs'

async function transactions(address: string): Promise<TransactionsResponse> {
  const { url, options } = configs.arweave.transactions(100, [address]),
    res = await fetch(url, options),
    json = await res.json()

  return json
}

async function singleTransaction(
  transaction: string
): Promise<TransactionsResponse> {
  const { url, options } = configs.arweave.transaction([transaction]),
    res = await fetch(url, options),
    json = await res.json()

  return json
}

async function post(transactionId: string): Promise<MirrorPost> {
  const res = await fetch(`https://arweave.net/${transactionId}`),
    json = await res.json()

  return json
}

async function publication(
  publicationAddress: string
): Promise<PublicationResponse> {
  const { url, options } = configs.mirror.publication(publicationAddress),
    response = await fetch(url, options),
    res = await response.json()

  return res
}

export default {
  transactions,
  singleTransaction,
  post,
  publication,
}
