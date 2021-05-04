import * as React from "react";

import { ArrowLeft, ChevronRight } from "react-feather";
import { Flex, Grid, GridProps, Image } from "@chakra-ui/core";
import { DateRangePicker } from "react-dates";


import { Text } from "../../typography";
import PageWrap from "../../layouts/PageWrap";
import { images } from "../../theme";

type OrdersProps = {};

type OrderHistoryContainerProps = GridProps & {
    mobileFlow: boolean
};

const OrderHistoryContainer: React.FC<OrderHistoryContainerProps> = ({ children, mobileFlow, ...rest }) => {
    const numberOfColumns = mobileFlow ? "1fr" : "1fr 1fr";
    const marginTop = mobileFlow ? 5 : 0
    const height = mobileFlow ? "100%" : "550px";
    const overflowY = mobileFlow ? "initial" : "scroll";
    const rowGap = mobileFlow ? "30px" : "90px";
    return (
        <Grid mt={marginTop} rowGap={rowGap} columnGap="10px" gridTemplateRows="auto auto auto" gridTemplateColumns={numberOfColumns} width="100%" height={height} overflowY={overflowY} {...rest} >
            {children}
        </Grid>
    );
};
type OrderHistoryEntryProps = GridProps & {
};

const OrderHistoryEntry: React.FC<OrderHistoryEntryProps> = () => {
    return (
        <Grid
            borderRadius="10px"
            boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)"
            backgroundColor="white"
            p={4}
            height="200px"
        >
            <Flex>
                <Text>Date</Text>
                <ChevronRight />
            </Flex>
            <Flex>Signed</Flex>
            <Flex>
                <Flex>
                    <Image height="50%" src={images.MailBox} />
                </Flex>
                <Flex flexDirection="column">
                    <Flex>Product Name</Flex>
                    <Flex>Product Price</Flex>
                </Flex>
            </Flex>
        </Grid>
    );
};

const OrdersPage: React.FC<OrdersProps> = () => {

    return (
        <PageWrap title="Orders" width="100%">
            <Grid gridTemplateRows="50px 30px 50px 1fr" width="100%">
                <Flex>
                    <ArrowLeft />
                    <Text ml={3} fontSize={16} fontWeight={600}>My Order History</Text>
                </Flex>
                <Text>Select Date Range:</Text>
                <Flex width="100%">

                    <DateRangePicker
                        startDate={null}
                        endDate={null}
                        startDateId="start"
                        endDateId="end"
                        onDatesChange={() => console.log("TODO: Add Handler")}
                        focusedInput={null}
                        onFocusChange={() => console.log("TODO: Add Handler")}
                    />
                </Flex>
                <Flex
                    mt={5}
                    pl={5}
                    height="50px"
                    borderRadius="10px"
                    boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)"
                    width="100%"
                    justify="space-between"
                    alignItems="center"
                    onClick={() => console.log("TODO: Add Handler")}
                    backgroundColor="white"
                >
                    <Flex width="80%">
                        <Text fontSize={12}>Return an order?</Text>
                    </Flex>
                    <ChevronRight />
                </Flex>
                <OrderHistoryContainer mobileFlow>
                    {
                        [1, 2].map((index: number) => (<OrderHistoryEntry key={`${index}_histry`} />))
                    }
                </OrderHistoryContainer>
            </Grid>
        </PageWrap>
    )

};
export default OrdersPage;