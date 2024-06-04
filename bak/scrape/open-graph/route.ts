import utils from '@/lib/utils'
import { NextRequest } from 'next/server'
import ogs from '@/lib/ogs'

export const GET = (req: NextRequest) => {
  return utils.apiResponse(async () => {
    // get the query param url
    const url = req.nextUrl.searchParams.get('url')

    if (!url) throw new Error('No URL provided')

    const { result } = await ogs({
      url,
      onlyGetOpenGraphInfo: true,
    })

    return result
  })
}
