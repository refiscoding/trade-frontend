import * as React from 'react'
import { ColorProps } from 'styled-system'
import { Flex } from '@chakra-ui/core'
import { useMediaQuery } from 'react-responsive'

type AboutProps = ColorProps & {
  image?: string
}

const About: React.FC<AboutProps> = ({ image }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Flex
      width="100vw"
      minHeight={isTabletOrMobile ? '450px' : '400px'}
      flexDirection="column"
      alignItems="center"
    >
      <Flex
        width="100%"
        minHeight={isTabletOrMobile ? '400px' : '400px'}
        mr={4}
        backgroundImage={`url(${image})`}
        backgroundPosition="center"
        backgroundSize={isTabletOrMobile ? 'contain' : 'cover'}
        backgroundRepeat="no-repeat"
      ></Flex>
    </Flex>
  )
}

export default About
