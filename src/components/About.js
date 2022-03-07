import React from "react";
import andreas from '../images/4dreas.png';
import somekid from '../images/somekid.png';
import billy from '../images/billy.png';
//?import publicDomain from "../images/publicdomain.png";

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
        name: "Billy",
        profile: billy,
        role: "Developer",
        bio: "Front End, Solidity, Art Direction",
        tweeter: "https://twitter.com/unorthadoxant"
    },
];

const About = () => {
    return (
        <div className="center">
            <div className="bio-section">
                {yetis.map((yeti) => (
                    <div key={yeti.name} className="bio-card">
                        <a href={yeti.tweeter}>
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
        </div>
    );
};

export default About;
