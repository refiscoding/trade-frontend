import * as React from 'react'
import { get } from 'lodash'

import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { Flex, useToast } from '@chakra-ui/core'
import { formatError } from '../../utils'
import { PageWrap } from '../../layouts'
import { Stepper } from '../../components'
import { useHistory } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthProvider'
import { useCategoryQuery, useUpdateSelfMutation, useSelfQuery } from '../../generated/graphql'
import { useMediaQuery } from 'react-responsive'

import OnboardingCategories from './OnboardingCategories'
import OnboardingCompanyDetails from './OnboardingCompanyDetails'
import OnboardingIndividual from './OnboardingIndividual'
import OnboardingUserNames from './OnboardingUserNames'

const userDetailsInitialValues = {
  firstName: '',
  lastName: '',
  address: [],
  categories: [],
  workEmailAddress: '',
  phoneNumber: '',
  idNumber: ''
}

const Onboarding: React.FC = () => {
  const { setUser } = useAuthContext()
  const history = useHistory()
  const [active, setActive] = React.useState(0)
  const [userDetails, setUserdetails] = React.useState(userDetailsInitialValues)
  const [currentAccountType, setCurrentAccountType] = React.useState('Individual')
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const { data } = useCategoryQuery({
    onError: (err: any) => formatError(err)
  })

  // If user has partially completed business registration
  // take them straight to next steps
  useSelfQuery({
    onCompleted: (user) => {
      if (user.self?.business) {
        setCurrentAccountType('Business')
        setActive(3)
      }
    }
  })

  const categoriesList = get(data, 'categories', [])

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
    if (currentAccountType === 'Business') {
      if (active <= 2) {
        setActive(active + 1)
      }
      setUserdetails({ ...userDetails, ...details })

      if (active === 3) {
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
    } else {
      if (active <= 2) {
        setActive(active + 1)
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
  }

  return (
    <PageWrap pt={0} title="Onboarding Details" mt={20} width="100%">
      <Flex width={isTabletOrMobile ? '100%' : '40%'} flexDirection="column" alignSelf="center">
        <Stepper activeStep={active}>
          <OnboardingUserNames
            currentAccountType={currentAccountType}
            setCurrentAccountType={setCurrentAccountType}
            handleUserDetails={handleUserDetails}
          />
          <OnboardingIndividual handleUserDetails={handleUserDetails} />
          {currentAccountType === 'Business' && (
            <OnboardingCompanyDetails handleUserDetails={handleUserDetails} />
          )}
          <OnboardingCategories categories={categoriesList} handleUserDetails={handleUserDetails} />
        </Stepper>
      </Flex>
    </PageWrap>
  )
}

export default Onboarding
