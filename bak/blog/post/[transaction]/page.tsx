// 'use server'

// import mirror, { MirrorPath } from '@/lib/mirrorxyz'
// import type { Metadata } from 'next'
// import PageClient from './page.client'

// type PageProps = {
//   params: {
//     transaction: MirrorPath['transaction']
//   }
// }

// const publicationAddress = '0x3F625b93426D0e7EE44DB267D08A0b6534882E09'
// // const publicationAddress = '0x488fAc2445f84953723eDCC3D31DCBEa63752411'

// // Return a list of `params` to populate the [slug] dynamic segment
// export async function generateStaticParams() {
//   const paths = await mirror.postPaths(publicationAddress)

//   return paths.map(({ transaction }) => ({ transaction }))
// }

// export async function generateMetadata({
//   params,
// }: PageProps): Promise<Metadata> {
//   // read route params
//   const { transaction } = params

//   try {
//     // fetch data
//     const { title: description, cover_image: image } = await mirror.cachedPost(
//       transaction,
//       publicationAddress,
//       'server'
//     )

//     if (!image) throw new Error('No image found')

//     const images = [
//       {
//         url: image,
//       },
//     ]

//     const title = 'Inverter Network'
//     const applicationName = `${title} | Blog`

//     return {
//       metadataBase: new URL('https://images.mirror-media.xyz/'),
//       title,
//       applicationName,
//       description,
//       openGraph: {
//         type: 'article',
//         title,
//         siteName: applicationName,
//         description: description!,
//         images,
//       },
//       twitter: {
//         card: 'summary_large_image',
//         description: description!,
//         title: applicationName,
//         images,
//       },
//     }
//   } catch {
//     return {}
//   }
// }

// export default async function Article({ params }: PageProps) {
//   const { transaction } = params
//   const data = await mirror.cachedPost(
//     transaction,
//     publicationAddress,
//     'server'
//   )

//   return <PageClient post={data} />
// }
