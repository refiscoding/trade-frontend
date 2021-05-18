import * as React from 'react';
import { Trash2 } from "react-feather";
import { Grid } from '@chakra-ui/core';
import { FlexProps } from '@chakra-ui/core/dist/Flex';

import { Text } from "../../typography";
import { theme } from '../../theme';

type DeleteItemsButtonProps = FlexProps & {
  handleDeleteButtonClicked: () => void
};

const DeleteItemsButton: React.FC<DeleteItemsButtonProps> = ({ handleDeleteButtonClicked }) => {
  return (
    <Grid onClick={handleDeleteButtonClicked} templateRows="25px 1fr" justifyItems="center" mt={5}>
      <Trash2 color={theme.colors.dimText} />
      <Text color={theme.colors.dimText} textAlign="center"> Remove Items</Text>
    </Grid>
  );
};

export default DeleteItemsButton;
