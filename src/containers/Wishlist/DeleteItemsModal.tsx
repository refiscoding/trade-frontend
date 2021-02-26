import * as React from 'react';
import { Image, Grid, Button } from '@chakra-ui/core';
import { FlexProps } from '@chakra-ui/core/dist/Flex';

import { images } from '../../theme';
import { ModalWrap } from '../../components';
import { Text } from "../../typography";

type DeleteItemsModalProps = FlexProps & {
    handleCancelButtonClicked: () => void
    handleDeleteButtonClicked: () => void
};

const DeleteItemsModal: React.FC<DeleteItemsModalProps> = ({ handleCancelButtonClicked, handleDeleteButtonClicked }) => {
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
                    You are about to delete these items in your wish list? Once they are removed, you’ll have to re-add them to your wish list manually.
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
