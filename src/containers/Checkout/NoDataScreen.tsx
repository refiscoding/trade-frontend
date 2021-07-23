import * as React from 'react'

import InfoPage from '../../components/InfoPage'

import { images } from '../../theme'

type NoDataComponentProps = {
  header: string
  caption: string
  image?: string
}

const NoDataComponent: React.FC<NoDataComponentProps> = ({ header, caption, image }) => {
  return (
    <InfoPage
      smallIcon={image ? true : false}
      image={image ? image : images.emptyWishlist}
      header={header}
      caption={caption}
    />
  )
}

export default NoDataComponent
