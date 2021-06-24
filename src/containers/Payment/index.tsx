import * as React from 'react'

import { useToast } from '@chakra-ui/core'
import { useHistory } from 'react-router-dom'

import InfoPage from '../../components/InfoPage'

import { images } from '../../theme'
import { PageWrap } from '../../layouts'

import { useValidateTransactionQuery } from '../../generated/graphql'
import { ApolloError } from 'apollo-boost'
import { ERROR_TOAST } from '../../constants'

type ParamsType = {
  txnToken: string
}

type MessageMap = {
  header: string
  caption: string
}

const statusMap = {
  failed: {
    header: 'Payment Failed ...',
    caption: 'We could not complete your payment. Please try again'
  },
  success: {
    header: 'Payment Succeeded ...',
    caption: 'Your payment was successful, thank you for shopping at TradeFed'
  },
  pending: {
    header: 'Processing Payment...',
    caption: 'Please hold as process your payment'
  },
  default: {
    header: 'Fetching Payment Details...',
    caption: 'Please hold as we check the payment details you provided'
  }
}

const CheckoutPaymentValidation: React.FC = () => {
  const toast = useToast()
  const history = useHistory()
  const [transaction, setTransaction] = React.useState<string>()
  const [currentMessageMap, setCurrentMessageMap] = React.useState<MessageMap>(statusMap.default)
  const [currentMessageImage, setCurrentMessageImage] = React.useState<string>(
    images.processingPayment
  )

  const redirectWithDelay = (location: string) => {
    setTimeout(() => {
      history.push(location)
    }, 3000)
  }

  const txnToken = history?.location?.search?.split('=')[1]

  const { loading } = useValidateTransactionQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    variables: {
      txnToken: transaction ? transaction : txnToken
    },
    onCompleted: ({ validateTransaction }) => {
      const status = validateTransaction?.status
      const orderId = validateTransaction?.transaction?.order?.id
      const orderNumber = validateTransaction?.transaction?.order?.orderNumber

      const failed = /FAILED/.test(status)
      const succeeded = /SUCCESS/.test(status)
      const pending = /PROCESSING/.test(status)

      switch (true) {
        case failed:
          setCurrentMessageMap(statusMap.failed)
          setCurrentMessageImage(images?.processingPaymentError)
          redirectWithDelay(`/checkout?status=failed&order=${orderId}`)
          break
        case succeeded:
          setCurrentMessageMap(statusMap.success)
          redirectWithDelay(`/checkout-success?status=success&order=${orderNumber}`)
          break
        case pending:
          setCurrentMessageMap(statusMap.pending)
          break
      }
    }
  })

  React.useEffect(() => {
    const txnToken = history?.location?.search?.split('=')[1]
    if (txnToken) {
      setTransaction(txnToken)
    }
  }, [history])
  return (
    <PageWrap
      title="Processing Payment..."
      align="center"
      backgroundSize="cover"
      justify="center"
      pt={0}
    >
      <InfoPage
        image={currentMessageImage}
        header={currentMessageMap?.header}
        caption={currentMessageMap?.caption}
        action={() => history.push('/')}
        loading={loading}
        actionText="OK"
      />
    </PageWrap>
  )
}

export default CheckoutPaymentValidation
