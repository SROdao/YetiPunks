import React from 'react'

import Carousel from 'react-bootstrap/Carousel'

import banner from '../images/yetibanner.png'
import banner2 from '../images/yetibanner-flipped.jpg'

function CarouselComponent() {
    return (
        <Carousel className="yeti-banner">
            <Carousel.Item interval={1000}>
                <img
                    // className="d-block w-100"
                    src={banner}
                    alt="Yeti Punks 1"
                />
                {/* <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>some text.</p>
                </Carousel.Caption> */}
            </Carousel.Item>
            <Carousel.Item interval={1000}>
                <img
                    src={banner2}
                    alt="Yeti Punks 2"
                />
            </Carousel.Item>
            <Carousel.Item interval={1000}>
                <img
                    src={banner}
                    alt="Yeti Punks 3"
                />
            </Carousel.Item>
        </Carousel>
    )
}

export default CarouselComponent
