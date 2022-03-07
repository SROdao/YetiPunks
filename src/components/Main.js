import React from "react";
import yetigif from '../images/yetishow.gif'

const Main = ({
    button,
    supplyAvailable,
    maxPerTxn,
    maxYetis,
    isConnected,
}) => {
    const amountForGiveaway = 25;
    return (
        <div className="main">
            <div className="main-left">
                    <img
                    className="yeti-carousel-image"
                    src={yetigif}
                    alt='yetis'
                />
            </div>
            <div className="main-right">
                <div className="title-and-description">
                    <h1 className="title">YETIPUNKS</h1>
                </div>
                <div className="block-text">
                    <p>
                    Deep in the Valhalla Mountains of Hourglass live the YETIPUNKS. Far away from civilization and far away from the chaos. They live a simple life, filled with good vibes and only the best herb. The streams from the snow capped mountains are filled with magical nutrients that help grow nugs the size of a Redwood tree. All YETIPUNKS have different traits and features but they pride themselves on inclusivity and community. They're always down to lend a helping hand, so never fear… you will always have a fren in the YETIPUNKS.
                    </p>
                </div>
                {supplyAvailable === amountForGiveaway && isConnected ? (
                    <div className="minting-section">
                        <h2>SOLD OUT</h2>
                        <h6>THANK YOU</h6>
                        <h6>YOU CAN STILL FIND YETIPUNKS ON THE SECONDARY MARKET</h6>
                        <div >
                            <a href='https://opensea.io/' rel="noreferrer" target="_blank" className="links">OPENSEA</a>
                            <a href='https://looksrare.org/'rel="noreferrer" target="_blank" className="links">LOOKSRARE</a>
                        </div>
                    </div>
                ) : (
                    <div className="minting-section">
                        {isConnected && (
                            <>
                                <h6>0.024 ETH</h6>
                                <h6>Max {maxPerTxn} per txn/wallet</h6>
                                <h6>
                                    Remaining: {supplyAvailable - amountForGiveaway}/{maxYetis}
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
