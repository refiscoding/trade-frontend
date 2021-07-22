import { theme } from '../../theme'
import { Order } from '../../generated/graphql'

const setOrderStatusAndColor = (order: Order | undefined) => {
  let status = ''
  let colors: { background: string; color: string } = { background: '', color: '' }
  switch (order?.status) {
    case 'INITIATED':
      status = 'Placed'
      colors = {
        background: '#c9cfd4',
        color: ''
      }
      return {
        colors,
        status
      }
    case 'DELIVERY_PAID':
      status = 'Delivery Paid'
      colors = {
        background: '#B6DAF5',
        color: theme.colors.tagText
      }
      return {
        colors,
        status
      }
    case 'PACKED':
      status = 'Packed'
      colors = {
        background: theme.colors.brand[500],
        color: theme.colors.accent[50]
      }
      return {
        colors,
        status
      }
    case 'DISPATCHED':
      status = 'Dispatched'
      colors = {
        background: '#B6DAF5',
        color: theme.colors.tagText
      }
      return {
        colors,
        status
      }
    case 'DELIVERED':
      status = 'Delivered'
      colors = {
        background: theme.colors.greenFill,
        color: theme.colors.accent[50]
      }
      return {
        colors,
        status
      }
    case 'RETURNED':
      status = 'Returned Items'
      colors = {
        background: '#c9cfd4',
        color: ''
      }
      return {
        colors,
        status
      }
    case 'PAYMENT_FAILED':
      status = 'Payment Failed'
      colors = {
        background: '#CF2121',
        color: theme.colors.accent[50]
      }
      return {
        colors,
        status
      }
    case 'PAYMENT_SUCCESSFUL':
      status = 'Paid'
      colors = {
        background: '#f0943d',
        color: theme.colors.accent[50]
      }
      return {
        colors,
        status
      }
    case 'COMPLETED':
      status = 'Past'
      colors = {
        background: '#c9cfd4',
        color: ''
      }
      return {
        colors,
        status
      }
  }
}
export default setOrderStatusAndColor
