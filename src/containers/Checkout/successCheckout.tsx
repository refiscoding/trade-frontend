import * as React from 'react'
import InfoPage from '../../components/InfoPage'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'
import { useHistory } from 'react-router-dom'

const CheckoutSuccess: React.FC = () => {
  const history = useHistory();
  // TODO: Integrete with value from backend after payment success
  const orderNumber = "TFED-ighjkhjk";
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
          You will receive an invoice in your email with the summary.
          One of our representatives will also contact you to facilitate delivery to the pickup point.
        `}
        action={() => history.push('/')}
        actionText="OK"
      />
    </PageWrap>
  )
}

export default CheckoutSuccess
