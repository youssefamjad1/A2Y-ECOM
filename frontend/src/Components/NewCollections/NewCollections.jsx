import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';

// Define the API URL constant
const API_URL = 'https://a2y-ecom-1.onrender.com';

const NewCollections = () => {
  const [new_collections, setNew_collections] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/newcollections`)
      .then((response) => response.json())
      .then((data) => setNew_collections(data))
      .catch((error) => console.error('Error fetching new collections:', error));
  }, []);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collections.map((item, i) => (
          <Item 
            key={i} 
            id={item.id} 
            name={item.name} 
            image={item.image} 
            new_price={item.new_price} 
            old_price={item.old_price} 
          />
        ))}
      </div>
    </div>
  );
};

export default NewCollections;