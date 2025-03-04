'use client'

import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share'

interface SharerSocialsType {
  url: string
}

export default function SharerSocials({ url }: SharerSocialsType) {
  return (
    <div className="my-6 border border-gray-100 rounded-xl bg-gray-50 p-4">
      <div className="flex gap-8 justify-center items-center">
        <h3>Bagikan :</h3>
        <div className="space-x-6 flex items-center">
          <FacebookShareButton url={url}>
            <FacebookIcon size={30} className="rounded-full" />
          </FacebookShareButton>
          <WhatsappShareButton url={url}>
            <WhatsappIcon size={30} className="rounded-full" />
          </WhatsappShareButton>
          <TwitterShareButton url={url}>
            <TwitterIcon size={30} className="rounded-full" />
          </TwitterShareButton>
        </div>
      </div>
    </div>
  )
}
