import * as React from 'react'

import { get } from 'lodash'
import { Form, Formik } from 'formik'
import { ArrowLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { Button, Flex, Image, Text, useToast } from '@chakra-ui/core'

import ProfileDetailsView from './profilePreview'
import ProfileDetailForm, { profileValues } from './profileDetailsForm'

import { H3 } from '../../typography'
import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { useAuthContext } from '../../context/AuthProvider'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { ConnectedFileUploader } from '../../components/FormElements'
import { Category, useCategoryQuery, useUpdateSelfMutation } from '../../generated/graphql'

type ProfileProps = {}

const ProfileDetails: React.FC<ProfileProps> = () => {
  const { user, setUser } = useAuthContext()
  const [isEditing, setIsEditing] = React.useState<boolean>(false)
  const toast = useToast()
  const history = useHistory()

  const { data } = useCategoryQuery({
    onError: (err: any) => formatError(err)
  })

  const categories = get(data, 'categories', null) as Category[]

  const initials = `${user?.firstName?.[0]}${user?.lastName?.[0]}`
  const userCategories = user?.categories?.map((category) => `${category?.id}`)
  const initialValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    categories: userCategories,
    phoneNumber: user?.phoneNumber,
    idNumber: user?.idNumber
    // address: user?.address?.address,
  } as profileValues

  const [updateSelf] = useUpdateSelfMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async ({ updateSelf }) => {
      if (updateSelf && setUser) {
        setUser(updateSelf)
        toast({
          description: 'Successfully added your details!',
          ...SUCCESS_TOAST
        })
        setIsEditing(false)
      }
    }
  })

  const isWebViewport = useMediaQuery({
    query: '(min-width: 40em)'
  })

  const handleUserDetails = async (values: profileValues) => {
    await updateSelf({ variables: { input: { ...values } } })
  }

  const handleChangeProfilePicture = (id: string | string[]) => {
    const profileId = id as string
    const updateProfile = async () => {
      await updateSelf({ variables: { input: { profilePicture: profileId } } })
    }
    updateProfile()
  }

  return (
    <PageWrap title="My Account" height="100vh" justifyContent="space-between">
      <Flex flexDirection="column" width="100%">
        <ArrowLeft size={30} onClick={() => history.goBack()} />
        <Flex mt={3} flexDirection="column" width="100%" alignItems="center">
          <Flex
            borderRadius="50%"
            width="85px"
            height="85px"
            border="2px dashed"
            borderColor="brand.500"
            justifyContent="center"
            alignItems="center"
          >
            <Flex
              bg="brand.500"
              borderRadius="50%"
              width="70px"
              height="70px"
              justify="center"
              align="center"
              overflow="hidden"
            >
              {user?.profilePicture ? (
                <Image
                  m={5}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  src={user?.profilePicture.url}
                />
              ) : (
                <H3 fontSize="2.5rem" color="white">
                  {initials}
                </H3>
              )}
            </Flex>
          </Flex>
          <Flex mt={4} pl={5} flexDir="column" justify="center" align="flex-start">
            <Formik
              validationSchema={{}}
              initialValues={{}}
              onSubmit={() => console.log(' submit ')}
            >
              {() => (
                <Form style={{ width: '100%' }}>
                  <ConnectedFileUploader
                    isImage
                    showUploadButton
                    placeholderIcon
                    name="profilePhoto"
                    onUpload={handleChangeProfilePicture}
                    placeholder={
                      <Text color="accent.500" textDecoration="underline" fontSize="12px">
                        Change Profile Picture
                      </Text>
                    }
                  />
                </Form>
              )}
            </Formik>
          </Flex>
        </Flex>
        {isEditing ? (
          <ProfileDetailForm
            handleUserDetails={handleUserDetails}
            categories={categories}
            initialValues={initialValues}
          />
        ) : (
          <ProfileDetailsView user={user} />
        )}
      </Flex>
      {!isEditing && (
        <Button
          onClick={() => setIsEditing(true)}
          p={5}
          width={isWebViewport ? '40%' : '100%'}
          type="button"
          variantColor="brand"
          alignSelf="center"
        >
          EDIT INFO
        </Button>
      )}
    </PageWrap>
  )
}

export default ProfileDetails
