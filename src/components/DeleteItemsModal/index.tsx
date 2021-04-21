import * as React from 'react';

import { Image, Grid, Button } from '@chakra-ui/core';
import { FlexProps } from '@chakra-ui/core/dist/Flex';

import { images } from '../../theme';
import ModalWrap from '../ModalWrap';
import { Text } from "../../typography";

type DeleteItemsModalProps = FlexProps & {
    handleCancelButtonClicked: () => void
    handleDeleteButtonClicked: () => void
    isCart?: boolean
    confirmationText: string
};

const DeleteItemsModal: React.FC<DeleteItemsModalProps> = ({ handleCancelButtonClicked, handleDeleteButtonClicked, confirmationText }) => {
    return(
      <ModalWrap
          title="Delete Items"
          isOpen={true}
          onClose={handleCancelButtonClicked}
          isCentered
        >
            <Grid gridTemplateRows="repeat(1fr, 2)" justifyItems="center" padding={5}>
                <Image src={images?.deleteItems} />
                <Text mt={4} fontSize="14px" textAlign="center">
                    { confirmationText }
                </Text>  
            </Grid>
            <Grid gridTemplateColumns="repeat(2, 1fr)" gap="10px" padding={5}>
                <Button width="100%" onClick={handleCancelButtonClicked} mt={4}  variantColor="gray" variant="outline">
                    Cancel
                </Button>
                <Button width="100%" onClick={handleDeleteButtonClicked} mt={4} variantColor="brand">
                    Delete
                </Button>
            </Grid>
      </ModalWrap>
    );
};    

export default DeleteItemsModal;
