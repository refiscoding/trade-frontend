import { Image } from '@chakra-ui/core'
import * as React from 'react'
import { images } from '../../theme'
import { H2, H4 } from '../../typography'
import Card from '../Card'
import RevealFlex from '../RevealFlex/index'

type EmptyListHandlerProps = {
  title?: string
  subTitle?: string
}

const EmptyListHandler: React.FC<EmptyListHandlerProps> = ({ title, subTitle }) => {
  return (
    <Card
      p={4}
      flex={1}
      width="100%"
      align="center"
      maxWidth="100%"
      justify="center"
      flexDirection="column"
    >
      <RevealFlex>
        <Image src={images.noData} width="300px" maxWidth="100%" height="auto" />
        <H2 my={3} fontWeight="bold">
          {title}
        </H2>
        <H4 textAlign="center">{subTitle}</H4>
      </RevealFlex>
    </Card>
  )
}

export default EmptyListHandler

EmptyListHandler.defaultProps = {
  title: 'Nothing to see here, yet.',
  subTitle: 'Go ahead and create your first record to get started.'
}
