import React from 'react'
import Tokimori00 from '../images/yetipunkv4white.png'

const About = () => {
    return (
        <div className = "row font">
            <div className = 'float-text'>
                <h1>About Yeti Punk Labs</h1>
            </div>
            
            <div className = 'col-sm'>
            <div className='avatar float-left'>
                <img className = 'avatar' src={Tokimori00}/>
            </div>
            <div className = 'col-sm float-right'>
                <h6>Tokimori00</h6>
                <div>LFGGGGGGG</div>
            </div>
            
            </div>
            <div className = 'col-sm'>
                <div className='avatar float-left'>
                    <img className = 'avatar' src={Tokimori00}/>
                </div>
                <div>
                    <h6>PakMinSoo</h6>
                    <div>Did you call me?</div>
                </div>
            </div>
            <div className = 'col-sm'>
            <div className='avatar float-left'>
                <img className = 'avatar' src={Tokimori00}/>
            </div>
            <div>
                <h6>WangMandu</h6>
                <div>I hate Javascript</div>
            </div>

            </div>
        </div>
    )
}

export default About
