import PropTypes from 'prop-types'
import openSea from '../images/Logomark-Transparent White.png'
import twitter from '../images/twitter.png'
const Banner = ({ title }) => {
    return (
        <div className="topnav font">
            <a>{title}</a>
            <div className="topnav-right">
                <a href='https://opensea.io/'><img className='icon' src={openSea} /></a>
                <a href='https://twitter.com/'><img className='icon' src={twitter} /></a>
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

export default Banner
