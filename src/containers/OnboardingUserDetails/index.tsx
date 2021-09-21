import * as React from 'react'
import { get } from 'lodash'

import { PageWrap } from '../../layouts'
import { Stepper } from '../../components'
import OnboardingUserNames from './OnboardingUserNames'
import OnboardingCategories from './OnboardingCategories'
import OnboardingUserAddress from './OnboardingUserAddress'
import OnboardingBusinessDetails from './OnboardingBusinessDetails'
import OnboardingCompanyDetails from './OnboardingCompanyDetails'
import { useUpdateSelfMutation, useCategoryQuery } from '../../generated/graphql'
import { formatError } from '../../utils'
import { useHistory } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthProvider'
import { Flex, useToast } from '@chakra-ui/core'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { useMediaQuery } from 'react-responsive'
// import { useScript } from '../../hooks'

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
  // useScript(mapsScriptUrl)

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

    if (shouldShowBusinessScreen ? active <= 3 : active <= 1) {
      setACtive(active + 1)
    }
    setUserdetails({ ...userDetails, ...details })

    if (shouldShowBusinessScreen ? active === 5 : active === 2) {
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
          {currentAccountType === 'Business' && (
            <OnboardingBusinessDetails handleUserDetails={handleUserDetails} />
          )}
          {currentAccountType === 'Business' && (
            <OnboardingCompanyDetails handleUserDetails={handleUserDetails} />
          )}
          {currentAccountType === 'Business' ? (
            <OnboardingCompanyDetails handleUserDetails={handleUserDetails} />
          ) : (
            <OnboardingUserAddress handleUserDetails={handleUserDetails} />
          )}
          <OnboardingCategories categories={categories} handleUserDetails={handleUserDetails} />
        </Stepper>
      </Flex>
    </PageWrap>
  )
}

export default Onboarding
