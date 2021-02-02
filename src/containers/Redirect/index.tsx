import * as React from 'react'
import { PageWrap } from '../../layouts'
import { useAuthContext } from '../../context/AuthProvider'
import { useHistory, useLocation, useParams } from 'react-router-dom'

type paramsType = {
  provider: string
}

const Redirect: React.FC = () => {
  const { user, providerAuth } = useAuthContext()
  const history = useHistory()
  const location = useLocation()
  const params = useParams<paramsType>()

  React.useEffect(() => {
    providerAuth && providerAuth(params.provider, location.search)
    // eslint-disable-next-line
  }, [location])

  React.useEffect(() => {
    if (user?.confirmed) {
      history.push('/')
    }
  }, [user, history])

  return (
    <PageWrap align="center" title="Auth Redirect" justifyContent="center" color="colors.white" />
  )
}

export default Redirect
