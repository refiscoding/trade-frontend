import * as React from 'react';
import { Trash2 } from "react-feather";
import { Grid } from '@chakra-ui/core';
import { FlexProps } from '@chakra-ui/core/dist/Flex';

import { Text } from "../../typography";

type DeleteItemsButtonProps = FlexProps & {
  handleDeleteButtonClicked: () => void
};

const DeleteItemsButton: React.FC<DeleteItemsButtonProps> = ({ handleDeleteButtonClicked }) => {
  // TODO: Have it dull until a user selects at least one product -> change color based on flag
  return (
    <Grid onClick={() => handleDeleteButtonClicked()} templateRows="25px 1fr" justifyItems="center" mt={5}>
      <Trash2 color="#6A6A6A" />
      <Text color="#6A6A6A" textAlign="center"> Remove Items</Text>
    </Grid>
  );
};

export default DeleteItemsButton;
