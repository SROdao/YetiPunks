//rafce
import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import banner from '../images/yetibanner.png'
import banner2 from '../images/yetibanner-flipped.jpg'

const Main = ({button}) => {
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
            <img className = 'yeti-banner' src={image} onClick={bannerClickHandler}/>
            <div className='float-text font'>
                <h1>NO ROADMAP</h1>
                <h1>JUST YETI GOOD VIBES</h1>
                
            </div>
            <div className="font">
                10K randomly-generated ERC721 tokens chillin' on the Ethereum blockchain
            </div>
            <div className="d-flex justify-content-center font">
                <div className='d-flex flex-column m-5 font'>
                    <h1>MINT A YETI PUNK</h1>
                    <h6>Remaining: 10000/10000</h6>
                    <h6>0.03 ETH</h6>
                    {button}
                </div>
            </div>
        </div>
    )
}

Main.defaultProps = {
    count: "Fix this"
};

Main.propTypes={
    count:PropTypes.string.isRequired
}

export default Main
