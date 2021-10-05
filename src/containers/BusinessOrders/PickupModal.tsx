import * as React from 'react'

import { Image, Flex, Grid, Button } from '@chakra-ui/core'
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
      <Flex justifyContent="center" pb={4}>
        <Button width="50%" variantColor="brand" onClick={handleGenerateLabel}>
          GENERATE LABEL
        </Button>
      </Flex>
    </ModalWrap>
  )
}

export default PickupModal
