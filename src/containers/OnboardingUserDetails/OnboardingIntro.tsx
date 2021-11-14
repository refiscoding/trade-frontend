import * as React from 'react'
import { useHistory } from 'react-router-dom'

import InfoPage from '../../components/InfoPage'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'

const OnboardinIntro: React.FC = () => {
  const history = useHistory()
  return (
    <PageWrap
      title="Onboarding Intro"
      align="center"
      backgroundSize="cover"
      justify="center"
      pt={0}
    >
      <InfoPage
        hasLogo
        image={images.onboardingIntro}
        header="Welcome to tradeFed"
        caption="You have successfully created your tradeFed account."
        action={() => history.push('/user-onboarding-details')}
        actionText="GET STARTED"
      />
    </PageWrap>
  )
}

export default OnboardinIntro
