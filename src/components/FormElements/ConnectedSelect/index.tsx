import { Flex, FormControl, FormLabel, Select, SelectProps } from '@chakra-ui/core'
import { useField } from 'formik'
import * as React from 'react'
import { Text } from '../../../typography'
import { LabelProps } from '../styles'

export type OptionType = {
  label: string
  value: any
}

export type ConnectedSelectProps = LabelProps &
  SelectProps & {
    label?: string
    name: string
    options: OptionType[]
  }

const ConnectedSelect: React.FC<ConnectedSelectProps> = ({ label, options, ...rest }) => {
  const [field, meta] = useField(rest.name)
  return (
    <Flex flexDirection="column" width="100%" mr={rest.mr} ml={rest.ml} mt={rest.mt} mb={rest.mb}>
      <FormControl>
        {label && <FormLabel htmlFor={field.name}>{label}</FormLabel>}
        <Select placeholder={rest.placeholder} focusBorderColor="accent.500" {...field} id={field.name} {...rest}>
          {options.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        {meta.touched && meta.error ? (
          <Text color="red.500" textAlign="right">
            {meta.error}
          </Text>
        ) : null}
      </FormControl>
    </Flex>
  )
}

export default ConnectedSelect

ConnectedSelect.defaultProps = {
  mb: 2,
  options: []
}
