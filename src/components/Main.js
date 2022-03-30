import React from "react";
import yetigif from '../images/site-gifv3.gif'
import yetiGang from '../images/theGang.png'

const Main = ({
    button,
    supplyAvailable,
    maxPerTxn,
    maxYetis,
    isConnected,
    amountForGiveaway
}) => {
    return (
        <div>
            <div className="main-top">
                <img className="the-gang" src={yetiGang} alt="Yeti Gang"/>
            </div>
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
                        YETIPUNKS is a collection of 1,420 PFP Music NFTs vibed out on the Ethereum blockchain. Each YETIPUNK PFP is generated from over 225 traits and comes with a hip-hop beat attached. Holders will receive a free future mint, access to token gated discord server and more.
                    </p>
                </div>
                {supplyAvailable === amountForGiveaway && isConnected ? (
                    <div className="minting-section">
                        <h2>SOLD OUT</h2>
                        <h6>THANK YOU</h6>
                        <h6>YOU CAN STILL FIND YETIPUNKS ON THE SECONDARY MARKET</h6>
                        <div >
                            <a href='https://opensea.io/' rel="noreferrer" target="_blank" className="links">OPENSEA</a>
                            <a href='https://looksrare.org/' rel="noreferrer" target="_blank" className="links">LOOKSRARE</a>
                        </div>
                    </div>
                ) : (
                    <div className="minting-section">
                        {isConnected && (
                            <>
                                <h6>0.02 ETH</h6>
                                <h6>Max 6 per txn/wallet</h6>
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
        </div>
    );
};

export default Main;
