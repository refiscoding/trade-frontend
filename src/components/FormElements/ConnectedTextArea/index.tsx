import * as React from 'react'
import { useField } from 'formik'
import { InputProps } from '@chakra-ui/core/dist/Input'
import { Flex, FormControl, FormLabel, Textarea } from '@chakra-ui/core'

import TextAreaWithTags from '../../BadgeTextArea'
import { LabelProps } from '../styles'
import { Text } from '../../../typography'

export type ConnectedTextareaProps = LabelProps &
  InputProps & {
    label?: string
    hasTags?: boolean
    name: string
    handleSetTags: (tags: string[]) => void
  }

const ConnectedTextarea: React.FC<ConnectedTextareaProps> = ({
  handleSetTags,
  label,
  hasTags,
  ...rest
}) => {
  const [field, meta] = useField(rest.name)
  return (
    <Flex flexDirection="column" width="100%" mr={rest.mr} ml={rest.ml} mt={rest.mt} mb={rest.mb}>
      <FormControl>
        {label && <FormLabel htmlFor={field.name}>{label}</FormLabel>}
        {hasTags ? (
          <TextAreaWithTags handleSetTags={handleSetTags} />
        ) : (
          <Textarea focusBorderColor="accent.500" {...field} id={field.name} {...rest} />
        )}
        {meta.touched && meta.error ? (
          <Text color="red.500" textAlign="right">
            {meta.error}
          </Text>
        ) : null}
      </FormControl>
    </Flex>
  )
}

export default ConnectedTextarea

ConnectedTextarea.defaultProps = {
  mb: 2,
  type: 'text'
}
