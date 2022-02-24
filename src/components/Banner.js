import React, { useState, useEffect } from "react";
import openSea from '../images/YPos.png'
import twitter from '../images/YPtwitter.png'
import song from '../songs/yp-theme.mp3'
import soundOn from '../images/volume.png'
import soundOff from '../images/soundOff.png'
import looksRare from '../images/YPlooksrare.png'
import ethScan from '../images/YPetherscan.png'
import YPdiscrod from '../images/YPdiscord.png'



const useAudio = () => {
  const [audio] = useState(new Audio(song));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  },
    [playing]
  );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};



const Banner = ({ usersAccount }) => {
  const [playing, toggle] = useAudio();
  const addressToDisplay = usersAccount?.length > 12 ? `${usersAccount.slice(0, 4)}...${usersAccount.slice(-4)}` : usersAccount
  const connectedWallet = usersAccount ? addressToDisplay : ""
  return (
    <div className="topnav">
      <div className="topnav-left">
        {playing ? (
          <img onClick={toggle} className="icon" src={soundOn}></img>
        ) : (<img onClick={toggle} className="icon" src={soundOff}></img>)}
        <p className="user-wallet">{connectedWallet}</p>
      </div>
      <div className="topnav-right">
        <a href='https://etherscan.io/' target="_blank"><img className='icon' src={ethScan} alt="ethscan-logo" /></a>
        <a href='https://looksrare.org/' target="_blank"><img className='icon' src={looksRare} alt="lookrare-logo" /></a>
        <a href='https://opensea.io/' target="_blank"><img className='icon' src={openSea} alt="opensea-logo" /></a>
        <a href='https://twitter.com/YetiPunks' target="_blank"><img className='icon' src={twitter} alt="twitter-logo" /></a>
        <a href='https://etherscan.io/' target="_blank"><img className='icon' src={YPdiscrod} alt="discord-logo" /></a>
      </div>
    </div>
  )
}

export default Banner;
