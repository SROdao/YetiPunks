//rafce
import React from 'react'
import PropTypes from 'prop-types'
import image from '../images/yetibanner.png'
const Main = ({mintNFTHandler, supplyAvailable = 5000}) => {
    return (
        <div className = "main">        
            <img className = 'float-text' src={image}/>
            <div className='float-text font'>
                <h1>NO UTILITY</h1>
                <h1>NO ROADMAP</h1>
                <h1>JUST YETI GOOD VIBES</h1>
                
            </div>
            <div className="d-flex justify-content-center">
                <div className='d-flex flex-column m-5'>
                    <h1>Mint a Yeti</h1>
                    <h6>Remaining: {supplyAvailable}/5000 </h6>
                    <button onClick={mintNFTHandler} className='btn'> Mint </button>
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
