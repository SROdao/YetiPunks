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
    const [showStory, setShowStory] = useState(false);
    const toggleStory = () => {
        setShowStory(!showStory)
    }

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
            <button onClick={toggleStory} className="story-btn">Learn More</button>
            {showStory &&
                <div className="story-wrapper">
                    <div className="story-box">
                        <p className="story-text">YETIPUNKS was created by 3 frens with backgrounds in design, programming, music and tech. We’re passionate about building in the web3 space longterm and wanted to cut our teeth on a fun project to get experience with launching smart contracts and creating generative art.
                            Instead of selling you on a roadmap, we’d rather let the work speak for itself. We believe in underpromising and overdelivering. Any funds raised will be split between the team to continue building and reward holders. We hope you enjoy the project.</p>

                            <p>
                            Thank you,
                            </p>

                            <p>4ndreas, Somkid & Unorthadoxant</p>
                    </div>
                    <button onClick={toggleTerms} className="terms-btn">Terms & Conditions</button>
                    {showTerms && <div className="story-wrapper">
                            <div className="story-box">
                                <p>Disclaimer</p>
                                <p>
                                YETIPUNKS is a collection of digital artworks in the form of Non-Fungible Tokens (NFTs), running on the Ethereum network. This website is only an interface allowing users to buy digital collectibles. Users are entirely responsible for the safety and management of their own private Ethereum wallets and validating all transactions generated by this website before approval. The YETIPUNKS smart contract runs on the Ethereum network, there is no ability to undo, reverse, or restore any transactions. This website and its services are provided “as is” and “as available” without a warranty of any kind. By using this website you are accepting sole responsibility for any transactions involving YETIPUNKS digital collectibles.
                                </p>
                                <p>Ownership</p>
                                <p>
                                You own the NFT and are free to use it for your own personal, commercial or non-commercial use. By connecting your ethereum wallet and minting YETIPUNKS using our smart contract, you gain full and complete ownership of your NFT. At no point may we seize, freeze, or otherwise modify the ownership of any YETIPUNKS NFTs.
                                </p>
                                <p>No Guarantees or Future Promises</p>
                                <p>
                                You agree that your purchase of a YETIPUNKS NFT is all you are guaranteed to receive with your initial purchase. Any future benefits are ancillary to this purchase and not to be taken into consideration with your initial purchase. You agree that you are not relying on any future commitments in using this site and participating in our NFT mint.
                                </p>
                                <p>NFTs are not intended as investments</p>
                                <p>
                                We make no promises or guarantees that these NFTs will be worth anything. You understand that they have no inherent monetary value.
                                </p>
                                <p>Taxes</p>
                                <p>
                                You are entirely responsible for any tax liability which may arise from minting or reselling your YETIPUNKS NFT.
                                </p>
                                <p>Class Action Waiver</p>
                                <p>
                                You agree to waive any class action status, and any legal dispute around the YETIPUNKS project.
                                </p>
                                <p>Age Implications</p>
                                <p>
                                The YETIPUNKS project is not targeted towards children. You agree that you are over the legal age of your jurisdiction.
                                </p>
                                <p>Privacy Policy</p>
                                <p>
                                We will not collect any cookies, IP addresses, or user data in connection with your use of the website and app. Additionally, you understand that the Ethereum blockchain network is a public blockchain and all of your transaction history initiated through the website will be public. You also understand that the YETIPUNKS team may work with third-party apps that collect data, such as Discord or Collab.Land for YETIPUNKS holder verifications or giveaways.
                                </p>

                            </div>
                        </div>}
                </div>}
        </div>
    );
};

export default About;
