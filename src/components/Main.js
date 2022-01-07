//rafce
import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'

import Player from './Player'
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
            <img className = 'yeti-banner' src={image} onClick={bannerClickHandler} alt="banner-of-yetis"/>
            <div className='float-text font'>
                <h1>NO ROADMAP</h1>
                <h1>JUST VIBES</h1>
            </div>
            <div className="info">
                10K randomly-generated ERC721 tokens chillin' on the Ethereum blockchain
            </div>
            <div className="d-flex justify-content-center">
                <div className='d-flex flex-column m-5'>
                    <h1>MINT A YETI PUNK</h1>
                    <h6>0.03 ETH</h6>
                    <h6>Max 20 per txn</h6>
                    <h6>Unlimited per wallet</h6>
                    <h6>Remaining: {supplyAvailable}/10000</h6>
                    {button}
                </div>
            </div>
        </div>
    )
}

Main.defaultProps = {
    yetiCount: "10000"
};

Main.propTypes={
    count:PropTypes.string.isRequired
}

export default Main
