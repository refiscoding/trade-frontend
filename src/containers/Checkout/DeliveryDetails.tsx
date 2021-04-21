import * as React from "react";
import { Grid, Flex, Image } from "@chakra-ui/core";

import Calendar from "../../components/Calendar";
import { Text } from "../../typography";

import { images, theme } from "../../theme";
import { TimeSlotProps } from ".";
import { TimeSlot } from "./AddressComponent";

type DeliveryInfoProps = {
    timeSlots: TimeSlot[]
    mobileFlow: boolean
};

const TimeSlotComponent: React.FC<TimeSlotProps> = ({ slot }) => {
    const [active, setActive] = React.useState<string | undefined>();
    const border = active ? `none` : theme.colors.background;
    const background = active ? theme.colors.brand[500] : theme.colors.background;
    const color = active ? theme.colors.accent[50] : "";
    const handleSlotClicked = () => {
        setActive(slot?.startTime);
    };
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
            <Text ml={2} fontSize={14}>{ slot?.startTime } - { slot?.endTime }</Text>
        </Flex>
    );
};

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ timeSlots, mobileFlow }) => {
    const marginLeft = mobileFlow ? "-13px" : "-17px";
    return(
        <Grid gridTemplateRows="35px 80px 40px 310px 50px 60px">
            <Text fontWeight={600}>When would like your order delivered?</Text>
            <Flex background={theme.colors.info} p={2} width="383px" marginLeft={marginLeft} height="60px" alignItems="center" justifyItems="space-between">
                <Image src={images.infoIcon} height="50%"/>
                <Text fontSize={12} ml={3}>
                    Selected date and time may differ according to transport companies' schedules.
                </Text>
            </Flex>
            <Text fontSize={14} fontWeight={600}>Select a date:</Text>
            <Calendar />
            <Text mt={5} fontSize={14} fontWeight={600}>Select a time range:</Text>
            <Grid gridTemplateColumns="1fr 1fr 1fr" columnGap="10px" pr={4}>
                {
                    timeSlots?.map((slot, index) => {
                        return (
                            <TimeSlotComponent key={`${index}_timelosts`} slot={slot} />
                        );
                    })
                }
            </Grid>
        </Grid>
    );
};

export default DeliveryInfo;
