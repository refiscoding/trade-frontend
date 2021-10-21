import { Checkbox, CheckboxProps, Flex } from '@chakra-ui/core'
import { useField } from 'formik'
import * as React from 'react'
import { Text } from '../../../typography'
import { LabelProps } from '../styles'

export type ConnectedCheckboxProps = LabelProps &
  CheckboxProps & {
    reverse?: boolean
    checked?: boolean
    label?: string
    hideError?: boolean
    name: string
  }

const ConnectedCheckbox: React.FC<ConnectedCheckboxProps> = ({
  reverse,
  label,
  checked,
  hideError,
  ...rest
}) => {
  const [field, meta] = useField(rest.name)

  return (
    <Flex
      mb={rest.mb}
      ml={rest.ml}
      mr={rest.mr}
      mt={rest.mt}
      width="100%"
      align="center"
      justify={rest.justifyContent}
    >
      {
        <Checkbox
          borderColor="gray.400"
          flexDirection={reverse ? 'row-reverse' : 'initial'}
          justifyContent="space-between"
          defaultIsChecked={checked}
          {...field}
          id={field.name}
          {...rest}
        >
          {label}
        </Checkbox>
      }
      {meta.touched && meta.error && !hideError ? (
        <Text color="red.500" textAlign="right" margin={2}>
          {meta.error}
        </Text>
      ) : null}
    </Flex>
  )
}

export default ConnectedCheckbox

ConnectedCheckbox.defaultProps = {
  mb: 2,
  alignItems: 'center',
  justifyContent: 'flex-start'
}
