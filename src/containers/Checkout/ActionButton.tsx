import * as React from "react";

import { Flex } from "@chakra-ui/core";

import { theme } from "../../theme";

type ActionButtonComponentProps = {
    setActive: (step: number) => void
};

const ActionButtonComponent: React.FC<ActionButtonComponentProps> = ({ children, setActive }) => {
    return (
        <Flex
            mt={5}
            pl={5}
            height="50px"
            borderRadius="10px"
            boxShadow={theme.boxShadowLight}
            width="100%"
            justify="space-between"
            alignItems="center"
            onClick={() => setActive(1)}
            backgroundColor={theme.colors.accent[50]}
        >
            { children }
        </Flex>
    );
};

export default ActionButtonComponent;
