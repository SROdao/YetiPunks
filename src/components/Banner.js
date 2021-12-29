import PropTypes from 'prop-types'


const Banner = ({title}) => {
    return (
        
        <div className="topnav font">
            <a>{title}</a>
            <div className="topnav-right">
                <a href="#search">Mint</a>
                <a href="#about">About</a>
            </div>
      </div>
       
    )
}

Banner.defaultProps = {
    title: "Yeti Punks"
};

Banner.propTypes={
    title:PropTypes.string.isRequired
}

export default Banner
