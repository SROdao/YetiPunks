import React from 'react'
import yetitar from '../images/yetipunk_bios.png'

const yetis = [
    {
        name: 'Tokimori',
        profile: yetitar,
        bio: 'The artist who made this all happen. His bond with yeti punks is cemented through a love for kush.'
    },
    {
        name: 'Tenzing',
        profile: yetitar,
        bio: 'A developer who brought together Tokimori and WangMandoo to create a trio of yeti heads.'
    },
    {
        name: 'WangMandu',
        profile: yetitar,
        bio: 'A king-sized dumpling skilled in dev and nft art'
    }
]

const About = () => {
    return (
        <div className="bio-section">
            {
                yetis.map ( yeti =>
                    <div className='bio-square' key={yeti.name}>
                        <div className='bio-card'>
                            <img className='avatar' src={yeti.profile} alt="yeti-avatar" />
                            <h6>{yeti.name}</h6>
                        </div>
                        <div className='bio'>
                            <p>{yeti.bio}</p>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default About
