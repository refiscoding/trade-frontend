import { Button, Flex, Text } from '@chakra-ui/core'
import * as React from 'react'

import { useAuthContext } from '../../context/AuthProvider'
import { PageWrap } from '../../layouts'
import { H3 } from '../../typography'

type ProfileProps = {}

const ProfileDetails: React.FC<ProfileProps> = () => {
  const { user } = useAuthContext()

  const initials = `${user?.firstName?.[0]}${user?.lastName?.[0]}`

  return (
    <PageWrap title="My Account" height="100vh" justifyContent="space-between">
      <Flex flexDirection="column" width="100%">
        <Flex mt={3} flexDirection="column" width="100%" alignItems="center">
          <Flex
            borderRadius="50%"
            width="85px"
            height="85px"
            border="2px dashed"
            borderColor="brand.500"
            justifyContent="center"
            alignItems="center"
          >
            <Flex
              bg="brand.500"
              borderRadius="50%"
              width="70px"
              height="70px"
              justify="center"
              align="center"
            >
              <H3 fontSize="2.5rem" color="white">
                {initials}
              </H3>
            </Flex>
          </Flex>
          <Flex mt={4} pl={5} flexDir="column" justify="center" align="flex-start">
            <Text color="accent.500" textDecoration="underline" fontSize="12px">
              Change Profile Picture
            </Text>
          </Flex>
        </Flex>

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
          <Flex height="40px" width="100%" alignItems="flex-start">
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
      </Flex>
      <Button onClick={() => {}} mb={5} width="100%" type="button" variantColor="brand">
        EDIT INFO
      </Button>
    </PageWrap>
  )
}

export default ProfileDetails
