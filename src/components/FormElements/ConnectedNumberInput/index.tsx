import {
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  NumberInputProps
} from '@chakra-ui/core'
import { useField } from 'formik'
import * as React from 'react'
import { Text } from '../../../typography'

type ConnectedNumberInputProps = NumberInputProps & {
  label?: string
  name: string
  unit?: string
}

const ConnectedNumberInput: React.FC<ConnectedNumberInputProps> = ({
  label,
  precision,
  unit,
  ...rest
}) => {
  const [field, meta] = useField(rest.name)
  return (
    <Flex flexDirection="column" width="100%" mr={rest.mr} ml={rest.ml} mt={rest.mt} mb={rest.mb}>
      <FormControl>
        {label && <FormLabel htmlFor={field.name}>{label}</FormLabel>}
        <InputGroup width="100%">
          {!!unit && <InputLeftAddon>{unit}</InputLeftAddon>}
          <NumberInput {...rest} precision={precision} step={0.01} width="100%">
            <NumberInputField
              {...field}
              id={field.name}
              roundedLeft={!!unit ? 0 : 4}
              focusBorderColor="accent.500"
            />
          </NumberInput>
        </InputGroup>
        {meta.touched && meta.error ? (
          <Text color="red.500" textAlign="right">
            {meta.error}
          </Text>
        ) : null}
      </FormControl>
    </Flex>
  )
}

export default ConnectedNumberInput

ConnectedNumberInput.defaultProps = {
  mb: 2,
  fontWeight: 'lighter',
  precision: 0
}
