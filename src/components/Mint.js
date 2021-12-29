import PropTypes from 'prop-types'


const Mint = ({count}) => {
    return (
        <div>
            <div className='float-text'>
                Did you know yetis kick ass. They can fucking crush a bored ape.
                
            </div>
            <div className="container">
                <div className='header'>
                    <h1>Mint a Yeti</h1>
                    <h6>Remaining: {count} </h6>
                    <button className='btn'> Mint </button>
                </div>
            </div>
        </div>

    )
}

Mint.defaultProps = {
    count: "Fuck Knows"
};

Mint.propTypes={
    count:PropTypes.string.isRequired
}


export default Mint
