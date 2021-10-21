import * as React from 'react'
import InfoPage from '../../components/InfoPage'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'
import { useHistory } from 'react-router-dom'

const SellerApproval: React.FC = () => {
  const history = useHistory()
  return (
    <PageWrap
      title="Onboarding Intro"
      align="center"
      backgroundSize="cover"
      justify="center"
      pt={0}
      mt={10}
    >
      <InfoPage
        image={images.sellerAprroval}
        header="Waiting for approval… "
        caption={`
          Thank you. Your application to become a seller is complete.
          We will be in contact with you within the next 72 hours.
          If you have any further questions regarding "Becoming a seller",
          please contact queries@tradefed.co.za.
        `}
        action={() => history.push('/profile')}
        actionText="CONTINUE"
      />
    </PageWrap>
  )
}

export default SellerApproval
