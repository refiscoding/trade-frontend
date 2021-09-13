import * as Yup from 'yup'
import * as React from 'react'

import { Mail } from 'react-feather'
import { ApolloError } from 'apollo-boost'
import { Form, Formik, FormikProps } from 'formik'
import { Link, useHistory } from 'react-router-dom'
import {
  Button,
  Flex,
  Image,
  useToast,
  Tabs,
  TabList,
  Tab,
  Box,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/core'

import Input from '../../components/Input'

import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { images, theme } from '../../theme'
import { ERROR_TOAST } from '../../constants'
import { MotionFlex, SideSlider } from '../../components'
import { useAuthContext } from '../../context/AuthProvider'
import { useFetchLegalitiesQuery } from '../../generated/graphql'
import { ConnectedFormGroup, ConnectedPasswordGroup } from '../../components/FormElements'

type RegisterProps = {}

const RegisterFormValidation = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('An email address is required'),
  password: Yup.string()
    .min(8, 'Password has to be longer than 8 characters')
    .required('A password is required')
})

type RegisterValues = {
  email: string
  password: string
}

const baseUrl = process.env.REACT_APP_API_HOST
const terms = 'Terms & Conditions'

const Register: React.FC<RegisterProps> = () => {
  const toast = useToast()
  const { register, user, logout } = useAuthContext()
  const [showError, setShowError] = React.useState<boolean | null>(false)
  const [termsChecked, setTermsChecked] = React.useState<boolean | null>(false)

  const { data: legalities } = useFetchLegalitiesQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const history = useHistory()

  const { isOpen, onOpen, onClose } = useDisclosure()

  React.useEffect(() => {
    if (user?.confirmed) {
      history.push('/')
    } else if (user) {
      history.push('/confirm-email')
      logout && logout()
    }
    // eslint-disable-next-line
  }, [user])

  const handleTermsCheckboxClicked = () => {
    setShowError(!termsChecked)
    setTermsChecked(!termsChecked)
  }
  const termsAndConditionsLink = legalities?.legality?.termsAndConditionsFile?.url
  return (
    // Login illustration image
    <PageWrap
      align="center"
      title="Login"
      backgroundSize="contain"
      backgroundRepeat="no-repeat"
      bgImage={`url(${images.bg})`}
      justify="center"
      pt={0}
    >
      <SideSlider>
        {/** Business account register */}
        <Flex width="100%" flexDirection="column" pb={4} color="white">
          <H3 textAlign="center" mb={4} fontWeight="bold" color={theme.colors.brand[500]}>
            Hi there! Welcome to TradeFed.
          </H3>
          <Text textAlign="center" fontSize="18px" color="gray.500">
            Choose an account type.
          </Text>
        </Flex>
        <Box
          onClick={onOpen}
          as="button"
          mt="5"
          boxShadow="lg"
          height="200px"
          width="350px"
          borderRadius="10px"
          textAlign="center"
          bg="gray.50"
        >
          <Text textAlign="center" fontSize="18px" color="black">
            Business
          </Text>
          <Image
            marginLeft="150px"
            marginTop="5px"
            marginBottom="5px"
            h="50px"
            w="50px"
            objectFit="cover"
            src="https://www.iconpacks.net/icons/2/free-store-icon-2017-thumb.png"
          />
          <Text textAlign="center" fontSize="15px" color="gray.500">
            For business owners, enterprises, SMEs buyers.
          </Text>
        </Box>
        {/** Business account register - MODAL */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>First name</FormLabel>
                <Input placeholder="First name" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Last name</FormLabel>
                <Input placeholder="Last name" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Phone number</FormLabel>
                <Input placeholder="Last name" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Email address</FormLabel>
                <Input placeholder="Last name" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>City</FormLabel>
                <Input placeholder="Last name" />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button mr={3}>Save</Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/** Individual account register */}
        <Box
          onClick={onOpen}
          as="button"
          mt="5"
          boxShadow="lg"
          height="200px"
          width="350px"
          borderRadius="10px"
          textAlign="center"
          bg="gray.50"
        >
          <Text textAlign="center" fontSize="18px" color="black">
            Individual
          </Text>
          <Image
            marginLeft="150px"
            marginTop="5px"
            marginBottom="5px"
            h="50px"
            w="50px"
            objectFit="cover"
            src="https://www.iconpacks.net/icons/2/free-store-icon-2017-thumb.png"
          />
          <Text textAlign="center" fontSize="15px" color="gray.500">
            For individual buyers.
          </Text>
        </Box>
        {/** Individual account register - MODAL */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>First name</FormLabel>
                <Input placeholder="First name" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Last name</FormLabel>
                <Input placeholder="Last name" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Phone number</FormLabel>
                <Input placeholder="Last name" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Email address</FormLabel>
                <Input placeholder="Last name" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>City</FormLabel>
                <Input placeholder="Last name" />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button mr={3}>Save</Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Flex mb={2} mt={4} align="center" justify="center">
          <Text>
            Already have an account?{' '}
            <Link style={{ fontWeight: 600 }} to="/login">
              Login
            </Link>{' '}
          </Text>
        </Flex>
      </SideSlider>
    </PageWrap>
  )
}

export default Register
