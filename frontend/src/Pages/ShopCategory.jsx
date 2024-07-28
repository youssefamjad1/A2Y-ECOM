import React, { useContext, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';

import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
    const { all_product } = useContext(ShopContext);
    const [sortOption, setSortOption] = useState('');

    // Function to handle sorting
    const handleSort = (e) => {
        setSortOption(e.target.value);
    };

    // Function to sort products based on selected option
    const sortProducts = (products, option) => {
        switch (option) {
            case 'price-low-high':
                return products.sort((a, b) => a.new_price - b.new_price);
            case 'price-high-low':
                return products.sort((a, b) => b.new_price - a.new_price);
            case 'name-az':
                return products.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-za':
                return products.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return products;
        }
    };

    // Filter and sort products
    const filteredProducts = all_product.filter(item => item.category === props.category);
    const sortedProducts = sortProducts(filteredProducts, sortOption);

    return (
        <div className='shop-category'>
            <img className="shopcategory-banner" src={props.banner} alt="" />
            <div className="shopcategory-indexSort">
                <p>
                    <span>Showing 1-12</span> out of {filteredProducts.length} products
                </p>
                <div className="shopcategory-sort">
                    Sort by 
                    <select onChange={handleSort} value={sortOption}>
                        <option value="">Select</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="name-az">Name: A to Z</option>
                        <option value="name-za">Name: Z to A</option>
                    </select>
                </div>
            </div>
            <div className="shopcategory-products">
                {sortedProducts.map((item, i) => (
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
            <div className="shopcategory-loadmore">
                Explore More
            </div>
        </div>
    );
};

export default ShopCategory;
