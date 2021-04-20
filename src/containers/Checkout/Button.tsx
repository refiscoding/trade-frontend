import * as React from "react";

import { Button } from "@chakra-ui/core";

type StepButtonProps = {
    active: number
    setActive: (step: number) => void
};

const StepButton: React.FC<StepButtonProps> = ({ children, setActive, active }) => {
    return (
        <Button
            mt={5}
            width="100%"
            type="button"
            variantColor="brand"
            variant="solid"
            onClick={() => setActive(active + 1)}
        >
            { children }
        </Button>
    );
};
export default StepButton;