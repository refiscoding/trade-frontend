import * as React from 'react'
import { get } from 'lodash'

import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { Flex, useToast } from '@chakra-ui/core'
import { formatError } from '../../utils'
import { PageWrap } from '../../layouts'
import { Stepper } from '../../components'
import { useHistory } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthProvider'
import { useCategoryQuery, useUpdateSelfMutation } from '../../generated/graphql'
import { useMediaQuery } from 'react-responsive'

import OnboardingAddress from './OnboardingAddress'
import OnboardingBusinessDetails from './OnboardingBusinessDetails'
import OnboardingCategories from './OnboardingCategories'
import OnboardingCompanyDetails from './OnboardingCompanyDetails'
import OnboardingIndividual from './OnboardingIndividual'
import OnboardingSecondaryContact from './OnboardingSecondaryContact'
import OnboardingUserNames from './OnboardingUserNames'

const userDetailsInitialValues = {
  firstName: '',
  lastName: '',
  address: [],
  categories: [],
  position: '',
  workEmailAddress: '',
  phoneNumber: '',
  idNumber: ''
}

const Onboarding: React.FC = () => {
  const { setUser } = useAuthContext()
  const history = useHistory()
  const [active, setACtive] = React.useState(0)
  const [userDetails, setUserdetails] = React.useState(userDetailsInitialValues)
  const [shouldShowBusinessScreen, setShouldShowBusinessScreen] = React.useState(false)
  const [currentAccountType, setCurrentAccountType] = React.useState('Individual')
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

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
    // decider to show if we should show company screens
    details?.accountType &&
      setShouldShowBusinessScreen(Boolean(details.accountType.includes('Business') ? true : false))

    if (shouldShowBusinessScreen ? active <= 5 : active <= 3) {
      setACtive(active + 1)
    }
    setUserdetails({ ...userDetails, ...details })

    if (shouldShowBusinessScreen ? active === 5 : active === 3) {
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
          <OnboardingUserNames
            currentAccountType={currentAccountType}
            setCurrentAccountType={setCurrentAccountType}
            handleUserDetails={handleUserDetails}
          />
          {currentAccountType === 'Business' ? (
            <OnboardingBusinessDetails handleUserDetails={handleUserDetails} />
          ) : (
            <OnboardingIndividual handleUserDetails={handleUserDetails} />
          )}
          {currentAccountType === 'Business' && (
            <OnboardingCompanyDetails handleUserDetails={handleUserDetails} />
          )}
          <OnboardingSecondaryContact handleUserDetails={handleUserDetails} />
          <OnboardingAddress handleUserDetails={handleUserDetails} />
          <OnboardingCategories categories={categories} handleUserDetails={handleUserDetails} />
        </Stepper>
      </Flex>
    </PageWrap>
  )
}

export default Onboarding
