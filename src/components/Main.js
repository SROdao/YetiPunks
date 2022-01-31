import React from 'react'

import CarouselComponent from './CarouselComponent'

const Main = ({button, supplyAvailable}) => {
    return (
        <div className = "main">
            {/* <div className="prints"> */}

            {/* </div> */}
            <div>
                <CarouselComponent />
                <div className='title-and-description'>
                    <h1 className="title">YETIPUNKS</h1>
                    {/* <h2>NO ROADMAP</h2>
                    <h2>JUST ART AND GOOD VIBES</h2>
                    <p>10K randomly-generated ERC721 tokens chillin' on the Ethereum blockchain</p> */}
                </div>
                {supplyAvailable === 10000 ? 
                (<div className='minting-section'>
                        <h2>SOLD OUT</h2>
                        <h6>THANK YOU YETI PUNKS </h6>
                        <h6>YOU CAN STILL SNAG A YETI ON THE SECONDARY MARKET</h6>
                    </div>) : 
                (<div className="minting-section">
                    {/* <h2>MINT A YETI PUNK</h2> */}
                    <h6>0.03 ETH</h6>
                    <h6>Max 20 per txn</h6>
                    <h6>Unlimited per wallet</h6>
                    <h6>Remaining: {supplyAvailable}/10000</h6>
                    {button}
                </div>)}

            </div>
            {/* <div className="prints"> */}

            {/* </div> */}
        </div>
    )
}

export default Main
