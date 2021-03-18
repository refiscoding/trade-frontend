import { Flex, Image, Text } from '@chakra-ui/core'
import * as React from 'react'
import { ColorProps } from 'styled-system'
import images from '../../theme/images'
import moment from 'moment'
import { useHistory } from 'react-router'

type FooterProps = ColorProps & {}

const footerItems = [
  {
    title: 'Home',
    url: '/'
  },
  {
    title: 'My Account',
    url: '/profile'
  },
  {
    title: 'My Wish List',
    url: '/wishlist'
  },
  {
    title: 'About Us',
    url: '/about-us'
  },
  {
    title: 'Support',
    url: '/'
  }
]

const Footer: React.FC<FooterProps> = () => {
  const currentYear = moment().format('YYYY')
  const history = useHistory()
  return (
    <Flex
      width="100vw"
      height="150px"
      flexDirection="column"
      bg="accent.800"
      mt={10}
      mb="-1rem"
      alignItems="center"
    >
      <Flex m={2} mt={4} width="50%" justifyContent="space-evenly">
        <Image width="30px" height="30px" src={images.FacebookFooter} />
        <Image width="30px" height="30px" src={images.TwitterFooter} />
        <Image width="30px" height="30px" src={images.InstagramFooter} />
      </Flex>
      <Flex m={2} justifyContent="space-evenly">
        {footerItems.map((item, i) => (
          <Text
            onClick={() => history.push(item.url)}
            mx={2}
            color="white"
            fontSize="10px"
            textTransform="uppercase"
            key={i}
          >
            {item.title}
          </Text>
        ))}
      </Flex>
      <Text m={2} color="white" fontSize="10px" textTransform="uppercase">
        T’s & C’s for Buyers and Sellers
      </Text>
      <Text m={2} color="brand.100" fontSize="10px">
        {`© ${currentYear} TradeFed. All rights reserved`}
      </Text>
    </Flex>
  )
}

export default Footer
