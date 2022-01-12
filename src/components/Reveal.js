import React from 'react'
const pinUrl = 'https://gateway.pinata.cloud/ipfs/QmaKmj2WwvrSeaZchNU1eZsu3avCZfHMdE1LgCVgWXyXhd/';
const png = ".png";

const Reveal = (tokenIds) => {
    return (
        <div>
            {
                tokenIds.map ( id =>
                    <div className='bio-square'>
                        <div className='bio-card'>
                            <img className='avatar' src={yeti.profile} alt="yeti-avatar" />
                        </div>
                    </div>
                )
                
            }
        </div>
    )
}

export default Reveal
