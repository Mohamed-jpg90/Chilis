import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MenueSec.css';
import ItemMenu from './ItemMenu';
import imageee from '../images/london.jpg'
import { IoMdCart } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
const URL = "https://myres.me/chilis-dev/api"

function MenueSec() {

    const [menuData, setMenuData] = useState([]);
    const [itemData, setItemData] = useState([])
    const [showItem, setShowItem] = useState(false)
    const [showPupUp, setShowPupUp] = useState(false)
    const [idItem, setIdItem] = useState('')
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);


    const fetchMenu = async () => {
        try {
            const res = await axios.get(`${URL}/menu/10/1`);
            const menuSections = res.data.data.menu[0].sections.map(section => ({
                id: section.id,
                name: section.name_en,
                image: `https://myres.me/chilis/${section.image}`,
            }));
            setMenuData(menuSections);

        } catch (e) {
            console.error("The error is:", e);
        }
    };
    fetchMenu();


    const Backtomenu = () => {
        setShowItem(false)
    }




    const handelMenuList = async (_id) => {
        try {
            const res = await axios.get(`${URL}/menu/10/2`)

            return res.data.data.menu[0].sections.find((item) => item.id === _id)


        } catch (e) {
            console.log("the error is :", e)
        }

    }
    const gitItem = async (_id) => {
        const itemssss = await handelMenuList(_id)
        if (!itemssss) {
            console.log("items can't found ")
        } else {
            const ItemData2 = itemssss.items.map((e) => ({
                name: e.name_en,
                id: e.id,
                image: `https://myres.me/chilis/${e.image}`,
                price: e.info[0].price.price

            }))
            setShowItem(true)
            setItemData(ItemData2)
            console.log(_id)
            setIdItem(_id)
        }
    }

    const openItemPopUp = async (itemId) => {
        try {
            const res = await axios.get(`${URL}/item/${itemId}/1`);
            console.log(res.data);

            const itemData = res.data;

            // Safely access nested data with optional chaining
            const price = itemData.info[0].price.price || 0;

            // Extract extras from the nested structure
            const extras = itemData?.item_extras?.[0]?.data?.map((item) => ({
                id: item.id,
                name: item.name_en,
                price: parseFloat(item.price_en) || 0,
                category: item.category_en,

                image: `https://myres.me/chilis/${item.image}`
            })) || [];

            // Extract options from the nested structure
            const options = itemData.info?.[0]?.item_extras?.[0]?.data?.map((item) => ({
                id: item.id,
                name: item.name_en,
                price: parseFloat(item.price_en) || 0,
                category: item.category_en,
                // required: item.required === "1",
                image: `https://myres.me/chilis/${item.image}`
            })) || [];

            const formattedItem = {
                name: itemData.name_en,
                id: itemData.id,
                image: `https://myres.me/chilis/${itemData.image}`,
                description: itemData.description_en,
                price: price,
                extras: extras,
                options: options
            };

            setSelectedItem(formattedItem);
            setQuantity(1);
            setShowPupUp(true);

        } catch (e) {
            console.error("Error fetching item details:", e);
        }
    };


    return (
        <div className='menuSec'>
            <div className='container_sec_menu'>
                <div className='head_of_menue'>
                    <h2>Menu</h2>
                </div>

                {!showItem && (
                    menuData.length === 0 ? (
                        <p>Loading menu...</p>
                    ) : (
                        <div className='container_herzontal'>
                            <Swiper
                                spaceBetween={0}
                                slidesPerView={3}
                                autoplay={false}
                                // pagination={{ clickable: true }}
                                navigation={true}
                                loop={true}
                                modules={[Autoplay, Pagination, Navigation]}
                                breakpoints={{
                                    1024: { slidesPerView: 3 },
                                    600: { slidesPerView: 1 },
                                }}
                            >
                                {menuData.map(mes => (
                                    <SwiperSlide key={mes.id} >
                                        <div className='item' onClick={() => gitItem(mes.id)}>
                                            <div className="image2 ">
                                                <img
                                                    src={mes.image}
                                                    alt={mes.name}
                                            
                                                />
                                            </div>
                                            <div className='the_content'>
                                                <h2>{mes.name}</h2>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                        </div>
                    )

                )}

                {showItem && (
                    <>
                        <div className='back_to_menu' >
                            <IoArrowBackOutline className='back' onClick={Backtomenu} />
                        </div>

                        <div className='container_item'>

                            {itemData.map(item => (
                                <>

                                    <div className='item' key={item.id} onClick={() => openItemPopUp(item.id)}  >
                                        <div className='image2'>
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className='the_content'>
                                            <h2>{item.name}</h2>
                                            <IoMdCart className='cart' onClick={() => openItemPopUp(item.id)} />
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    </>
                )}


                {showPupUp && selectedItem && (
                    <div className="overlay" onClick={() => setShowPupUp(false)}>
                        <div className="modal" role="document" onClick={(e) => e.stopPropagation()}>
                            {/* Header */}
                            <div className="modal-header">
                                <h2>{selectedItem.name}</h2>
                                <button
                                    className="close-btn"
                                    aria-label="Close popup"
                                    onClick={() => setShowPupUp(false)}
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Body */}
                            <div className="modal-body">
                                <div className="items_of_menu">
                                    <div className="item_imgae_popUp">
                                        <img src={selectedItem.image} alt={selectedItem.name} />
                                    </div>

                                    <div className="content_popup_item">
                                        <h3>{selectedItem.description}</h3>
                                        <p>Price: {selectedItem.price}</p>

                                        {/* Counter */}
                                        <div className="counter">
                                            <button
                                                className="counter-btn"
                                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                            >
                                                -
                                            </button>
                                            <span className="counter-value">{quantity}</span>
                                            <button
                                                className="counter-btn"
                                                onClick={() => setQuantity((prev) => prev + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        {/* Options Section */}

                                        {selectedItem.options.length > 0 && (
                                            <div className="options-section">
                                                <h4>Choose an option</h4>
                                                {selectedItem.options.map((opt) => (
                                                    <label key={opt.id} className="radio_label">
                                                        <input
                                                            type="radio"
                                                            name="item-option"
                                                            value={opt.id}
                                                            // Add your state handler here
                                                            onChange={() => {
                                                                console.log("Option chosen:", opt.name);
                                                            }}
                                                        />
                                                        {opt.name}
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {/* Extras Section */}


                                        {selectedItem.extras.length > 0 && (
                                            <div className="extras-section">
                                                <h4>Extras</h4>
                                                {selectedItem.extras.map((extra) => (
                                                    <label key={extra.id} className="checkbox_label">
                                                        <input
                                                            type="checkbox"
                                                            value={extra.id}
                                                            // Add your state handler here
                                                            onChange={(e) => {
                                                                console.log("Extra selected:", extra.name);
                                                            }}
                                                        />
                                                        {extra.name} (+{extra.price})
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                </div>



                            </div>

                            {/* Footer Actions */}
                            <div className="modal-actions">
                                <button
                                    onClick={() => {
                                        console.log("Ordering:", {
                                            item: selectedItem,
                                            quantity,
                                            // here you can add extras/options state
                                        });
                                    }}
                                >
                                    Order
                                </button>
                            </div>
                        </div>
                    </div>
                )}






            </div>




        </div>
    );
}

export default MenueSec;
/////////////////////////////////////////////////////////////////////////
