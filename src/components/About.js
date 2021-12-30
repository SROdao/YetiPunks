import React from 'react'
import Tokimori00 from '../images/yetipunkv4white.png'

const About = () => {
    return (
        <div className="font d-flex justify-content-around">
            <div className='d-flex flex-column align-items-center'>
                <div className='avatar'>
                    <img className='avatar' src={Tokimori00} />
                </div>
                <div className='d-flex flex-column align-items-center'>
                    <h6>Tokimori00</h6>
                    <div>Artist, NFT Chef</div>
                </div>
            </div>
            <div className='d-flex flex-column align-items-center'>
                <div className='avatar'>
                    <img className='avatar' src={Tokimori00} />
                </div>
                <div>
                    <h6>Tenzing</h6>
                    <div>Sherpa</div>
                </div>
            </div>
            <div className='d-flex flex-column align-items-center'>
                <div className='avatar'>
                    <img className='avatar' src={Tokimori00} />
                </div>
                <div>
                    <h6>WangMandu</h6>
                    <div>Dev</div>
                </div>
            </div>
        </div>
    )
}

export default About
