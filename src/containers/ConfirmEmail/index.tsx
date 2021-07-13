import * as React from 'react'

import InfoPage from '../../components/InfoPage'

import { useHistory } from 'react-router-dom'

import { images } from '../../theme'
import { PageWrap } from '../../layouts'

type ConfirmEmailProps = {}

const ConfirmEmail: React.FC<ConfirmEmailProps> = () => {
  const history = useHistory()
  return (
    <PageWrap title="Confirm Email" align="center" backgroundSize="cover" justify="center" pt={0}>
      <InfoPage
        hasLogo
        image={images.MailBox}
        header="Please verify your email"
        caption="A verification email has been sent to your email address"
        action={() => history.push('/')}
        actionText="TAKE ME HOME"
      />
    </PageWrap>
  )
}

export default ConfirmEmail
