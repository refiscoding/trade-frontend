import * as React from 'react'
import InfoPage from '../../components/InfoPage'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'
import { useHistory } from 'react-router-dom'

const CheckoutSuccess: React.FC = () => {
  const history = useHistory()
  return (
    <PageWrap
      title="Checkout Success"
      align="center"
      backgroundSize="cover"
      justify="center"
      pt={0}
    >
      <InfoPage
        image={images.uploadProductSuccess}
        header="Success!"
        caption={`
          Your order has been placed with the supplier and a receipt will be sent to you via email within the next few minutes. 
        `}
        action={() => history.push('/')}
        actionText="OK"
      />
    </PageWrap>
  )
}

export default CheckoutSuccess
