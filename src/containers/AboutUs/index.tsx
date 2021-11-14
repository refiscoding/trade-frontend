import * as React from 'react'

import styled from '@emotion/styled'

import { useHistory } from 'react-router'
import { useMediaQuery } from 'react-responsive'
import { Flex, Text, useToast } from '@chakra-ui/core'
import { ChevronRight, Facebook, Linkedin, Book, BookOpen } from 'react-feather'

import Section from '../../components/Section'

import { images, theme } from '../../theme'
import { PageWrap } from '../../layouts'

import { useFetchLegalitiesQuery } from '../../generated/graphql'
import { ApolloError } from 'apollo-client'
import { ERROR_TOAST } from '../../constants'
import About from '../../components/About'

type LinkProps = {
  boxShadow: string
  background: string
  mt?: string
  ml?: string
}

const Link = styled.a<LinkProps>`
  width: 100%;
  padding: 0.8rem;
  border-radius: 0.4rem;
  margin-left: ${(props) => props.ml};
  margin-top: ${(props) => props.mt};
  background: ${(props) => props.background};
  box-shadow: ${(props) => props.boxShadow};
`

const AboutUs: React.FC = () => {
  const toast = useToast()
  const history = useHistory()

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const { data: legalities } = useFetchLegalitiesQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const privacyPolicyFile = legalities?.legality?.privacyPolicyFile?.url
  const termsAndConditionsFile = legalities?.legality?.termsAndConditionsFile?.url

  const facebookLink = 'https://www.facebook.com/tradeFed'
  const linkedInLink = 'https://www.linkedin.com/company/tradeFedsolutions/'

  return (
    <PageWrap title="About Us" alignSelf="center">
      <About image={isTabletOrMobile ? null : images.aboutUsBanner} />
      <Section bg="transparent" width="40%" ml="30%">
        <Link
          href={privacyPolicyFile || ''}
          target="_blank"
          rel="noopener noreferrer"
          boxShadow={theme.boxShadowMedium}
          background={theme.colors.accent[50]}
        >
          <Flex>
            <Book />
            <Flex ml={3} width="100%" justify="space-between">
              <Text fontSize={12}>Privacy Policy</Text>
              <ChevronRight />
            </Flex>
          </Flex>
        </Link>
        <Link
          href={termsAndConditionsFile || ''}
          target="_blank"
          rel="noopener noreferrer"
          boxShadow={theme.boxShadowMedium}
          background={theme.colors.accent[50]}
          mt="20px"
        >
          <Flex>
            <BookOpen />
            <Flex ml={3} width="100%" justify="space-between">
              <Text fontSize={12}>Terms of Service</Text>
              <ChevronRight />
            </Flex>
          </Flex>
        </Link>
      </Section>
      <Section my={1} title="What is tradeFed all about? " bg="transparent" width="100%">
        <Text fontSize={14}>
          tradeFed is a B2B (Business to Business) as well as a B2C (Business to Customer) platform.
          We focus on selling products in bulk at an affordable price that benefits both the sellers
          and the buyers.
          <br />
          The products on our platform comes directly form retailers, distributors and manufacturers
          from across the world for your convenience.
          <br />
          Do you want to become a seller? Do you have access or dead stock you can’t seem to get rid
          of? Complete an application to become a seller at tradeFed{' '}
          <span onClick={() => history.push('/register')}>here</span>.
        </Text>
      </Section>
      <Flex mt={5} width="60%" alignSelf="center" justifyContent="space-around">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={facebookLink}
          style={{
            border: '2px solid black',
            borderRadius: '50%',
            height: 50,
            width: 50,
            padding: 5,
            position: 'relative'
          }}
        >
          <Facebook style={{ position: 'absolute', top: 10, left: 10 }} fill="black" />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={linkedInLink}
          style={{
            border: '2px solid black',
            borderRadius: '50%',
            height: 50,
            width: 50,
            padding: 5,
            position: 'relative'
          }}
        >
          <Linkedin style={{ position: 'absolute', top: 10, left: 10 }} fill="black" />
        </a>
      </Flex>
    </PageWrap>
  )
}

export default AboutUs
