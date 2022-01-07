import React, { useState, useEffect } from "react";
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

const Player = () => {
  const [playing, toggle] = useAudio();

  return (
    <div className="test">
      {playing ?(
        <img onClick={toggle} className="icon" src={soundOn}></img>
      ):(<img onClick={toggle} className="icon" src={soundOff}></img>)}     
    </div>
  );
};

export default Player;