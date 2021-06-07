import * as React from 'react'

import styled from "@emotion/styled";

import { useHistory } from 'react-router'
import { useMediaQuery } from "react-responsive";
import { Flex, Text, useToast } from '@chakra-ui/core'
import { ChevronRight, Facebook, Instagram, Twitter } from 'react-feather'

import Section from '../../components/Section'

import { theme } from "../../theme";
import { PageWrap } from '../../layouts'

import { useFetchLegalitiesQuery } from '../../generated/graphql';
import { ApolloError } from 'apollo-client';
import { ERROR_TOAST } from '../../constants';

type LinkProps = {
  boxShadow: string
  background: string
  mt?: string
}

const Link = styled.a<LinkProps>`
  width: 100%;
  padding: .8rem;
  border-radius: .4rem;
  margin-top: ${props => props.mt};
  background: ${props => props.background};
  box-shadow: ${props => props.boxShadow};
`;

const AboutUs: React.FC = () => {
  const toast = useToast();
  const history = useHistory()

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const { data: legalities } = useFetchLegalitiesQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  });

  const privacyPolicyFile = legalities?.legality?.privacyPolicyFile?.url;
  const termsAndConditionsFile = legalities?.legality?.termsAndConditionsFile?.url;

  return (
    <PageWrap title="About Us" alignSelf="center" width={isTabletOrMobile ? '100%' : '40%'}>
      <Section my={1} title="About Us" bg="transparent" width="100%" >
        <Link href={privacyPolicyFile} target="_blank" rel="noopener noreferrer" boxShadow={theme.boxShadowMedium} background={theme.colors.accent[50]}>
          <Flex width="100%" justify="space-between">
            <Text fontSize={12}>Privacy Policy</Text>
            <ChevronRight />
          </Flex>
        </Link>
        <Link href={termsAndConditionsFile} target="_blank" rel="noopener noreferrer" boxShadow={theme.boxShadowMedium} background={theme.colors.accent[50]} mt="20px">
          <Flex width="100%" justify="space-between">
            <Text fontSize={12}>Terms of Service</Text>
            <ChevronRight />
          </Flex>
        </Link>
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
