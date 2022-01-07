import PropTypes from 'prop-types'
import React, { useState, useEffect } from "react";
import openSea from '../images/Logomark-Transparent White.png'
import twitter from '../images/twitter.png'
import song from '../songs/road.mp3'
import soundOn from '../images/volume.png'
import soundOff from '../images/soundOff.png'



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



const Banner = ({ title }) => {
    const [playing, toggle] = useAudio();
    return (
        <div className="topnav font">
            <a>{title}</a>
            <div className="topnav-right">
               
                    {playing ?(
                    <img onClick={toggle} className="icon" src={soundOn}></img>
                    ):(<img onClick={toggle} className="icon" src={soundOff}></img>)}     
        
                    <a href='https://opensea.io/'><img className='icon' src={openSea} alt="opensea-logo"/></a>
                    <a href='https://twitter.com/YetiPunks'><img className='icon' src={twitter} alt="twitter-logo"/></a>
                
              
             </div>
        </div>
    )
}




Banner.defaultProps = {
    title: "YETI PUNKS"
};

Banner.propTypes = {
    title: PropTypes.string.isRequired
}

export default Banner;
