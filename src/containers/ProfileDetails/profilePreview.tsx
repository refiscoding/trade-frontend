import { Flex, Text } from '@chakra-ui/core'
import * as React from 'react'

import { UsersPermissionsUser } from '../../generated/graphql'

type ProfileProps = {
  user?: UsersPermissionsUser
}

const ProfileDetailsView: React.FC<ProfileProps> = ({ user }) => {
  return (
    <Flex
      mt={5}
      pl={5}
      borderBottom="1px solid"
      borderTop="1px solid"
      borderColor="brand.50"
      width="100%"
      flexDirection="column"
    >
      <Flex height="40px" width="100%" alignItems="center">
        <Flex width="30%">
          <Text fontSize={12} fontWeight="bold">
            Name
          </Text>
        </Flex>
        <Flex width="70%" pl={5} pb={2} borderBottom="1px solid" borderColor="brand.50">
          <Text fontSize={12}>{user?.firstName}</Text>
        </Flex>
      </Flex>
      <Flex height="40px" width="100%" alignItems="center">
        <Flex width="30%">
          <Text fontSize={12} fontWeight="bold">
            Lastname
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
      <Flex minHeight="40px" width="100%" alignItems="flex-start">
        <Flex width="30%">
          <Text fontSize={12} fontWeight="bold">
            Interests
          </Text>
        </Flex>
        <Flex width="70%" pl={5} pb={2} flexDirection="column">
          {user?.categories?.map((category) => (
            <Text key={category?.id} fontSize={12}>
              {category?.name}
            </Text>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ProfileDetailsView
