import * as React from 'react'

import { useLocation } from 'react-router'
import { useHistory } from 'react-router-dom'

import InfoPage from '../../components/InfoPage'

import { images } from '../../theme'
import { PageWrap } from '../../layouts'

const CheckoutSuccess: React.FC = () => {
  const history = useHistory()
  const location = useLocation()

  const orderNumber = new URLSearchParams(location.search).get('order') as string

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
        header="Payment Successful!"
        caption={`
          We have received your payment for order ${orderNumber}.
          We have sent an invoice to your email with the summary.
          One of our representatives will also contact you to facilitate delivery to the pickup point.
        `}
        action={() => history.push('/')}
        actionText="TAKE ME HOME"
      />
    </PageWrap>
  )
}

export default CheckoutSuccess
