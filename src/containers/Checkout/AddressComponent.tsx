import * as React from 'react'

import { ChevronRight } from 'react-feather'
import { Grid, GridProps, Flex, Tag, useToast } from '@chakra-ui/core'

import { theme } from '../../theme'
import { AddressInput } from './Input'
import { Text } from '../../typography'
import { ComponentLocationAddress, useDeleteAddressLazyQuery } from '../../generated/graphql'
import DeleteItemsModal from '../../components/DeleteItemsModal'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { useAuthContext } from '../../context/AuthProvider'
import ModalWrap from '../../components/ModalWrap'
import DeliveryAddressForm from './DeliveryAddressForm'
import { ApolloError } from 'apollo-client'

export type TimeSlot = {
  date: string
  startTime: string
  endTime: string
}

export type AddressComponentProps = GridProps & {
  mobileFlow: boolean
  address: ComponentLocationAddress
  addresses: ComponentLocationAddress[]
  setActiveStep: (step: number) => void
  setActivateButton: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedAddress: React.Dispatch<React.SetStateAction<ComponentLocationAddress | undefined>>
}

type AddressDetailsComponentProps = {
  address: ComponentLocationAddress
}

const AddressDetailsComponent: React.FC<AddressDetailsComponentProps> = ({ address }) => (
  <React.Fragment>
    <Text fontSize={14}>{address?.postalCode} </Text>
    <Text mt={3} fontSize={14}></Text>
  </React.Fragment>
)

const AddressComponent: React.FC<AddressComponentProps> = ({
  address,
  addresses: allAddresses,
  mobileFlow,
  setActiveStep,
  setSelectedAddress,
  setActivateButton
}) => {
  const { setUser } = useAuthContext()
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false)
  const numberOfColumns = mobileFlow ? '1fr' : '10px 1fr'
  const height = mobileFlow ? '220px' : '170px'
  const toast = useToast()

  const clickHandler = !mobileFlow
    ? undefined
    : () => {
        setActiveStep(2)
        setSelectedAddress(address)
      }

  const handleEditAddressClicked = () => {
    setShowEditModal(true)
  }

  const handleDeleteAddressClicked = () => {
    setShowModal(true)
  }

  const handleAddressSelected = (addressName: string, checked: boolean) => {
    const selectedOneFromAll = allAddresses?.filter((address) => addressName === address?.address)
    const candidateAddress = selectedOneFromAll[0]

    if (checked) {
      setSelectedAddress(candidateAddress)
      setActivateButton(false)
    }
  }

  const [deleteAddressQuery] = useDeleteAddressLazyQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async ({ deleteAddress }) => {
      if (deleteAddress?.profileCompleted && setUser) {
        setUser(deleteAddress)
        toast({
          description: 'Successfully deleted your address',
          ...SUCCESS_TOAST
        })
      }
      setShowModal(false)
    }
  })

  const actionTextStyles = { textDecoration: 'underline', cursor: 'pointer' }

  const handleDelete = (addressId: string) => {
    deleteAddressQuery({ variables: { id: addressId } })
  }

  return (
    <Grid gridTemplateColumns={numberOfColumns} width="100%" height={height}>
      {showModal && (
        <DeleteItemsModal
          confirmationText={'confirmationTextAddress'}
          handleCancelButtonClicked={() => setShowModal(false)}
          handleDeleteButtonClicked={() => handleDelete(address.id)}
        />
      )}
      {showEditModal && (
        <ModalWrap
          title="Edit Address"
          isOpen={true}
          onClose={() => setShowEditModal(false)}
          isCentered
        >
          <Grid padding={5}>
            <DeliveryAddressForm editItem={address} />
          </Grid>
        </ModalWrap>
      )}
      {!mobileFlow && (
        <AddressInput
          type="checkbox"
          name={address?.address || ''}
          value={address?.address || ''}
          onChange={(event) => handleAddressSelected(event?.target?.value, event?.target?.checked)}
        />
      )}
      <Grid
        gridTemplateRows={`30px 1fr 25px`}
        background={theme.colors.accent[50]}
        borderRadius="10px"
        boxShadow={theme.boxShadowLight}
        width="95%"
        mb={5}
        ml={3}
        p={5}
      >
        <Grid gridTemplateColumns="1fr 1fr">
          <Text fontSize={16} fontWeight={600}>
            {address?.address}
          </Text>
          <Flex justifySelf="end" alignSelf="start">
            <Tag
              fontSize={12}
              mr={1}
              size="sm"
              background={theme.colors.tag}
              color={theme.colors.tagText}
            >
              {address?.type?.toUpperCase()}
            </Tag>
          </Flex>
        </Grid>
        {mobileFlow ? (
          <Grid gridTemplateColumns="1fr 20px">
            <Flex flexDirection="column">
              <AddressDetailsComponent address={address} />
            </Flex>
            <Flex alignSelf="center" onClick={clickHandler}>
              <ChevronRight />
            </Flex>
          </Grid>
        ) : (
          <AddressDetailsComponent address={address} />
        )}
        <Grid gridTemplateColumns="30px 30px" mt={3}>
          <Text
            onClick={handleEditAddressClicked}
            color="accent.500"
            style={actionTextStyles}
            fontSize="12px"
            fontWeight={600}
          >
            Edit
          </Text>
          <Text
            onClick={handleDeleteAddressClicked}
            color="accent.500"
            style={actionTextStyles}
            fontSize="12px"
            fontWeight={600}
          >
            Delete
          </Text>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AddressComponent
