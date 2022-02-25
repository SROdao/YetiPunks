import React from "react";

import CarouselComponent from "./CarouselComponent";

const Main = ({
    button,
    supplyAvailable,
    maxPerTxn,
    maxYetis,
    isConnected,
}) => {
    return (
        <div className="main">
            <div className="main-left">
                <CarouselComponent />
            </div>
            <div className="main-right">
                <div className="title-and-description">
                    <h1 className="title">YETIPUNKS</h1>
                </div>
                <div className="block-text">
                    <p>
                        Deep in the valhalla mountains live the YETIPUNKS. far away from
                        civilization and far away from the chaos. They live a simple life,
                        filled with good vibes and only the best herb. the water from the
                        ice cap mountains is filled with magical nutrients that grows nugs
                        the size of a tree in the redwood forest. All YETIPUNKS have
                        different traits and features but they pride themselves on
                        inclusivity and community. They're always down to lend a helping
                        hand, so never fear… you will always have a fren in the YETIPUNKS.
                    </p>
                </div>
                {supplyAvailable === maxYetis && isConnected ? (
                    <div className="minting-section">
                        <h2>SOLD OUT</h2>
                        <h6>THANK YOU YETI PUNKS</h6>
                        <h6>YOU CAN STILL FIND A YETI ON THE SECONDARY MARKET</h6>
                    </div>
                ) : (
                    <div className="minting-section">
                        {isConnected && (
                            <>
                                <h6>0.024 ETH</h6>
                                <h6>Max {maxPerTxn} per txn/wallet</h6>
                                <h6>
                                    Remaining: {supplyAvailable}/{maxYetis}
                                </h6>
                            </>
                        )}
                        {button}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Main;
