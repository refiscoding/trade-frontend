import { Button, Flex, useToast } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import get from 'lodash/get'
import React, { useState } from 'react'
import { Column } from 'react-table'
import * as Yup from 'yup'
import { ModalWrap, Table } from '../../components'
import CardFooter from '../../components/Card/CardFooter'
import { ConnectedFormGroup, ConnectedImageUploader } from '../../components/FormElements'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants/index'
import {
  UploadFile,
  useCreateUserMutation,
  UsersPermissionsUser,
  useUsersQuery
} from '../../generated/graphql'
import { PageWrap } from '../../layouts'
import { Text } from '../../typography'
import { formatError } from '../../utils'

type UserManagementProps = {}

/**
 * NOTE: in order for this to work you'll need a
 * profilePicture single media type in strapi
 */
type InitialValues = {
  username: string
  email: string
  profilePicture: UploadFile | undefined
}

const INITIAL_VALUES: InitialValues = {
  username: '',
  email: '',
  profilePicture: undefined
}

const AddUserFormValidation = Yup.object().shape({
  username: Yup.string().required('Required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('An email address is required')
})

const UserManagement: React.FC<UserManagementProps> = () => {
  const [userModal, setUserModal] = useState(false)
  const { data, loading: usersLoading, fetchMore } = useUsersQuery({
    variables: { start: 0, limit: 20 },
    notifyOnNetworkStatusChange: true
  })

  const toast = useToast()

  const [createUser, { loading }] = useCreateUserMutation({
    onCompleted: () => {
      toast({ description: 'User created.', ...SUCCESS_TOAST })
    },
    onError: () => {
      toast({ description: 'There was an error creating user.', ...ERROR_TOAST })
    }
  })

  const columns: Column[] = [
    { Header: 'Username', accessor: 'username' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Role', accessor: 'role.name' }
  ]

  const tableActions = () => {
    return (
      <Flex ml={4}>
        <Button onClick={() => setUserModal(true)} variantColor="brand" leftIcon="plus-square">
          Add User
        </Button>
      </Flex>
    )
  }

  const users = get(data, 'users', [])

  return (
    <PageWrap title="User Management" p={4} flexDir="column">
      <ModalWrap
        title="Create User"
        isOpen={userModal}
        onClose={() => {
          setUserModal(false)
        }}
      >
        <Formik
          validationSchema={AddUserFormValidation}
          initialValues={INITIAL_VALUES}
          onSubmit={async ({ profilePicture, ...rest }, { setStatus }) => {
            setStatus(null)
            try {
              const id = profilePicture?.id
              await createUser({ variables: { input: { data: { profilePicture: id, ...rest } } } })
            } catch (error) {
              setStatus(formatError(error))
            }
          }}
        >
          {({ status, handleSubmit }: FormikProps<InitialValues>) => {
            return (
              <Form style={{ width: '100%' }}>
                <Flex flexDir="column" p={4}>
                  <ConnectedImageUploader mb={4} name="profilePicture" />
                  <ConnectedFormGroup name="username" label="Username" placeholder="Username" />
                  <ConnectedFormGroup name="email" label="Email" placeholder="Email" />
                </Flex>
                {status && (
                  <Text textAlign="right" color="red.500">
                    {status}
                  </Text>
                )}
                <CardFooter alignItems="flex-end">
                  <Flex>
                    <Button
                      mr={4}
                      variant="ghost"
                      variantColor="gray"
                      onClick={() => setUserModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variantColor="brand"
                      isLoading={loading}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Flex>
                </CardFooter>
              </Form>
            )
          }}
        </Formik>
      </ModalWrap>
      <Table
        columns={columns}
        isLoading={usersLoading}
        tableHeading="All Users"
        tableActions={tableActions}
        onClickNext={() => {
          // TODO: abstract this logic into reusable function
          return fetchMore({
            variables: {
              start: (users as UsersPermissionsUser[]).length
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev
              const previous = prev.users || []
              const next = fetchMoreResult.users || []
              return Object.assign({}, prev, {
                users: [...previous, ...next]
              })
            }
          })
        }}
        data={users as UsersPermissionsUser[]}
      />
    </PageWrap>
  )
}

export default UserManagement
