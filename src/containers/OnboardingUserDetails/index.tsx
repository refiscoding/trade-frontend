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
import { useToast } from '@chakra-ui/core'
import { SUCCESS_TOAST } from '../../constants'

const src =
  `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places` ||
  ''

const userDetailsInitialValues = {
  firstName: '',
  lastName: '',
  address: {
    lat: null,
    lng: null,
    address: '',
    postalCode: ''
  },
  categories: []
}

const Onboarding: React.FC = () => {
  const { setUser } = useAuthContext()
  const history = useHistory()
  const [active, setACtive] = React.useState(0)
  const [userDetails, setUserdetails] = React.useState(userDetailsInitialValues)
  const toast = useToast()

  const { data } = useCategoryQuery({
    onError: (err: any) => formatError(err)
  })

  const categories = get(data, 'categories', [])

  const [updateSelf] = useUpdateSelfMutation({
    onError: (err: any) => formatError(err),
    onCompleted: async ({ updateSelf }) => {
      if (updateSelf?.profileCompleted && setUser) {
        setUser(updateSelf)
        history.push('/dashboard')
      }
    }
  })

  const handleUserDetails = (details: any) => {
    if (active <= 1) {
      setACtive(active + 1)
    }
    setUserdetails({ ...userDetails, ...details })

    if (active === 2) {
      updateSelf({ variables: { input: { ...userDetails } } }).then(() => {
        toast({
          description: 'Successfully added your details!',
          ...SUCCESS_TOAST
        })
      })
    }
  }

  return (
    <PageWrap pt={0} script={src} title="Onboarding Details" mt={10}>
      <Stepper activeStep={active}>
        <OnboardingUserNames handleUserDetails={handleUserDetails} />
        <OnboardingAddress handleUserDetails={handleUserDetails} />
        <OnboardingCategories categories={categories} handleUserDetails={handleUserDetails} />
      </Stepper>
    </PageWrap>
  )
}

export default Onboarding
