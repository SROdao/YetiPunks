import React from 'react'

import CarouselComponent from './CarouselComponent'

const Main = ({ button, supplyAvailable, maxPerTxn, maxYetis, isConnected }) => {
    return (
        <div className="main">
            {/* <div className="prints"> */}

            {/* </div> */}
            <div>
                <CarouselComponent />
                <div className='title-and-description'>
                    <h1 className="title">YETIPUNKS</h1>
                </div>
                {supplyAvailable === maxYetis && isConnected ?
                    (<div className='minting-section'>
                        <h2>SOLD OUT</h2>
                        <h6>THANK YOU YETI PUNKS</h6>
                        <h6>YOU CAN STILL FIND A YETI ON THE SECONDARY MARKET</h6>
                    </div>) :
                    <div className="minting-section">
                        {isConnected && (<>
                                <h6>0.024 ETH</h6>
                                <h6>Max {maxPerTxn} per txn/wallet</h6>
                                <h6>Remaining: {supplyAvailable}/{maxYetis}</h6>
                            </>)
                            }
                        {button}
                    </div>
                }
            </div>
            {/* <div className="prints"> */}

            {/* </div> */}
        </div>
    )
}

export default Main
