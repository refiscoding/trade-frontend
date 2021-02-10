import * as React from 'react'
import InfoPage from '../../components/InfoPage'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'

type ConfirmEmailProps = {}

const ConfirmEmail: React.FC<ConfirmEmailProps> = () => {
  return (
    <PageWrap title="Confirm Email" align="center" backgroundSize="cover" justify="center" pt={0}>
      <InfoPage
        hasLogo
        image={images.MailBox}
        header="Please verify your email"
        caption="A verification email has been sent to your email address"
      />
    </PageWrap>
  )
}

export default ConfirmEmail
