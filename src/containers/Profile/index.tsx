import { Flex, Text } from '@chakra-ui/core'
import * as React from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { ChevronRight } from 'react-feather'

import { useAuthContext } from '../../context/AuthProvider'
import { PageWrap } from '../../layouts'
import { H3, H5 } from '../../typography'
import {useMediaQuery} from "react-responsive";

type ProfileProps = {}

const Profile: React.FC<ProfileProps> = () => {
  const { user } = useAuthContext()
  const history = useHistory()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const initials = `${user?.firstName?.[0]}${user?.lastName?.[0]}`
  const joinDate = moment(user?.created_at).format('DD/MM/YYYY')
  const isSellerApproved = user?.isSeller === 'approved'

  const handleBecomeSeller = () => {
    if (isSellerApproved) {
      history.push('/product-management')
      return
    }
    history.push('/apply-seller')
  }

  const navigateToDetails = () => {
    history.push('/profile-details')
  }

  return (
    <PageWrap title="My Account" width={isTabletOrMobile ? '100%' : '40%'} alignSelf="center">
      <Flex mt={3}>
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
        <Flex pl={5} flexDir="column" justify="center" align="flex-start">
          <H3 fontWeight="bold">{`${user?.firstName}  ${user?.lastName}`}</H3>
          <H5 fontSize={14} color="brand.300">{`Buyer since ${joinDate}`}</H5>
        </Flex>
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
        onClick={() => navigateToDetails()}
      >
        <Flex width="80%">
          <Text fontSize={12}>Personal Information & Preference</Text>
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
      >
        <Flex width="80%">
          <Text fontSize={12}>My Order History</Text>
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
        onClick={() => handleBecomeSeller()}
      >
        <Flex width="80%">
          <Text fontSize={12}>{isSellerApproved ? 'Product Management' : 'Become a Seller'}</Text>
        </Flex>
        <ChevronRight />
      </Flex>
    </PageWrap>
  )
}

export default Profile
