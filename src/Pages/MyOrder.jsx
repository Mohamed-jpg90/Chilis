import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'
import NaveBare from './NaveBare'
import img1 from '../images/aboutUs.jpg'
import { FaRegClock, FaCheck, FaChevronRight, FaReceipt } from "react-icons/fa";
import { ImCross } from "react-icons/im";

function MyOrder() {
    const token = localStorage.getItem("token")
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [filter, setFilter] = useState('all') // all, progress, completed, cancelled

    // Mock data - replace with actual API call
    useEffect(() => {
        // Simulate API call
        const mockOrders = [
            {
                id: 'ORD-001',
                date: '2024-01-15',
                status: 'completed',
                total: 45.99,
                items: [
                    { name: 'Burger', quantity: 2, price: 12.99 },
                    { name: 'Fries', quantity: 1, price: 4.99 },
                    { name: 'Soda', quantity: 2, price: 3.99 }
                ]
            },
            {
                id: 'ORD-002',
                date: '2024-01-16',
                status: 'progress',
                total: 28.50,
                items: [
                    { name: 'Pizza', quantity: 1, price: 18.99 },
                    { name: 'Salad', quantity: 1, price: 9.51 }
                ]
            },
            {
                id: 'ORD-003',
                date: '2024-01-14',
                status: 'cancelled',
                total: 15.75,
                items: [
                    { name: 'Pasta', quantity: 1, price: 15.75 }
                ]
            }
        ]
        setOrders(mockOrders)
    }, [])

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(order => order.status === filter)



    return (
        <div className='my_order_section'>
            <NaveBare token={token} />
            <div className='container_myOrder  '>
                {/* Sidebar */}
                <div className='sidebar mt-5'>
                    <div className="sidebar-header">
                        <h2>My Orders</h2>
                    </div>
                    <hr />
                    <div className='filter_options'>
                        <div 
                            className={`filter_option ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            <span>All Orders</span>
                            <span className="count">{orders.length}</span>
                        </div>
                        <div 
                            className={`filter_option ${filter === 'progress' ? 'active' : ''}`}
                            onClick={() => setFilter('progress')}
                        >
                            <FaRegClock className="icon" />
                            <span>In Progress</span>
                            <span className="count">{orders.filter(o => o.status === 'progress').length}</span>
                        </div>
                        <div 
                            className={`filter_option ${filter === 'completed' ? 'active' : ''}`}
                            onClick={() => setFilter('completed')}
                        >
                            <FaCheck className="icon" />
                            <span>Completed</span>
                            <span className="count">{orders.filter(o => o.status === 'completed').length}</span>
                        </div>
                        <div 
                            className={`filter_option ${filter === 'cancelled' ? 'active' : ''}`}
                            onClick={() => setFilter('cancelled')}
                        >
                            <ImCross className="icon" />
                            <span>Cancelled</span>
                            <span className="count">{orders.filter(o => o.status === 'cancelled').length}</span>
                        </div>
                    </div>
                </div>  

                {/* Main Content */}
                <div className='items_container mt-5'>
                    <div className='header'>
                        <h2>Order History</h2>
                        <p>Manage and track your orders</p>
                    </div>

                    <div className='orders_list'>
                        {filteredOrders.map(order => (
                            <div key={order.id} className='order_card'>
                                <div className='order_header'>
                                    <div className='order_info'>
                                        <span className='order_id'>Order #{order.id}</span>
                                        <span className='order_date'> 2525</span>
                                    </div>
                                    <div className='order_status' style={{ color: "black" }}>
                                    
                                        <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                    </div>
                                </div>

                                <div className='order_body'>
                                    <div className='order_items_preview'>
                                        {order.items.slice(0, 2).map((item, index) => (
                                            <span key={index} className='item_preview'>
                                                {item.quantity}x {item.name}
                                            </span>
                                        ))}
                                        {order.items.length > 2 && (
                                            <span className='more_items'>+{order.items.length - 2} more</span>
                                        )}
                                    </div>
                                    <div className='order_total'>
                                        ${order.total.toFixed(2)}
                                    </div>
                                </div>

                                <div className='order_footer'>
                                    <button 
                                        className='details_btn'
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <FaReceipt />
                                        View Details
                                        <FaChevronRight className="arrow" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className='no_orders'>
                            <p>No orders found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal_overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal_header">
                            <h3>Order Details - #{selectedOrder.id}</h3>
                            <button className="close_btn" onClick={() => setSelectedOrder(null)}>×</button>
                        </div>
                        
                        <div className="order_details">
                            <div className="detail_row">
                                <span>Order ID:</span>
                                <span>{selectedOrder.id}</span>
                            </div>
                            <div className="detail_row">
                                <span>Date:</span>
                                <span>{"5444"}</span>
                            </div>
                            <div className="detail_row">
                                <span>Status:</span>
                                <span style={{ color: "black"}}>
                                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                </span>
                            </div>
                            
                            <div className="items_list">
                                <h4>Items:</h4>
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="item_detail">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>${(item.quantity * item.price).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="total_section">
                                <div className="detail_row total">
                                    <span>Total:</span>
                                    <span>${selectedOrder.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyOrder