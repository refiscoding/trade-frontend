import * as React from 'react'
import { Flex, Text } from '@chakra-ui/core'
import { useMediaQuery } from 'react-responsive'

import { UsersPermissionsUser } from '../../generated/graphql'
import { VerifiedBadge, PendingVerificationBadge, BuyerBadge } from '../../components/Product'

type ProfileProps = {
  user?: UsersPermissionsUser
}

const PersonalDetailsComponent: React.FC<ProfileProps> = ({ user }) => {
  const isWebViewport = useMediaQuery({
    query: '(min-width: 40em)'
  })
  const styles = {
    width: isWebViewport ? '40%' : '100%',
    justifySelf: isWebViewport ? 'center' : ''
  }
  const getAccountType = (isSeller: string) => {
    if (isSeller === 'none') {
      return <BuyerBadge />
    } else if (isSeller === 'pending') {
      return <PendingVerificationBadge />
    } else if (isSeller === 'approved') {
      return <VerifiedBadge />
    }
  }
  return (
    <Flex
      mt={3}
      pl={5}
      borderBottom="1px solid"
      borderTop="1px solid"
      borderColor="brand.50"
      width={styles.width}
      alignSelf={styles.justifySelf}
      flexDirection="column"
    >
      <Flex height="40px" width="100%" alignItems="center">
        <Flex width="30%">
          <Text fontSize={12} fontWeight="bold">
            Account Type
          </Text>
        </Flex>
        <Flex width="70%" pl={5} pb={2} borderBottom="1px solid" borderColor="brand.50">
          {getAccountType(String(user?.isSeller))}
        </Flex>
      </Flex>
      <Flex height="40px" width="100%" alignItems="center">
        <Flex width="30%">
          <Text fontSize={12} fontWeight="bold">
            First Name
          </Text>
        </Flex>
        <Flex width="70%" pl={5} pb={2} borderBottom="1px solid" borderColor="brand.50">
          <Text fontSize={12}>{user?.firstName}</Text>
        </Flex>
      </Flex>
      <Flex height="40px" width="100%" alignItems="center">
        <Flex width="30%">
          <Text fontSize={12} fontWeight="bold">
            Last Name
          </Text>
        </Flex>
        <Flex width="70%" pl={5} pb={2} borderBottom="1px solid" borderColor="brand.50">
          <Text fontSize={12}>{user?.lastName}</Text>
        </Flex>
      </Flex>
      <Flex height="40px" width="100%" alignItems="center">
        <Flex width="30%">
          <Text fontSize={12} fontWeight="bold">
            Email
          </Text>
        </Flex>
        <Flex width="70%" pl={5} pb={2} borderBottom="1px solid" borderColor="brand.50">
          <Text fontSize={12}>{user?.email}</Text>
        </Flex>
      </Flex>
      <Flex height="40px" width="100%" alignItems="center">
        <Flex width="30%">
          <Text fontSize={12} fontWeight="bold">
            Phone Number
          </Text>
        </Flex>
        <Flex width="70%" pl={5} pb={2} borderBottom="1px solid" borderColor="brand.50">
          {user?.phoneNumber === '' ? (
            <Text fontSize={12}> - </Text>
          ) : (
            <Text fontSize={12}>{`+27${user?.phoneNumber}`}</Text>
          )}
        </Flex>
      </Flex>
      <Flex width="100%" alignItems="center">
        <Flex width="30%">
          <Text fontSize={12} fontWeight="bold">
            ID Number
          </Text>
        </Flex>
        <Flex width="70%" pl={5} pb={2} borderBottom="1px solid" borderColor="brand.50">
          {user?.idNumber === '' ? (
            <Text fontSize={12}> - </Text>
          ) : (
            <Text fontSize={12}>{user?.idNumber}</Text>
          )}
        </Flex>
      </Flex>
      {/* <Flex mt={2} width="100%" alignItems="center">
        <Flex width="30%">
          <Text fontSize={12} fontWeight="bold">
            Address
          </Text>
        </Flex>
        <Flex maxHeight={isWebViewport ? "120px" : "80px"} overflowY="scroll" flexDirection="column" width="70%" pl={5} pb={2} borderBottom="1px solid" borderColor="brand.50">
          {user?.address?.map((address) => (
            <Text fontSize={11} mb={2}>{address?.address}</Text>
          ))}
        </Flex>
      </Flex> */}
      <Flex mt={2} width="100%" alignItems="flex-start">
        <Flex width="30%">
          <Text fontSize={12} fontWeight="bold">
            Interests
          </Text>
        </Flex>
        <Flex width="70%" pl={5} pb={2} flexDirection="column">
          {user?.categories?.length === 0 ? (
            <Text fontSize={12}> - </Text>
          ) : (
            user?.categories?.map((category) => (
              <Text key={category?.id} fontSize={12}>
                {category?.name}
              </Text>
            ))
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PersonalDetailsComponent
