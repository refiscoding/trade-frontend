import * as React from 'react'
import { Button, Flex } from '@chakra-ui/core'

import AddressesContainer from './AddressesContainer'
import AddressComponent from './AddressComponent'
import { ComponentLocationAddress } from '../../generated/graphql'

type AddressesProps = {
  mobileFlow: boolean
  addresses?: ComponentLocationAddress[]
  setActive: (step: number) => void
  setSelectedAddress: React.Dispatch<React.SetStateAction<ComponentLocationAddress | undefined>>
}

const AddressesComponent: React.FC<AddressesProps> = ({
  addresses,
  setActive,
  mobileFlow,
  setSelectedAddress
}) => {
  const [activateButton, setActivateButton] = React.useState<boolean>(true)

  return (
    <React.Fragment>
      <AddressesContainer mobileFlow={mobileFlow}>
        {addresses?.map((address, index) => {
          return (
            <AddressComponent
              key={`${index}_address`}
              address={address}
              addresses={addresses}
              mobileFlow={mobileFlow}
              setActiveStep={setActive}
              setSelectedAddress={setSelectedAddress}
              setActivateButton={setActivateButton}
            />
          )
        })}
      </AddressesContainer>
      {!mobileFlow && (
        <Flex pt={5} justifySelf="end">
          <Button
            mt={-3}
            width="100%"
            type="submit"
            variantColor="brand"
            isDisabled={activateButton}
            onClick={() => setActive(1)}
          >
            USE ADDRESS
          </Button>
        </Flex>
      )}
    </React.Fragment>
  )
}

export default AddressesComponent
