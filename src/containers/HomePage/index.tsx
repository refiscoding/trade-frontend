import { Form, Formik } from 'formik'
import * as React from 'react'
import { Search } from 'react-feather'

import { ConnectedFormGroup } from '../../components/FormElements'
import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { useAuthContext } from '../../context/AuthProvider'
import { useHistory } from 'react-router-dom'

type InitialValues = {
  search: string
}

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext()
  const history = useHistory()

  React.useEffect(() => {
    if (isAuthenticated && !user?.profileCompleted) {
      history.push('/user-onboarding-details')
    }
    // eslint-disable-next-line
  }, [user, isAuthenticated])

  return (
    <PageWrap align="center" title="Dashboard" justifyContent="center" color="colors.white">
      <Formik
        initialValues={{
          search: ''
        }}
        onSubmit={async ({ search }, { setSubmitting, setStatus }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            const search = () => {
              return
            }
            search()
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        <Form style={{ width: '100%' }}>
          <ConnectedFormGroup
            flexDirection="row-reverse"
            icon={Search}
            name="search"
            placeholder="Search"
          />
        </Form>
      </Formik>
    </PageWrap>
  )
}

export default Home
