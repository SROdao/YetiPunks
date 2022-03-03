import React from "react";
import yetitar from "../images/yetipunk_bios.png";
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
    },
    {
        name: "Somkid",
        profile: somekid,
        role: "Developer",
        bio: "Front End, Solidity",
    },
    {
        name: "Billy",
        profile: billy,
        role: "Developer",
        bio: "Front End, Solidity, Art Direction",
    },
];

const About = () => {
    return (
        <div className="center">
            <div className="bio-section">
                {yetis.map((yeti) => (
                    <div key={yeti.name} className="bio-card">
                        <img className="avatar" src={yeti.profile} alt="yeti-avatar" />
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
