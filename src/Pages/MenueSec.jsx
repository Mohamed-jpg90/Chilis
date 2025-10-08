import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdCart } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useCartStore } from '../store/CartStore';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaChevronCircleRight } from "react-icons/fa";
import { FaChevronCircleLeft } from "react-icons/fa";
import { useTranslation } from 'react-i18next'; // Fixed import

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
    const [categoryNameAr, setCategoryNameAr] = useState('')
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedExtras, setSelectedExtras] = useState([]);

    const { t, i18n } = useTranslation(); // Fixed hook name and added i18n
    const currentLanguage = i18n.language;


    
    const fetchMenu = async () => {
        try {
            const res = await axios.get(`${URL}/menu/10/1`);
            const menuSections = res.data.data.menu[0].sections.map(section => ({
                id: section.id,
                name: section.name_en,
                namear: section.name_ar,
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
                const ItemData2 = itemssss.items.map((e) => ({
                    name: e.name_en,
                    namear: e.name_ar,
                    id: e.id,
                    image: `https://myres.me/chilis/${e.image}`,
                    price: e.info[0].price.price
                }))
                setShowItem(true)
                setItemData(ItemData2)
                setIdItem(_id)
                setCategoryName(itemssss.name_en)
                setCategoryNameAr(itemssss.name_ar)
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
            const price = itemData.info[0].price.price || 0;

  
            const extras = itemData?.item_extras?.[0]?.data?.map((item) => ({
                id: item.id,
                name: item.name_en,
                namear: item.name_ar,
                price: parseFloat(item.price_en) || 0,
                category: item.category_en,
                image: `https://myres.me/chilis/${item.image}`
            })) || [];

   
            const options = itemData.info?.[0]?.item_extras?.[0]?.data?.map((item) => ({
                id: item.id,
                name: item.name_en,
                namear: item.name_ar,
                price: parseFloat(item.price_en) || 0,
                category: item.category_en,
                image: `https://myres.me/chilis/${item.image}`
            })) || [];

            const formattedItem = {
                name: itemData.name_en,
                namear: itemData.name_ar,
                id: itemData.id,
                image: `https://myres.me/chilis/${itemData.image}`,
                description: itemData.description_en,
                descriptionar: itemData.description_ar,
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
            // name: currentLanguage === 'ar' ? item.namear : item.name,
            name : item.name,
            namear: item.namear,
            price: item.price,
            quantity: quantity,
            option: item.options.find((opt) => opt.id === selectedOption) || null,
            extras: item.extras.filter((ex) => selectedExtras.includes(ex.id)) || [],
            image: item.image,
            des: currentLanguage === 'ar' ? item.descriptionar : item.description
        };

        addToCart(product);
        setShowPupUp(false);
        console.log("Added to cart:", product);
        console.log(cart)
    };
    /////////////////////////////////////////////////////////////////////////////////////////////////

    // Helper function to get display name based on current language
    const getDisplayName = (item) => {
        return currentLanguage === 'ar' && item.namear ? item.namear : item.name;
    };

    const getDisplayDescription = (item) => {
        return currentLanguage === 'ar' && item.descriptionar ? item.descriptionar : item.description;
    };
///////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div className='menuSec' id="menu">
            <div className='container_sec_menu'>
                <div className='head_of_menue'>
                    <h2>{t('menu.title')}</h2>
                </div>
                <div className='line mx-auto ' ></div>

                {!showItem && (
                    menuData.length === 0 ? (
                        <div className='loding_bage'>
                            <h2>{t('menu.loadingMenu')}</h2>
                        </div>
                    ) : (
                        <div className='container_herzontal'>
                            <div className="custom-prev"><FaChevronCircleLeft /></div>
                            <div className="custom-next"><FaChevronCircleRight /></div>

                            <Swiper
                                spaceBetween={30}
                                slidesPerView={1}
                                autoplay={false}
                                navigation={{
                                    nextEl: '.custom-next',
                                    prevEl: '.custom-prev',
                                }}
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
                                            <div className='item1' onClick={() => gitItem(mes.id)}>
                                                <div className="image2">
                                                    <LazyLoadImage alt={getDisplayName(mes)} src={mes.image} effect='blur' />
                                                </div>
                                                <div className='the_content'>
                                                    <h4>{getDisplayName(mes)}</h4>
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
                        <div className='loding_bage'>
                            <h2>{t('menu.loadingItems')}</h2>
                        </div>
                    ) : (
                        <>
                            <div className='back_to_menu' >
                                <IoArrowBackOutline className='back' onClick={Backtomenu} />
                            </div>
                            <div className='catigory_of_item' >
                                <h4>{currentLanguage === 'ar' ? categoryNameAr : categoryName}</h4>
                            </div>
                            <div className='container_item'>
                                {itemData.map(item => (
                                    <div className='item' key={item.id} onClick={() => openItemPopUp(item.id)}>
                                        <div className='image2'>
                                            <LazyLoadImage alt={getDisplayName(item)} src={item.image} effect='blur' />
                                        </div>
                                        <div className='the_content'>
                                            <div className="itmeName"> 
                                                <h6>{getDisplayName(item)}</h6> 
                                            </div>
                                            <div className="">
                                                <h6>{item.price} {t('menu.egp')}</h6>
                                            </div>
                                            <div className="">
                                                <IoMdCart className='cart' onClick={() => openItemPopUp(item.id)} />
                                            </div>
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
                                <h2>{getDisplayName(selectedItem)}</h2>
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
                                    <p>{selectedItem.price} {t('menu.egp')}</p>
                                </div>
                            </div>
                            <hr />

                            {/* Body */}
                            <div className="modal_body2">
                                <div className="items_of_menu">
                                    <div className="item_imgae_popUp">
                                        <img src={selectedItem.image} alt={getDisplayName(selectedItem)} />
                                    </div>
                                    <div className="content_popup_item">
                                        <h5>{getDisplayDescription(selectedItem)}</h5>

                                        {/* Options Section */}
                                        {selectedItem.options.length > 0 && (
                                            <div className="options-section">
                                                <h5>{t('menu.chooseOption')}</h5>
                                                <div className="optinsContainer">
                                                    {selectedItem.options.map((opt) => (
                                                        <div className="optinnnnnn" key={opt.id}>
                                                            <label className="radio_label">
                                                                <input
                                                                    type="radio"
                                                                    name="item-option"
                                                                    value={opt.id}
                                                                    checked={selectedOption === opt.id}
                                                                    onChange={() => {
                                                                        setSelectedOption(opt.id);
                                                                        console.log("Option chosen:", opt.name);
                                                                    }}
                                                                />
                                                                {getDisplayName(opt)}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Extras Section */}
                                        {selectedItem.extras.length > 0 && (
                                            <div className="extras-section">
                                                <h5>{t('menu.extras')}</h5>
                                                <div className="optinsContainer">
                                                    {selectedItem.extras.map((extra) => (
                                                        <div className="optinnnnnn" key={extra.id}>
                                                            <label className="checkbox_label">
                                                                <input
                                                                    type="checkbox"
                                                                    value={extra.id}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedExtras([...selectedExtras, extra.id]);
                                                                        } else {
                                                                            setSelectedExtras(selectedExtras.filter((id) => id !== extra.id));
                                                                        }
                                                                    }}
                                                                />
                                                                {getDisplayName(extra)} (+{extra.price})
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
                                    {t('menu.order')}
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