import { Form, Formik } from 'formik'
import * as React from 'react'
import { Filter, Search } from 'react-feather'

import { ConnectedFormGroup } from '../../components/FormElements'
import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { useAuthContext } from '../../context/AuthProvider'
import { useHistory } from 'react-router-dom'
import { Flex, Image, Text } from '@chakra-ui/core'
import { images } from '../../theme'
import Hero from '../../components/Hero'
import { useCategoryQuery } from '../../generated/graphql'
import { get } from 'lodash'
import { Card } from '../../components'
import CardFooter from '../../components/Card/CardFooter'
import Footer from '../../components/Footer'

type InitialValues = {
  search: string
}

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext()
  const history = useHistory()
  const { data } = useCategoryQuery({
    onError: (err: any) => formatError(err)
  })

  const categories: any = get(data, 'categories', [])

  React.useEffect(() => {
    if (isAuthenticated && !user?.profileCompleted) {
      history.push('/user-onboarding-intro')
    }
    // eslint-disable-next-line
  }, [user, isAuthenticated])

  return (
    <PageWrap title="Dashboard" color="colors.white">
      <Flex width="100%" height="40px" justifyContent="space-between">
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
          <Form style={{ width: '80%' }}>
            <ConnectedFormGroup
              icon={Search}
              name="search"
              placeholder="Search for products, brands..."
              fontSize={12}
              paddingLeft="40px"
              borderColor="transparent"
              bg="accent.600"
              iconPosition="left"
            />
          </Form>
        </Formik>
        <Flex
          borderRadius={4}
          bg="accent.600"
          alignItems="center"
          justifyContent="center"
          width="15%"
        >
          <Filter fontSize={10} />
        </Flex>
      </Flex>
      <Hero image={images.heroImg} header="HOLIDAY DASH" caption="Shop early deals" />
      <Flex width="100%" flexDirection="column">
        <Text fontSize="18px" fontWeight={600}>
          Product Categories
        </Text>
        <Flex width="100%" flexWrap="wrap" justifyContent="space-evenly">
          {categories !== null &&
            categories.map((category: any, i: number) => (
              <Card m={2} key={i} width="45%" height="130px">
                <Image
                  mr={5}
                  width="100%"
                  height="100px"
                  src={`${process.env.REACT_APP_API_HOST}${category.categoryImage.url}`}
                />
                <CardFooter bg="white" height="30px" alignItems="center" justifyContent="center">
                  <Text fontSize="12px">{category.name}</Text>
                </CardFooter>
              </Card>
            ))}
        </Flex>
      </Flex>
      <Footer />
    </PageWrap>
  )
}

export default Home
