import * as React from 'react'

import { Image, Grid, Button } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'

import { images } from '../../theme'
import ModalWrap from '../../components/ModalWrap'
import { Text } from '../../typography'
import { useHistory } from 'react-router-dom'

type PickupModalProps = FlexProps & {
  handleCancelButtonClicked: () => void
  handleSelectedLabelItem: () => void
  confirmationText: string
}

const PickupModal: React.FC<PickupModalProps> = ({
  confirmationText,
  handleCancelButtonClicked,
  handleSelectedLabelItem
}) => {
  const history = useHistory()

  const handleGenerateLabel = () => {
    handleSelectedLabelItem()
    history.push('/generate-label')
  }

  return (
    <ModalWrap title="Polite Notice" isOpen={true} onClose={handleCancelButtonClicked} isCentered>
      <Grid gridTemplateRows="repeat(1fr, 2)" justifyItems="center" padding={5}>
        <Image src={images?.beforeChekout} />
        <Text mt={4} fontSize="14px" textAlign="center">
          {confirmationText}
        </Text>
      </Grid>
      <Grid gridTemplateColumns="repeat(2, 1fr)" gap="10px" padding={5}>
        <Button width="100%" onClick={() => {}} mt={4} variantColor="gray" variant="outline">
          USE OWN LABEL
        </Button>
        <Button mt={4} width="100%" variantColor="brand" onClick={handleGenerateLabel}>
          GENERATE LABEL
        </Button>
      </Grid>
    </ModalWrap>
  )
}

export default PickupModal
