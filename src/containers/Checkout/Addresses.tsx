import * as React from "react";

import { Button } from "@chakra-ui/core";
import AddressesContainer from "./AddressesContainer";
import AddressComponent, { Address } from "./AddressComponent";

type AddressesProps = {
    mobileFlow: boolean
    addresses: Address[]
    setActive: (step: number) => void 
};

const AddressesComponent: React.FC<AddressesProps> = ({ addresses, setActive, mobileFlow }) => {
    return (
        <React.Fragment>
            <AddressesContainer mobileFlow={mobileFlow}>
                {
                    addresses?.map((address, index) => {
                        return(
                            <AddressComponent 
                                key={`${index}_address`}
                                setActiveStep={setActive}
                                mobileFlow={mobileFlow}
                                address={address} 
                            />
                        )
                    })
                }
            </AddressesContainer>
            {
                !mobileFlow && (
                    <Button
                        justifySelf="end"
                        mt={-1}
                        width="25%"
                        type="submit"
                        variantColor="brand"
                        onClick={() => {}}
                    >
                        USE ADDRESS
                    </Button>
                )
            }
        </React.Fragment>
    );
};

export default AddressesComponent;