import * as React from 'react'
import { PageWrap } from '../../layouts'
import { Stepper } from '../../components'
import OnboardingAddress from './OnboardingAddress'
import OnboardingUserNames from './OnboardingUserNames'
import OnboardingCategories from './OnboardingCategories'

const Onboarding: React.FC = () => {
  const [active, setACtive] = React.useState(0)
  const [userDetails, setUserdetails] = React.useState({})

  const handleUserDetails = (details: any) => {
    if (active <= 1) {
      setACtive(active + 1)
    }
    setUserdetails({ ...userDetails, ...details })
  }

  return (
    <PageWrap pt={0} title="Onboarding Details" align="center" justify="center">
      <Stepper activeStep={active}>
        <OnboardingUserNames handleUserDetails={handleUserDetails} />
        <OnboardingAddress handleUserDetails={handleUserDetails} />
        <OnboardingCategories handleUserDetails={handleUserDetails} />
      </Stepper>
    </PageWrap>
  )
}

export default Onboarding
