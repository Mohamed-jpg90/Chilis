import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MenueSec.css';
import { IoMdCart } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
/////////////////////////////////////////////////////////////////
import { useCartStore } from '../store/CartStore';
//////////////////////////////////////////////////////////////////
//npm i react-laxy-load-image-component
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
///////////////////////////////////////////////////////////////
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
const URL = "https://myres.me/chilis-dev/api"

function MenueSec() {
    const cart = useCartStore((state) => state.cart);
    const addToCart = useCartStore((state) => state.addToCart);

    const [menuData, setMenuData] = useState([]);
    const [itemData, setItemData] = useState([])
    const [showItem, setShowItem] = useState(false)
    const [showPupUp, setShowPupUp] = useState(false)
    const [idItem, setIdItem] = useState('')
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [categoryName, setCategoryName] = useState('')
    const [selectedOption, setSelectedOption] = useState(null);

    const [selectedExtras, setSelectedExtras] = useState([]);

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




    useEffect(() => {
        fetchMenu();
    }, []);

    const Backtomenu = () => {
        setShowItem(false)
    }



    const gitItem = async (_id) => {

        try {
            const res = await axios.get(`${URL}/menu/10/2`)

            const itemssss = res.data.data.menu[0].sections.find((item) => item.id === _id)
            if (!itemssss) {
                console.log("items can't found ")
            } else {
                setCategoryName(itemssss.name_en)
                const ItemData2 = itemssss.items.map((e) => ({
                    name: e.name_en,
                    id: e.id,
                    image: `https://myres.me/chilis/${e.image}`,
                    price: e.info[0].price.price

                }))
                setShowItem(true)
                setItemData(ItemData2)
                // console.log(itemssss)
                setIdItem(_id)
                setCategoryName(itemssss.name_en)
                console.log(categoryName)

            }

        } catch (e) {
            console.log("the error is :", e)
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
            setSelectedOption(formattedItem.options.length > 0 ? formattedItem.options[0].id : null);

            setQuantity(1);
            setShowPupUp(true);

        } catch (e) {
            console.error("Error fetching item details:", e);
        }
    };



    const handelAddToCart = (item) => {
        const product = {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: quantity, 
            option: item.options.find((opt) => opt.id === selectedOption) || null,
            extras: item.extras.filter((ex) => selectedExtras.includes(ex.id)) || [],
            image: item.image,
            des : item.description 
        };

        addToCart(product);
        setShowPupUp(false);
        console.log("Added to cart:", product);
        console.log(cart)
    };

    return (
        <div className='menuSec' id="menu">
            <div className='container_sec_menu'>
                <div className='head_of_menue'>
                    <h2>Menu</h2>
                </div>
                <div className='line mx-auto ' ></div>

                {!showItem && (
                    menuData.length === 0 ? (
                        <>
                            <div className='loding_bage'>
                                <h2>loading menu...</h2>
                            </div>

                        </>


                    ) : (
                        <div className='container_herzontal'>
                            <Swiper
                                spaceBetween={0}
                                slidesPerView={1}
                                autoplay={false}
                                // pagination={{ clickable: true }}
                                navigation={true}
                                loop={false}
                                modules={[Autoplay, Pagination, Navigation]}
                                breakpoints={{
                                    1024: { slidesPerView: 3 },
                                    600: { slidesPerView: 1 },
                                }}
                            >
                                {menuData.map(mes => {
                                    return (
                                        <SwiperSlide key={mes.id}>
                                            <div className='item' onClick={() => gitItem(mes.id)}>
                                                <div className="image2">
                                                    <LazyLoadImage alt={mes.name} src={mes.image} effect='blur' />
                                                </div>
                                                <div className='the_content'>
                                                    <h4>{mes.name}</h4>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>

                        </div>
                    )

                )}

                {showItem && (
                    itemData.length === 0 ? (
                        <>
                            <div className='loding_bage'>
                                <h2>loading item...</h2>
                            </div>

                        </>


                    ) : (
                        <>
                            <div className='back_to_menu' >
                                <IoArrowBackOutline className='back' onClick={Backtomenu} />
                            </div>
                            <div className='catigory_of_item' >
                                <h4>{categoryName}</h4>
                            </div>
                            <div className='container_item'>



                                {itemData.map(item => (


                                    <div className='item' key={item.id} onClick={() => openItemPopUp(item.id)}  >
                                        <div className='image2'>
                                            <LazyLoadImage alt={item.name} src={item.image} effect='blur' />

                                        </div>
                                        <div className='the_content'>

                                            <div className="itmeName"> <h6>{item.name}</h6> </div>
                                            <div className="">          <h6> {item.price} </h6></div>
                                            <div className="">   <IoMdCart className='cart' onClick={() => openItemPopUp(item.id)} /></div>


                                        </div>
                                    </div>

                                ))}
                            </div>
                        </>
                    )
                )}


                {showPupUp && selectedItem && (
                    <div className="overlay2" onClick={() => setShowPupUp(false)}>
                        <div className="myModal2" role="document" onClick={(e) => e.stopPropagation()}>
                            {/* Header */}
                            <div className="modal_header2">
                                <h2>{selectedItem.name}</h2>



                                <div className="price_conter">
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

                                    <p>{selectedItem.price}</p>
                                </div>
                            </div>
                            <hr />

                            {/* Body */}
                            <div className="modal_body2">
                                <div className="items_of_menu">
                                    <div className="item_imgae_popUp">
                                        <img src={selectedItem.image} alt={selectedItem.name} />
                                    </div>

                                    <div className="content_popup_item">
                                        <h5>{selectedItem.description}</h5>




                                        {/* Options Section */}

                                        {selectedItem.options.length > 0 && (
                                            <div className="options-section">
                                                <h5>Choose an option</h5>
                                                <div className="optinsContainer">
                                                    {selectedItem.options.map((opt) => (
                                                        <div className="optinnnnnn" key={opt.id}>
                                                            <label className="radio_label">
                                                                <input
                                                                    type="radio"
                                                                    name="item-option"
                                                                    value={opt.id}
                                                                    checked={selectedOption === opt.id}   // هنا الشرط
                                                                    onChange={() => {
                                                                        setSelectedOption(opt.id);
                                                                        console.log("Option chosen:", opt.name);
                                                                    }}
                                                                />
                                                                {opt.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}


                                        {/* Extras Section */}


                                        {selectedItem.extras.length > 0 && (
                                            <div className="extras-section">
                                                <h5>Extras</h5>
                                                <div className="optinsContainer">

                                                    {selectedItem.extras.map((extra) => (
                                                        <div className="optinnnnnn" key={extra.id} >

                                                            <label className="checkbox_label">
                                                                <input
                                                                    type="checkbox"
                                                                    value={extra.id}
                                                                    // Add your state handler here
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedExtras([...selectedExtras, extra.id]);
                                                                        } else {
                                                                            setSelectedExtras(selectedExtras.filter((id) => id !== extra.id));
                                                                        }

                                                                    }}
                                                                />
                                                                {extra.name} (+{extra.price})
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                </div>



                            </div>

                            {/* Footer Actions */}
                            <div className="modal-actions">
                                <button
                                    onClick={() => {
                                        handelAddToCart(selectedItem)
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
