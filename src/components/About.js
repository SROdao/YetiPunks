import React from 'react'
import yetitar from '../images/yetipunk_bios.png'
import publicDomain from '../images/publicdomain.png'

const yetis = [
    {
        name: '4ndreas',
        profile: yetitar,
        bio: 'The artist who made this all happen. His bond with yeti punks is cemented through a love for kush.'
    },
    {
        name: 'Somkid',
        profile: yetitar,
        bio: 'A developer who brought together 4ndreas and Mandu to create a trio of yeti heads.'
    },
    {
        name: 'Mandu',
        profile: yetitar,
        bio: 'A king-sized dumpling skilled in dev and nft art'
    }
]

const About = () => {
    return (
        <div className='center'>
            <div className='block-text'>
                <p>
                    deep in the valhalla mountains live the YETIPUNKS.
                    far away from civilization and far away from the chaos.
                    they live a simple life, filled with good vibes and only the best herb.
                    the water from the ice cap mountains is filled with magical nutrients that grows nugs the size of a tree in the redwood forest.
                    all YETIPUNKS have different traits and features but they pride themselves on inclusivity and community.
                    they're always down to lend a helping hand, so never fear…
                    you will always have a fren in the YETIPUNKS
                </p>


            </div>
            <div className="bio-section">
                {
                    yetis.map(yeti =>
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
        </div>



    )
}

export default About
