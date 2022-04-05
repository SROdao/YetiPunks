import React from "react";
import yetigif from '../images/YPfinalsitemintv3.gif'
import yetiGang from '../images/theGang.png'
import Countdown from 'react-countdown';

const Completionist = () => <span>Minting is finished!</span>;
const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return <span>Mint ends: {days} days {hours} hours {minutes} minutes {seconds} seconds</span>;
    }
  };

  
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
                        YETIPUNKS is a collection of 1,420 PFP Music NFTs vibed out on the Ethereum blockchain. </p>
                        <p> Each YETIPUNK is generated from over 225 traits and comes with 1 of 16 original hip-hop beats attached.    </p>
                        <p> Holders will receive exclusive access to future projects, private discord server and more.
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
                        <div className="count-down">
                        <Countdown date={new Date(Date.UTC('2022','03','12','20','20','0','0')) } renderer={renderer}/>
                        </div>
                        
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default Main;
