import React from 'react'
import './Hero.css'
import shop_icon from '../Assets/shop_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
  return (
    <div className='hero'>
    <div className="hero-left">
      <h2>Welcome to A2Y Shop</h2>
      <div>
        <div className="hero-hand-icon">
            <p>new</p>
            <img src={shop_icon} alt="hand icon" />
        </div>
        <p>& Styled</p>
        <p>Clothes</p>
      </div>
      <div className="hero-latest-btn">
        <div>Latest Collections</div>
        <img src={arrow_icon} alt="" />
      </div>
    </div>
    <div className="hero-right">
        <img src={hero_image} alt="heroimage" />
    </div>
    </div>
  )
}

export default Hero