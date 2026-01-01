import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'
import NaveBare from './NaveBare'
import img1 from '../images/aboutUs.jpg'
import { FaRegClock, FaCheck, FaChevronRight, FaReceipt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useTranslation } from 'react-i18next'
import Cookies from 'js-cookie'

const URL = "https://myres.me/chilis-dev/api"

function MyOrder() {
    const [selectedOrder, setSelectedOrder] = useState(false)
    const [filter, setFilter] = useState('all')
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [orderDetails, setOrderDetails] = useState([])
    const [allOrders, setAllOrders] = useState([]);
    const [orderId, setOrderID] = useState([]);
    const { t, i18n } = useTranslation()
    const lan = Cookies.get("i18next") || "en"

    useEffect(() => {
        const fetch_history_order = async () => {
            try {
                const res = await axios.get(`${URL}/user/history?api_token=${token}`);
                console.log("API response:", res.data.data.details);

                if (res.data.message === "Invalid Token") {
                    localStorage.removeItem("token");
                    return;
                }

                const orderWithID = res.data.data.details.map((item) => ({
                    id: item.order_id,
                    status: item.status || "progress",
                    total: item.total || 0,
                    creatAt: item.created_at
                }));
                setAllOrders(orderWithID);
            } catch (e) {
                console.log("The error is:", e);
            }
        };

        fetch_history_order();
    }, [token]);

    useEffect(() => {
        if (filter === "all") setOrderID(allOrders);
        else setOrderID(allOrders.filter(o => {
            if (filter === "progress") return o.status === "Processing";
            if (filter === "completed") return o.status === "Completed";
            if (filter === "cancelled") return o.status === "Cancelled";
            return true;
        }));
    }, [filter, allOrders]);


    useEffect(() => {
        window.document.dir = i18n.dir()
    }, [lan])


    const getOredrDetails1 = async (id) => {
        try {
            const res = await axios.get(`${URL}/order/details/${id}?api_token=${token}`)
            const allDetails = res.data.data.order.map((item) => ({
                id: item.order_id,
                creatAt: item.created_at,
                status: item.status,
                total: item.total,
                delivery_fees: item.delivery_fees,
                tax_fees: item.tax_fees,
                items: item.items.map(e => ({
                    mealId: e.id,
                    name_en: e.name.name_en,
                    name_ar: e.name.name_ar,
                    quantity: e.count,
                    price: e.total_price
                }))
            }))
            console.log(res.data.data.order[0]);
            setOrderDetails(allDetails)
            setSelectedOrder(true)
        } catch (e) {
            console.log("the error is ", e);
        }
    }

    return (
        <div className='my_order_section'>
            <NaveBare token={token} />
            <div className='container_myOrder  '>
                {/* Sidebar */}
                <div className='sidebar mt-5'>
                    <div className="sidebar-header">
                        <h2>{t('myOrders.title')}</h2>
                    </div>
                    <hr />
                    <div className='filter_options'>
                        <div
                            className={`filter_option ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            <span>{t('myOrders.filters.all')}</span>
                            <span className="count">{allOrders.length}</span>
                        </div>
                        <div
                            className={`filter_option ${filter === 'progress' ? 'active' : ''}`}
                            onClick={() => setFilter('progress')}
                        >
                            <FaRegClock className="icon" />
                            <span>{t('myOrders.filters.progress')}</span>
                            <span className="count">{allOrders.filter(o => o.status === "Processing").length}</span>
                        </div>
                        <div
                            className={`filter_option ${filter === 'completed' ? 'active' : ''}`}
                            onClick={() => setFilter('completed')}
                        >
                            <FaCheck className="icon" />
                            <span>{t('myOrders.filters.completed')}</span>
                            <span className="count">{allOrders.filter(o => o.status === "Completed").length}</span>
                        </div>
                        <div
                            className={`filter_option ${filter === 'cancelled' ? 'active' : ''}`}
                            onClick={() => setFilter('cancelled')}
                        >
                            <ImCross className="icon" />
                            <span>{t('myOrders.filters.cancelled')}</span>
                            <span className="count">{allOrders.filter(o => o.status === "Cancelled").length}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className='items_container mt-5'>
                    <div className='header'>
                        <h2>{t('myOrders.orderHistory')}</h2>
                        <p>{t('myOrders.manageOrders')}</p>
                    </div>

                    <div className='orders_list'>
                        {orderId.map((order) => (
                            <div key={order.id} className='order_card'>
                                <div className='order_header'>
                                    <div className='order_info'>
                                        <span className='order_id'>{t('myOrders.order')} #{order.id}</span>
                                    </div>
                                    <div className='order_status' style={{ color: "gray" }}>
                                        <span>{order.creatAt}</span>
                                    </div>
                                </div>

                                <div className='order_body'>
                                    <div className='order_total'>
                                        <span>{t('myOrders.total')}: {order.total} {t('common.currency')}</span>
                                    </div>
                                </div>

                                <div className='order_footer d-flex justify-content-between ' >
                                    <div>
                                        <button
                                            className='details_btn'
                                            onClick={() => getOredrDetails1(order.id)}
                                        >
                                            <FaReceipt />
                                            {t('myOrders.viewDetails')}
                                            <FaChevronRight className="arrow" />
                                        </button>
                                    </div>
                                    <div className='order_status'>
                                        <span>
                                            {order.status === "Processing" && t('myOrders.status.processing')}
                                            {order.status === "Completed" && t('myOrders.status.completed')}
                                            {order.status === "Cancelled" && t('myOrders.status.cancelled')}
                                            {order.status === "New" && t('myOrders.status.new')}

                                            {!["Processing", "Completed", "Cancelled", "New"].includes(order.status) &&
                                                order.status.charAt(0).toUpperCase() + order.status.slice(1)
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {orderId.length === 0 && (
                        <div className='no_orders'>
                            <p>{t('myOrders.noOrders')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal_overlay" onClick={() => setSelectedOrder(false)}>
                    <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                        {orderDetails.map((item, index) => (
                            <div key={index}>
                                <div className="modal_header">
                                    <h3>{t('myOrders.orderDetails')} - #{item.id}</h3>
                                    <button className="close_btn fs-2 " onClick={() => setSelectedOrder(false)}>×</button>
                                </div>

                                <div className="order_details">
                                    <div className="detail_row">
                                        <span>{t('myOrders.orderID')}:</span>
                                        <span>{item.id}</span>
                                    </div>

                                    <div className="detail_row">
                                        <span>{t('myOrders.date')}:</span>
                                        <span>{item.creatAt}</span>
                                    </div>

                                    <div className="detail_row">
                                        <span>{t('myOrders.status2')}:</span>
                                        <span>
                                            {item.status === "Processing" && t('myOrders.status.processing')}
                                            {item.status === "Completed" && t('myOrders.status.completed')}
                                            {item.status === "Cancelled" && t('myOrders.status.cancelled')}
                                            {item.status === "New" && t('myOrders.status.new')}
                                            {!["Processing", "Completed", "Cancelled", "New"].includes(item.status) &&
                                                item.status.charAt(0).toUpperCase() + item.status.slice(1)
                                            }

                                        </span>
                                    </div>

                                    <div className="items_list">
                                        <h4>{t('myOrders.items')}:</h4>
                                        {item.items.map((meal, index) => (
                                            <div key={index} className="item_detail">
                                                <span>{meal.quantity}x {lan === 'ar' ? meal.name_ar : meal.name_en}</span>
                                                <span>{Number(meal.price).toFixed(2)} {t('common.currency')}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="total_section">
                                        <div className="detail_row total d-flex flex-column">
                                            <div className=' detail_row fs-6 d-flex justify-content-between ' >
                                                <div className=' text-secondary'>
                                                    <span>{t('myOrders.taxFees')}:</span>
                                                    <span className='ms-3 text-secondary '>{item.tax_fees} {t('common.currency')}</span>
                                                </div>
                                                <div className='text-secondary' >
                                                    <span>{t('myOrders.deliveryFees')}:</span>
                                                    <span className='ms-3 text-secondary ' >{item.delivery_fees} {t('common.currency')}</span>
                                                </div>
                                            </div>
                                            <div className=' detail_row ' >
                                                <span>{t('myOrders.total')}:</span>
                                                <span>{item.total} {t('common.currency')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyOrder