import * as React from "react";

import InfoPage from "../../components/InfoPage";

import { images } from "../../theme";

type NoDataComponentProps = {
    header: string
    caption: string
};

const NoDataComponent: React.FC<NoDataComponentProps> = ({ header, caption }) => {
    return (
        <InfoPage
            image={images.emptyWishlist}
            header={header}
            caption={caption}
        />
    );
};

export default NoDataComponent;