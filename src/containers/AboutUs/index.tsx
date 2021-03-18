import { Flex, Text } from '@chakra-ui/core'
import * as React from 'react'
import { ChevronRight, Facebook, Instagram, Twitter } from 'react-feather'

import { PageWrap } from '../../layouts'
import Section from '../../components/Section'
import { useHistory } from 'react-router'
import {useMediaQuery} from "react-responsive";

const AboutUs: React.FC = () => {
  const history = useHistory()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const handleLinks = () => {
    window.location.href = 'https://tradefed.co.za/about-us'
  }

  return (
    <PageWrap title="About Us" alignSelf="center" width={isTabletOrMobile ? '100%' : '40%'}>
      <Section my={1} title="About Us" bg="transparent" width="100%" >
        <Flex
          pl={5}
          height="50px"
          borderRadius="10px"
          boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)"
          width="100%"
          justify="space-between"
          alignItems="center"
          onClick={() => handleLinks()}
        >
          <Flex width="80%">
            <Text fontSize={12}>Privacy Policy</Text>
          </Flex>
          <ChevronRight />
        </Flex>
        <Flex
          mt={5}
          pl={5}
          height="50px"
          borderRadius="10px"
          boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)"
          width="100%"
          justify="space-between"
          alignItems="center"
          onClick={() => handleLinks()}
        >
          <Flex width="80%">
            <Text fontSize={12}>Terms of Service</Text>
          </Flex>
          <ChevronRight />
        </Flex>
      </Section>
      <Section my={1} title="What is TradeFed all about? " bg="transparent" width="100%">
        <Text fontSize={14}>
          TradeFed is a B2B (Business to Business) as well as a B2C (Business to Customer) platform.
          We focus on selling products in bulk at an affordable price that benefits both the sellers
          and the buyers.
          <br />
          The products on our platform comes directly form retailers, distributors and manufacturers
          from across the world for your convenience.
          <br />
          Do you want to become a seller? Do you have access or dead stock you can’t seem to get rid
          of? Complete an application to become a seller at TradeFed{' '}
          <span onClick={() => history.push('/register')}>here</span>.
        </Text>
      </Section>
      <Flex mt={5} width="60%" alignSelf="center" justifyContent="space-around">
        <Flex
          justifyContent="center"
          alignItems="center"
          height="40px"
          width="40px"
          borderRadius="50%"
          border="3px solid"
          borderColor="black"
        >
          <Facebook fill="black" />
        </Flex>
        <Flex
          justifyContent="center"
          alignItems="center"
          height="40px"
          width="40px"
          borderRadius="50%"
          border="3px solid"
          borderColor="black"
        >
          <Twitter fill="black" />
        </Flex>
        <Flex
          justifyContent="center"
          alignItems="center"
          height="40px"
          width="40px"
          borderRadius="50%"
          border="3px solid"
          borderColor="black"
        >
          <Instagram strokeWidth="3px" stroke="black" />
        </Flex>
      </Flex>
    </PageWrap>
  )
}

export default AboutUs
