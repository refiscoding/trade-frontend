import { Button, Flex, Image } from '@chakra-ui/core'
import { Form, Formik } from 'formik'
import * as React from 'react'
import { Search } from "react-feather";

import { ConnectedFormGroup } from '../../components/FormElements'
import { PageWrap } from '../../layouts'
import { formatError } from "../../utils";


type InitialValues = {
  search: string
}

const Home: React.FC = () => {
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
