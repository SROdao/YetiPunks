//rafce
import React from 'react'
import PropTypes from 'prop-types'
import image from '../images/yetibanner.png'
const Main = ({count}) => {
    return (
        <div className = "main">          
            <img className = 'float-text' src={image}/>
            <div className='float-text font'>
                <h1>No Utility</h1>
                <h1>No Roadmap</h1>
                <h1>Just Yeti good vibes</h1>
                
            </div>
            <div className="container">
                <div className='header font'>
                    <h1>Mint a Yeti</h1>
                    <h6>Remaining: {count} </h6>
                    <button className='btn'> Mint </button>
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
