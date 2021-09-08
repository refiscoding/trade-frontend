import * as React from 'react'

import { useMediaQuery } from 'react-responsive'
import { Flex, Grid, Tag } from '@chakra-ui/core'

import { theme } from '../../theme'
import { Text } from '../../typography'
import { PageWrap } from '../../layouts'
import { useAuthContext } from '../../context/AuthProvider'

type AddressBookProps = {}

const AddressBook: React.FC<AddressBookProps> = () => {
  const { user } = useAuthContext()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  return (
    <PageWrap
      title="My Address Book"
      height="100vh"
      justifyContent="space-between"
      alignSelf="center"
    >
      <Flex justify="space-between" flexDirection="column">
        <Text mb={4} fontWeight={550} fontSize={14} textAlign="center">
          My Addresses
        </Text>
        <Flex width="100%" flexDirection="column" p={3}>
          {user?.address?.map((address, index) => (
            <Grid
              gridTemplateRows="30px 1fr 1fr"
              borderRadius={5}
              key={`${index}_address`}
              background={theme.colors.accent[50]}
              boxShadow={theme.boxShadowMedium}
              minWidth={`${isTabletOrMobile ? '400px' : '600px'}`}
              p={4}
              mb={5}
            >
              <Grid gridTemplateColumns="1fr 90px" width="100%">
                <Text fontWeight={550} fontSize={14}>
                  {address?.name}
                </Text>
                <Tag
                  fontSize={11}
                  size="sm"
                  background={theme.colors.tag}
                  color={theme.colors.tagText}
                  justifySelf="start"
                >
                  {address?.type?.toUpperCase()}
                </Tag>
              </Grid>
              <Text mt={3} fontSize={12}>
                {address?.province || ''} - {address?.city || ''} - {address?.suburb || ''}
              </Text>
              <Text fontSize={12}>{address?.postalCode}</Text>
            </Grid>
          ))}
        </Flex>
      </Flex>
    </PageWrap>
  )
}

export default AddressBook
