import {
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement
} from '@chakra-ui/core'
import { InputProps } from '@chakra-ui/core/dist/Input'
import { useField } from 'formik'
import * as React from 'react'
import { Text } from '../../../typography'
import { LabelProps } from '../styles'

export type ConnectedFormGroupProps = LabelProps &
  InputProps & {
    label?: string
    name: string
    icon?: React.FC
    iconPosition?: string
  }

const ConnectedFormGroup: React.FC<ConnectedFormGroupProps> = ({
  label,
  icon,
  iconPosition,
  ...rest
}) => {
  const [field, meta] = useField(rest.name)

  return (
    <Flex flexDirection="column" width="100%" mr={rest.mr} ml={rest.ml} mt={rest.mt} mb={rest.mb}>
      <FormControl>
        {label && <FormLabel htmlFor={field.name}>{label}</FormLabel>}
        <InputGroup size="md" flexDirection="row-reverse">
          <Input
            borderColor={meta.touched ? (meta.error ? 'red.500' : 'success.400') : 'brand.200'}
            focusBorderColor="accent.500"
            {...field}
            id={field.name}
            {...rest}
          />
          {icon &&
            (iconPosition === 'left' ? (
              <InputLeftElement>
                <Icon
                  size="20px"
                  onClick={() => {
                    return
                  }}
                  as={icon}
                  color={'primary.400'}
                />
              </InputLeftElement>
            ) : (
              <InputRightElement>
                <Icon
                  size="20px"
                  onClick={() => {
                    return
                  }}
                  as={icon}
                  color={'primary.400'}
                />
              </InputRightElement>
            ))}
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

export default ConnectedFormGroup

ConnectedFormGroup.defaultProps = {
  mb: 2,
  type: 'text'
}
