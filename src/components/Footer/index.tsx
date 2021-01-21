import { Flex, Image, Text } from '@chakra-ui/core'
import * as React from 'react'
import { ColorProps } from 'styled-system'
import { Facebook, Instagram, Twitter } from 'react-feather'
import { Card } from '../index'
import images from '../../theme/images'

type FooterProps = ColorProps & {}

const footerItems = [
  {
    title: 'Home',
    url: '/dashboard'
  },
  {
    title: 'My Account',
    url: '/dashboard'
  },
  {
    title: 'My Wish List',
    url: '/dashboard'
  },
  {
    title: 'About Us',
    url: '/dashboard'
  },
  {
    title: 'Support',
    url: '/dashboard'
  }
]

const Footer: React.FC<FooterProps> = () => {
  return (
    <Flex
      width="100vw"
      height="150px"
      flexDirection="column"
      bg="accent.800"
      mt={10}
      ml="-1rem"
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
          <Text mx={2} color="white" fontSize="10px" textTransform="uppercase" key={i}>
            {item.title}
          </Text>
        ))}
      </Flex>
      <Text m={2} color="white" fontSize="10px" textTransform="uppercase">
        T’s & C’s for Buyers and Sellers
      </Text>
      <Text m={2} color="brand.100" fontSize="10px">
        © 2020 TradeFed. All rights reserved
      </Text>
    </Flex>
  )
}

export default Footer
