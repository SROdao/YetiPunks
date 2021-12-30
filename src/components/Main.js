//rafce
import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import banner from '../images/yetibanner.png'
import banner2 from '../images/yetibanner-flipped.jpg'
const Main = ({mintNftHandler}) => {
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
            <img className = 'float-text' src={image} onClick={bannerClickHandler}/>
            <div className='float-text font'>
                <h1>NO UTILITY</h1>
                <h1>NO ROADMAP</h1>
                <h1>JUST YETI GOOD VIBES</h1>
                
            </div>
            <div className="d-flex justify-content-center font">
                <div className='d-flex flex-column m-5 font'>
                    <h1>Mint a Yeti Punk</h1>
                    <h6>Remaining: 5000/5000</h6>
                    {}
                    <button onClick={mintNftHandler} className='btn'> Mint </button>
                </div>
            </div>
        </div>
    )
}

Main.defaultProps = {
    count: "Fuck Knows"
};

Main.propTypes={
    count:PropTypes.string.isRequired
}

export default Main
