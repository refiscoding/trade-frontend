import * as React from 'react'
import InfoPage from '../../components/InfoPage'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'
import { useHistory } from 'react-router-dom'

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
        image={images.sellerAprroval}
        header="Waiting for approval… "
        caption={`
          Your application has been sent through to TradeFed. 
          You’ll receive an email notification once you’re approved. 
          This can take up to 10 working days.
        `}
        action={() => history.push('/profile')}
        actionText="CONTINUE"
      />
    </PageWrap>
  )
}

export default OnboardinIntro
