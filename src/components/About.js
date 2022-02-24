import React from "react";
import yetitar from "../images/yetipunk_bios.png";
import publicDomain from "../images/publicdomain.png";

const yetis = [
    {
        name: "4ndreas",
        profile: yetitar,
        role: "Artist",
        bio: "Design, Music, UX",
    },
    {
        name: "Somkid",
        profile: yetitar,
        role: "Developer",
        bio: "Front End, Solidity",
    },
    {
        name: "Billy",
        profile: yetitar,
        role: "Developer",
        bio: "Front End, Solidity, Art Direction",
    },
];

const About = () => {
    return (
        <div className="center">
            <div className="bio-section">
                {yetis.map((yeti) => (
                    <div className="bio-card">
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
