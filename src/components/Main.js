//rafce
import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'

import banner from '../images/yetibanner.png'
import banner2 from '../images/yetibanner-flipped.jpg'

const Main = ({button, supplyAvailable}) => {
    const [image, setImage] = useState(banner)
    const bannerClickHandler = () => {
        if (image === banner) {
            setImage(banner2)
        } else {
            setImage(banner)
        }
    }

    return (
        <div className = "main">
            <div className="prints">

            </div>
            <div>
                <img className = 'yeti-banner' src={image} onClick={bannerClickHandler} alt="banner-of-yetis"/>
                <div className='title-and-description'>
                    <h1 className="title">YETI PUNKS</h1>
                    <h2>NO ROADMAP</h2>
                    <h2>JUST ART AND GOOD VIBES</h2>
                    <p>10K randomly-generated ERC721 tokens chillin' on the Ethereum blockchain</p>
                </div>
                <div className="minting-section">
                    <h2>MINT A YETI PUNK</h2>
                    <h6>0.03 ETH</h6>
                    <h6>Max 20 per txn</h6>
                    <h6>Unlimited per wallet</h6>
                    <h6>Remaining: {supplyAvailable}/10000</h6>
                    {button}
                </div>
            </div>
            <div className="prints">

            </div>
        </div>
    )
}

export default Main
