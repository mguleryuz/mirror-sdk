import NextImage from 'next/image'
import { Components } from 'react-markdown'
import { Tweet } from 'react-tweet'
import { getImgSizes, isTweetEmbed } from './utils'
import { useIsHydrated } from '@/hooks'
import { Loading } from '@/react-daisyui'
import { cn } from '@/styles/utils'

const Image = ({ src }: any) => {
  const { width, height } = getImgSizes(src)
  return <NextImage width={width} height={height} src={src} alt="" />
}

const LinkOrEmbed = ({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isHydrated = useIsHydrated()

  if (!href) return null

  const tweetId = isTweetEmbed(href)
  if (tweetId)
    return !isHydrated ? <Loading className="m-3" /> : <Tweet id={tweetId} />

  const { rel, target, ...rest } = props
  return (
    <a
      {...rest}
      className={cn(props.className, 'text-primary')}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

const BlockQuote = ({ children }: any) => {
  return <blockquote className={'border-[primary]'}>{children}</blockquote>
}

export const components: Partial<Components> = {
  image: Image,
  a: LinkOrEmbed,
  blockquote: BlockQuote,
}
