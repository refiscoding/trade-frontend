const timeSlots = [
  {
    id: '1',
    startTime: '08:00',
    endTime: '11:00'
  },
  {
    id: '2',
    startTime: '11:00',
    endTime: '14:00'
  },
  {
    id: '3',
    startTime: '14:00',
    endTime: '17:00'
  }
]

const cards = [
  {
    type: 'MasterCard',
    cardDescription: 'Savings Card',
    nameOnCard: 'John Al Does',
    cardNumber: '1980',
    expiryMonth: '07',
    expiryYear: '21',
    CVV: '123'
  },
  {
    type: 'VisaCard',
    cardDescription: 'Current Card',
    nameOnCard: 'Al Does John',
    cardNumber: '1280',
    expiryMonth: '08',
    expiryYear: '21',
    CVV: '123'
  },
  {
    type: 'FNB Switch',
    cardDescription: 'FNB Card',
    nameOnCard: 'Al John Does',
    cardNumber: '1860',
    expiryMonth: '09',
    expiryYear: '21',
    CVV: '123'
  }
]

export { timeSlots, cards }
