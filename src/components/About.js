import React from 'react'
import yetitar from '../images/yetipunk_bios.png'
import publicDomain from '../images/publicdomain.png'

const yetis = [
    {
        name: '4ndreas',
        profile: yetitar,
        role: 'Artist',
        bio: 'Design, Music, UX'
    },
    {
        name: 'Somkid',
        profile: yetitar,
        role: 'Developer',
        bio: 'Front End, Solidity'
    },
    {
        name: 'Billy',
        profile: yetitar,
        role: 'Developer',
        bio: 'Front End, Solidity, Art Direction'
    }
]

const About = () => {
    return (
        <div className='center'>
            <div className='block-text'>
                <p>
                Deep in the valhalla mountains live the YETIPUNKS.
                far away from civilization and far away from the chaos.
                They live a simple life, filled with good vibes and only the best herb.
                the water from the ice cap mountains is filled with magical nutrients that grows nugs the size of a tree in the redwood forest.
                All YETIPUNKS have different traits and features but they pride themselves on inclusivity and community.
                They're always down to lend a helping hand, so never fear…
                you will always have a fren in the YETIPUNKS.
                </p>
            </div>
            <div className="bio-section">
                {
                    yetis.map(yeti =>
                        <div className='bio-card'>
                            <img className='avatar' src={yeti.profile} alt="yeti-avatar" />
                            <h6>{yeti.name}</h6>
                            {/* <h4>{yeti.role}</h4> */}
                            <div className='bio'>
                                <p>{yeti.bio}</p>
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default About
