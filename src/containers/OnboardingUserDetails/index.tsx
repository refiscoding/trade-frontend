import * as React from 'react'
import { get } from 'lodash'

import { PageWrap } from '../../layouts'
import { Stepper } from '../../components'
import OnboardingAddress from './OnboardingAddress'
import OnboardingUserNames from './OnboardingUserNames'
import OnboardingCategories from './OnboardingCategories'
import { useUpdateSelfMutation, useCategoryQuery } from '../../generated/graphql'
import { formatError } from '../../utils'
import { useHistory } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthProvider'
import { Flex, useToast } from '@chakra-ui/core'
import { ERROR_TOAST, mapsScriptUrl, SUCCESS_TOAST } from '../../constants'
import { useMediaQuery } from 'react-responsive'
import { useScript } from '../../hooks'

const userDetailsInitialValues = {
  firstName: '',
  lastName: '',
  address: [],
  categories: []
}

const Onboarding: React.FC = () => {
  const { setUser } = useAuthContext()
  const history = useHistory()
  const [active, setACtive] = React.useState(0)
  const [userDetails, setUserdetails] = React.useState(userDetailsInitialValues)
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  useScript(mapsScriptUrl)

  const { data } = useCategoryQuery({
    onError: (err: any) => formatError(err)
  })

  const categories = get(data, 'categories', [])

  const [updateSelf] = useUpdateSelfMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async ({ updateSelf }) => {
      if (updateSelf?.profileCompleted && setUser) {
        setUser(updateSelf)
        toast({
          description: 'Successfully added your details!',
          ...SUCCESS_TOAST
        })
        history.push('/')
      }
    }
  })

  const handleUserDetails = async (details: any) => {
    if (active <= 1) {
      setACtive(active + 1)
    }
    setUserdetails({ ...userDetails, ...details })

    if (active === 2) {
      if (details.categories) {
        await updateSelf({
          variables: {
            input: {
              ...userDetails,
              categories: details.categories
            }
          }
        })
      } else {
        await updateSelf({ variables: { input: { ...userDetails } } })
      }
    }
  }

  return (
    <PageWrap pt={0} title="Onboarding Details" mt={10} width="100%">
      <Flex width={isTabletOrMobile ? '100%' : '40%'} flexDirection="column" alignSelf="center">
        <Stepper activeStep={active}>
          <OnboardingUserNames handleUserDetails={handleUserDetails} />
          <OnboardingAddress handleUserDetails={handleUserDetails} />
          <OnboardingCategories categories={categories} handleUserDetails={handleUserDetails} />
        </Stepper>
      </Flex>
    </PageWrap>
  )
}

export default Onboarding
