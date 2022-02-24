import React from "react";

import Carousel from "react-bootstrap/Carousel";

import banner from "../images/yetibanner.png";
import yeti1 from "../images/yeti1.png";
import yeti2 from "../images/yeti2.png";
import yeti3 from "../images/yeti3.png";
import yeti4 from "../images/yeti4.png";

const CarouselComponent = () => {
  const yetis = [
    { image: yeti1, alt: "YetiPunks 1" },
    { image: yeti2, alt: "YetiPunks 2" },
    { image: yeti3, alt: "YetiPunks 3" },
    { image: yeti4, alt: "YetiPunks 4" },
  ];
  return (
    <Carousel className="yeti-banner" fade>
      {yetis.map((yeti) => (
        <Carousel.Item interval={2000}>
          <img
            className="yeti-carousel-image"
            src={yeti.image}
            alt={yeti.alt}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
