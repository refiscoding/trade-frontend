import * as React from 'react'

import { Form, Formik } from 'formik'
import { Button, Checkbox, Flex, FlexProps } from '@chakra-ui/core'

import { Text } from '../../typography'
import { ModalWrap } from '../../components'
import { ConnectedFormGroup } from '../../components/FormElements'

type CheckoutSignatoryModalProps = FlexProps & {
  setShowCheckoutModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

const CheckoutSignatoryModal: React.FC<CheckoutSignatoryModalProps> = ({
  setShowCheckoutModal
}) => {
  const handleIsCustomerClicked = () => {}
  return (
    <ModalWrap
      title="Sign for package"
      isOpen={true}
      onClose={() => setShowCheckoutModal(false)}
      isCentered
    >
      <Flex padding={5}>
        <Formik initialValues={{ signatoryName: '', signatoryRelation: '' }} onSubmit={() => {}}>
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup label="Signatory Name*" name="signatoryName" type="text" />
            <ConnectedFormGroup
              label="Signatory-Customer Relation*"
              name="signatoryRelation"
              type="text"
            />
            <Flex>
              <Checkbox name="rememberMe" mr={3} onChange={handleIsCustomerClicked} />
              <Flex align="center" justify="center">
                <Text>I have a tradeFed account</Text>
              </Flex>
            </Flex>
            <Button
              mt={4}
              width="100%"
              type="submit"
              variantColor="brand"
              // isLoading={isSubmitting}
            >
              SIGN PACKAGE
            </Button>
          </Form>
        </Formik>
      </Flex>
    </ModalWrap>
  )
}

export default CheckoutSignatoryModal
