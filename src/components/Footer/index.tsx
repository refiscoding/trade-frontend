import * as React from 'react'

import dayjs from 'dayjs'

import { useHistory } from 'react-router'
import { ColorProps } from 'styled-system'
import { Facebook, Linkedin } from 'react-feather'
import { Flex, Text } from '@chakra-ui/core'

type FooterProps = ColorProps & {
  removePadding?: boolean
}

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
    url: '/user-support'
  }
]

const Footer: React.FC<FooterProps> = ({ removePadding }) => {
  const currentYear = dayjs().format('YYYY')
  const history = useHistory()

  const facebookLink = 'https://www.facebook.com/TradeFed'
  const linkedInLink = 'https://www.linkedin.com/company/tradefedsolutions/'

  const handleLegalDocuments = () => {
    history.push('/about-us')
  }

  return (
    <Flex
      width="100vw"
      height="150px"
      flexDirection="column"
      bg="accent.800"
      mt={10}
      mb="-1rem"
      alignItems="center"
      ml={removePadding ? '-16px' : 0}
    >
      <Flex mt={3} width="20%" alignSelf="center" justifyContent="space-around">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={facebookLink}
          style={{
            border: '2px solid white',
            borderRadius: '50%',
            height: 50,
            width: 50,
            padding: 5,
            position: 'relative'
          }}
        >
          <Facebook
            style={{ position: 'absolute', top: 10, left: 10 }}
            fill="white"
            stroke="white"
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={linkedInLink}
          style={{
            border: '2px solid white',
            borderRadius: '50%',
            height: 50,
            width: 50,
            padding: 5,
            position: 'relative'
          }}
        >
          <Linkedin
            style={{ position: 'absolute', top: 10, left: 10 }}
            fill="white"
            stroke="white"
          />
        </a>
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
            cursor="pointer"
          >
            {item.title}
          </Text>
        ))}
      </Flex>
      <Text
        onClick={handleLegalDocuments}
        cursor="pointer"
        color="white"
        fontSize="10px"
        textTransform="uppercase"
      >
        Legal Documents
      </Text>
      <Text m={2} color="brand.100" fontSize="10px">
        {`© ${currentYear} TradeFed. All rights reserved`}
      </Text>
    </Flex>
  )
}

export default Footer
