import * as React from 'react'
import { Grid, Flex, Image } from '@chakra-ui/core'

import Calendar from '../../components/Calendar'
import { Text } from '../../typography'

import { images, theme } from '../../theme'
import { TimeSlotProps } from '.'
import { TimeSlot } from './AddressComponent'

type DeliveryInfoProps = {
  timeSlots: TimeSlot[]
  mobileFlow: boolean
  nextClicked: boolean | undefined
  selectedDeliveryDate: Date | Date[]
  selectedDeliveryTimeslot: string | undefined
  setNextClicked: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setSelectedDeliveryDate: React.Dispatch<React.SetStateAction<Date | Date[]>>
  setSelectedDeliveryTimeslot: React.Dispatch<React.SetStateAction<string | undefined>>
}

const TimeSlotComponent: React.FC<TimeSlotProps> = ({
  slot,
  setSelectedDeliveryTimeslot,
  selectedDeliveryTimeslot
}) => {
  const [active, setActive] = React.useState<string>('')

  const theOne = active === selectedDeliveryTimeslot
  const border = theOne ? `none` : theme.colors.background
  const background = theOne ? '#006edc' : theme.colors.background
  const color = theOne ? theme.colors.accent[50] : ''
  const handleSlotClicked = () => {
    setActive(slot?.id)
    setSelectedDeliveryTimeslot(slot?.id)
  }
  return (
    <Flex
      height="60%"
      borderRadius={3}
      cursor="pointer"
      alignItems="center"
      border={border}
      background={background}
      color={color}
      onClick={handleSlotClicked}
    >
      <Text ml={2} fontSize={14}>
        {slot?.startTime} - {slot?.endTime}
      </Text>
    </Flex>
  )
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({
  timeSlots,
  mobileFlow,
  setSelectedDeliveryDate,
  setSelectedDeliveryTimeslot,
  selectedDeliveryTimeslot,
  nextClicked
}) => {
  const marginLeft = mobileFlow ? '-13px' : '-17px'
  return (
    <Grid gridTemplateRows="35px 80px 40px 355px 50px 60px">
      <Text fontWeight={600}>When would like your order delivered?</Text>
      <Flex
        background={theme.colors.info}
        p={2}
        width="383px"
        marginLeft={marginLeft}
        height="60px"
        alignItems="center"
        justifyItems="space-between"
      >
        <Image src={images.infoIcon} height="50%" />
        <Text fontSize={12} ml={3}>
          We currently do not offer delivery services. The selected date and time may differ
          according to the schedule of the transport providers.
        </Text>
      </Flex>
      <Text fontSize={14} fontWeight={600}>
        Select a date:
      </Text>
      <Flex flexDirection="column" mb={5}>
        <Calendar setSelectedDeliveryDate={setSelectedDeliveryDate} />
        {nextClicked && !setSelectedDeliveryDate && (
          <Text fontSize={12} color={theme.colors.errorText}>
            Select Date
          </Text>
        )}
      </Flex>
      <Text mt={5} fontSize={14} fontWeight={600}>
        Select a time range:
      </Text>
      <Grid gridTemplateRows="55px 15px">
        <Grid gridTemplateColumns="1fr 1fr 1fr" columnGap="10px" pr={4}>
          {timeSlots?.map((slot, index) => {
            return (
              <TimeSlotComponent
                key={`${index}_timelosts`}
                slot={slot}
                setSelectedDeliveryTimeslot={setSelectedDeliveryTimeslot}
                selectedDeliveryTimeslot={selectedDeliveryTimeslot}
              />
            )
          })}
        </Grid>
        <Flex mt={-3} justifySelf="start">
          {nextClicked && !setSelectedDeliveryTimeslot && (
            <Text fontSize={12} color={theme.colors.errorText}>
              Select Time Slot
            </Text>
          )}
        </Flex>
      </Grid>
    </Grid>
  )
}

export default DeliveryInfo
