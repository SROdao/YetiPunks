import React, { useState, useEffect } from "react";
import openSea from '../images/YPos.png'
import twitter from '../images/YPtwitter.png'
import song from '../songs/YPsitemusicfinalboost.mp3'
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
    [playing, audio]
  );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, [audio]);

  return [playing, toggle];
};



const Banner = ({ usersAccount }) => {
  const [playing, toggle] = useAudio();
  const addressToDisplay = usersAccount?.length > 12 ? `${usersAccount.slice(0, 4)}...${usersAccount.slice(-4)}` : usersAccount
  const connectedWallet = usersAccount ? addressToDisplay.toLowerCase() : ""
  return (
    <div className="topnav">
      <div className="topnav-left">
        {playing ? (
          <img onClick={toggle} className="icon" alt="tunes on" src={soundOn}></img>
        ) : (<img onClick={toggle} className="icon" alt='tunes off' src={soundOff}></img>)}
        <p className="user-wallet">{connectedWallet}</p>
      </div>
      <div className="topnav-right">
        <a href='https://etherscan.io/address/0x8e21fdeb0e51cf8ea8674b8389bc653c0126cfb2' rel="noreferrer" target="_blank"><img className='icon' src={ethScan} alt="ethscan-logo" /></a>
        <a href='https://opensea.io/collection/yetipunks' rel="noreferrer" target="_blank"><img className='icon' src={openSea} alt="opensea-logo" /></a>
        <a href='https://looksrare.org/collections/0x8e21FdeB0E51Cf8EA8674b8389Bc653c0126CFb2' rel="noreferrer" target="_blank"><img className='icon' src={looksRare} alt="lookrare-logo" /></a>
        <a href='https://twitter.com/YetiPunks' rel="noreferrer" target="_blank"><img className='icon' src={twitter} alt="twitter-logo" /></a>
        <a href='https://discord.gg/zZ7jnN4bnT' rel="noreferrer" target="_blank"><img className='icon' src={YPdiscrod} alt="discord-logo" /></a>
      </div>
    </div>
  )
}

export default Banner;
