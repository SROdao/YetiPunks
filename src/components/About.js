import React from 'react'
import yetitar from '../images/yetipunk_bios.png'

const About = () => {
    return (
        <div className="font d-flex justify-content-around">
            <div className='d-flex flex-column align-items-center'>
                <div className='avatar'>
                    <img className='avatar' src={yetitar} />
                </div>
                <div className='d-flex flex-column align-items-center'>
                    <h6 className='mt-3'>Tokimori</h6>
                    <div>Artist, NFT Chef</div>
                </div>
            </div>
            <div className='d-flex flex-column align-items-center'>
                <div className='avatar'>
                    <img className='avatar' src={yetitar} />
                </div>
                <div className='d-flex flex-column align-items-center'>
                    <h6 className='mt-3'>Tenzing</h6>
                    <div>Sherpa</div>
                </div>
            </div>
            <div className='d-flex flex-column align-items-center'>
                <div className='avatar'>
                    <img className='avatar' src={yetitar} />
                </div>
                <div className='d-flex flex-column align-items-center'>
                    <h6 className='mt-3'>WangMandu</h6>
                    <div>Dev</div>
                </div>
            </div>
        </div>
    )
}

export default About
