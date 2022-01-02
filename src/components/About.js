import React from 'react'
import yetitar from '../images/yetipunk_bios.png'

const About = () => {
    return (
        <div className="font bio-section">
            <div className='bio-square'>
                <div className='d-flex flex-column align-items-center'>
                    <img className='avatar' src={yetitar} />
                    <h6 className='mt-3'>Tokimori</h6>
                </div>
                <div className='bio'>
                    <p>The artist who made this all happen. His bond with yeti punks is cemented through a love for kush.</p>
                </div>
            </div>
            <div className='bio-square'>
                <div className='avatar d-flex flex-column align-items-center'>
                    <img className='avatar' src={yetitar} />
                    <h6 className='mt-3'>Tenzing</h6>
                </div>
                <div className='bio'>
                    <div>A developer who brought together Tokimori and WangMandoo to create a trio of yeti heads.</div>
                </div>
            </div>
            <div className='bio-square'>
                <div className='avatar d-flex flex-column align-items-center'>
                    <img className='avatar' src={yetitar} />
                    <h6 className='mt-3'>WangMandu</h6>
                </div>
                <div className='bio'>
                    <div>A king-sized dumpling skilled in dev and nft art</div>
                </div>
            </div>
        </div>
    )
}

export default About
