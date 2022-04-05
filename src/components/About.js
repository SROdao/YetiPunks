import { useState } from "react";
import andreas from '../images/4dreas.png';
import somekid from '../images/somekid.png';
import unorthadoxant from '../images/billy.png';

const yetis = [
    {
        name: "4ndreas",
        profile: andreas,
        role: "Artist",
        bio: "Design, Music, UX",
        tweeter: "https://twitter.com/_4ndreas"
    },
    {
        name: "Somkid",
        profile: somekid,
        role: "Developer",
        bio: "Front End, Solidity",
        tweeter: "https://twitter.com/chrissomkid"
    },
    {
        name: "Unorthadoxant",
        profile: unorthadoxant,
        role: "Developer",
        bio: "Front End, Solidity, Art Direction",
        tweeter: "https://twitter.com/unorthadoxant"
    },
];

const About = () => {
    const [showTerms, setShowTerms] = useState(false);
    const toggleTerms = () => {
        setShowTerms(!showTerms)
    }
    return (
        <div className="center">
            <div className="bio-section">
                {yetis.map((yeti) => (
                    <div key={yeti.name} className="bio-card">
                        <a href={yeti.tweeter} rel="noreferrer" target="_blank">
                            <img className="avatar" src={yeti.profile} alt="yeti-avatar" />
                        </a>

                        <h6>{yeti.name}</h6>
                        {/* <h4>{yeti.role}</h4> */}
                        <div className="bio">
                            <p>{yeti.bio}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={toggleTerms} className="story-btn">Learn More</button>
            {showTerms &&
                <div className="story-wrapper">
                    <div className="story-box">
                        <p className="story-text">YETIPUNKS was created by 3 frens with backgrounds in design, programming, music and tech. We’re passionate about building in the web3 space longterm and wanted to cut our teeth on a fun project to get experience with launching smart contracts and creating generative art.
                            Instead of selling you on a roadmap, we’d rather let the work speak for itself. We believe in undepromising and overdelivering. Any funds raised will be split between the team to continue building and reward holders. We hope you enjoy the project.</p>

                            <p>
                            Thank you,
                            </p>

                            <p>4ndreas, Somkid & Unorthadoxant</p>
                    </div>
                    <button onClick={handleTerms} className="terms-btn">Terms & Conditions</button>
                </div>}
        </div>
    );
};

export default About;
