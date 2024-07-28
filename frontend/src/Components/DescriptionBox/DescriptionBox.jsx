import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews(57)</div>
        </div>
        <div className="descriptionbox-description">
            <p>this is a static description for testing</p>
            <p>here alson i will add some text</p>
        </div>
    </div>
  )
}

export default DescriptionBox