import * as React from "react";

import { Button } from "@chakra-ui/core";
import CardsContainer from "./CardsContainer";
import CardComponent, { Card } from "./CardComponent";

type CardsProps = {
    cards: Card[]
    mobileFlow: boolean
    checkoutTotal: number
    setShowDeleteCardModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
};

const CardsComponent: React.FC<CardsProps> = ({ cards, mobileFlow, checkoutTotal, setShowDeleteCardModal }) => {
    return (
        <React.Fragment>
            <CardsContainer mobileFlow={mobileFlow}>
                {
                    cards?.map((card, index) => {
                        return(
                            <CardComponent
                                setShowDeleteCardModal={setShowDeleteCardModal}
                                key={`${index}_address`} 
                                mobileFlow={mobileFlow}
                                card={card} 
                            />
                        )
                    })
                }
            </CardsContainer>
            {
                !mobileFlow && (
                    <Button
                        justifySelf="end"
                        mt={-1}
                        width="25%"
                        type="submit"
                        variantColor="brand"
                    >
                        {`PAY R ${checkoutTotal}.00`}
                    </Button>
                )
            }
        </React.Fragment>
    );
};

export default CardsComponent;