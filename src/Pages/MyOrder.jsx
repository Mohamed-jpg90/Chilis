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
                // console.log("API response:", res.data.data.details);

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
                notes: item.notes,
           payment_method: item.payment_method,
                delivery_type: item.delivery_type,
                delivery_fees: item.delivery_fees,
                tax_fees: item.tax_fees,

                address1: item?.address?.address1,
                items: item.items.map(e => ({
                    mealId: e.id,
                    name_en: e.name.name_en,
                    name_ar: e.name.name_ar,
                    quantity: e.count,
                    price: e.total_price,
                    total_extras_price: e.total_extras_price,
                    special:e.special
                })),

                branch: item.branch.map(e => ({
                    address_ar: e.address_ar,
                    address_en: e.address_en,

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
                        {orderDetails.map((item) => (
                            <div key={item.id}>
                                <div className="modal_header3">
                                    <h5>{t('myOrders.items')}</h5>
                                    <h5>{t('myOrders.notes')}</h5>
                                    <h5>{t('myOrders.price')}</h5>
                                    <h5>{t('myOrders.total')}</h5>
                                </div>
                                <div className="items_list">
                                    {item.items.map((meal, index) => (
                                        <div key={index} className="item_detail">
                                            <span>
                                                {meal.quantity}x {lan === 'ar' ? meal.name_ar : meal.name_en}
                                            </span>

                                            {/* price for single item */}
                                            <span>
                                                <span className="">
                                                 {meal.special || '--'}
                                                </span>
                                            </span>

                                            {/* extras */}
                                            <span>

                                                {(meal.price / meal.quantity).toFixed(2)} {t('common.currency')}

                                            </span>

                                            {/* total item price */}
                                            <span>
                                                {Number(meal.price).toFixed(2)} {t('common.currency')}
                                            </span>
                                        </div>
                                    ))}
                                </div>



                                <div className="detail_row total">

                                    <div className="paymentType">

                                        <div>
                                            <h5>{t('myOrders.paymentType')} :</h5>
                                            <span className="text-secondary">
                                                {item.delivery_type === '1'
                                                    ? t('myOrders.cash')
                                                    : t('myOrders.online')}
                                            </span>
                                        </div>

                                        <div>
                                            <h5>{t('myOrders.deliveryFee')} :</h5>
                                            <span className="text-secondary">
                                                {Number(item.delivery_fees || 0).toFixed(2)} {t('common.currency')}
                                            </span>
                                        </div>

                                        <div>
                                            <h5>{t('myOrders.taxFees')} :</h5>
                                            <span className="text-secondary">
                                                {Number(item.tax_fees || 0).toFixed(2)} {t('common.currency')}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="paymentType mt-3 d">

                                        <div>
                                            <h5>{t('myOrders.total_extras_price')} :</h5>
                                            <span className="text-secondary">
                                            {Number(
                                                item.items.reduce(
                                                    (sum, m) => sum + Number(m.total_extras_price || 0),
                                                    0
                                                )
                                            ).toFixed(2)} {t('common.currency')}
                                            </span>
                                        </div>

                                        <div>
                                            <h5>{t('myOrders.subTotal')} :</h5>
                                            <span className="text-secondary">
                                                {Number(
                                                    item.items.reduce(
                                                        (sum, m) => sum + Number(m.price || 0),
                                                        0
                                                    )
                                                ).toFixed(2)} {t('common.currency')}
                                            </span>
                                        </div>

                                        <div>
                                            <h5>{t('myOrders.totalAmount')} :</h5>
                                            <span className="text-secondary">
                                                {Number(item.total).toFixed(2)} {t('common.currency')}
                                            </span>
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



