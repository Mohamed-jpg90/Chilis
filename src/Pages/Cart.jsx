import { useState, useEffect } from 'react';
import axios from 'axios';
import NaveBare from './NaveBare';

import imag8 from '../images/logo.png'
import Button from '@mui/material/Button';
import { useCartStore } from '../store/CartStore';
import { useTranslation } from 'react-i18next';

const URL = "https://myres.me/chilis-dev/api";
import { toast } from 'react-hot-toast';
import { useCartAddresses } from '../store/CartStore';
import LoadingButton from '@mui/lab/LoadingButton';
import LogInAgain from './LogInAgain';
import Swal from 'sweetalert2';

import { useNavigate } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const cart = useCartStore((state) => state.cart)
  const updateNote = useCartStore((state) => state.updateNote)
  const removeFromCart = useCartStore((state) => state.removeFromTheCart)
  const updateQuantity = useCartStore((state) => state.updateCart)
  const setTotal = useCartStore((state) => state.setTotal);
  const startPayment = useCartStore((state) => state.startPayment)
  const canPay = useCartStore ((state)=> state.canPay)

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loginPlease, setLoginPlease] = useState(token)
  const addnewadd = useCartAddresses((state) => state.addAddress)
  const addresscontainer = useCartAddresses((state) => state.address)
  const clearAddress = useCartAddresses((state) => state.cleerAddress)

  const [pickup, setPickup] = useState(false)
  const [addressMessage, setAddressMessage] = useState([]);
  const [popUp, setPopUp] = useState(false)
  const [addAddress, setAddAddress] = useState(false)
  const [areaContainer, setAreaContainer] = useState([])

  const [cityNameId, setCityNameId] = useState([])

  const [credit, setCredit] = useState(false)

  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [street, setStreet] = useState('')
  const [bulding, setBulding] = useState('')
  const [floor, setFloor] = useState('')
  const [Apartment, setApartment] = useState('')
  const [addName, setAddName] = useState('')
  const [other, setOther] = useState(false)

  const [errMessage, setErrMessage] = useState(false)
  const [selectAddressStyle, setSelectAddressStyle] = useState(addresscontainer?.id || null)

  const [brachs, setBranchs] = useState([])
  const [SelectedBranch, setSelectedBranch] = useState('')

  const [theShop, setTheShop] = useState(0)


  const cleare = useCartStore((state) => state.clearProducts)
  const [orederID, setOrderID] = useState("")
  const [tax3, setTax3] = useState('')
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isLoadingCoupon, setIsLoadingCoupon] = useState(false);
  const [cancel, setCancel] = useState(false)


  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;

    try {
      setIsLoadingCoupon(true);
      setCouponError("");
      const res = await axios.get(`${URL}/coupon/validation?coupon=${coupon}&api_token=${token}`)
      if (res.data.message === "Invalid Token") {
        localStorage.removeItem("token")
        setErrMessage(true)
      }



      else if (res.data.message === "Invalid Code") {
        setDiscount(0);
        setCouponError("Invalid coupon");
      }

      else {
        setDiscount(res.data.coupon.percentage);
        setCouponError("");
        setCancel(true)
      }
    } catch (err) {
      setCouponError("Something went wrong");
    } finally {
      setIsLoadingCoupon(false);
    }
  };


  const handleCancelCoupon = () => {
    setCoupon("");
    setDiscount(0);
    setCouponError("");
    setCancel(false)
  };


  const handel_tax = async () => {
    try {
      const res = await axios.get(`${URL}/settings`)
      console.log(res.data.data.tax)
      setTax3(res.data.data.settings.tax)
    } catch (e) {
      console.log("the error is ", e);

    }
  }

   const handeleDelet = async (id) => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "butttton",
          cancelButton: "butttton2"
        },
        buttonsStyling: false
      });
  
      swalWithBootstrapButtons.fire({
        title: t('Profile.deleteConfirmTitle'),
        text: t('Profile.deleteConfirmText'),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t('Profile.deleteConfirm'),
        cancelButtonText: t('Profile.deleteCancel'),
        reverseButtons: true
      }).then((result)=>
      {
        if(result.isConfirmed){
          useCartStore.getState().removeFromTheCart(id )
        }
        else{
          console.log("halllow ")
        }
      });
    };
  

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Helper function to get display name based on current language
  const getDisplayName = (item) => {
    return currentLanguage === 'ar' && item.namear ? item.namear : item.name;
  };

  /////////////////////////////////////////////////////
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.price || 0;
    const extrasTotal = item.extras?.reduce((eSum, e) => eSum + (e.price || 0), 0) || 0;
    return sum + (itemPrice + extrasTotal) * item.quantity;
  }, 0);

const deliveryFee = pickup
  ? 0
  : typeof addresscontainer?.deliveryFee === "number"
    ? addresscontainer.deliveryFee
    : 0;
    
    const taxRate = tax3 / 100;

  const tax2 = subtotal * taxRate;
  const totalDidscount = (subtotal + deliveryFee + tax2) * (discount / 100)
  const total = subtotal + deliveryFee + tax2 - totalDidscount;
  //////////////////////////////////////////////////////
  const fetchAddresses = async () => {
    if (!token) {
      setAddressMessage([]);
      return;
    }
    else {
      try {
        const res = await axios.get(`${URL}/profile/address?api_token=${token}`);
        // console.log(res.data.data.address);

        if (res.data.response == false) {
          if (res.data.message === "Invalid Token") {
            localStorage.removeItem("token")
            setErrMessage(true)
          }
          else toast.error(t('Cart.somethingWrong'))
        }
        else {

          const addresses = res.data.data.address.map(addr => ({
            name: addr.address_name,
            address: addr.address1,
            id: addr.id,
            deliveryFee: addr?.area?.area_branches?.delivery_fees ?? 70
             
          }));
          setAddressMessage(addresses);
        }
      } catch (e) {
        console.log("the error is :", e);
      }
    }
  };

  useEffect(() => {
    fetchAddresses();
    handel_tax()

  }, []);

  ///////////////////////////////////////////////////////////
  const handeleChooseAddress = (item) => {
    const theSelectedAddress = {
      id: item.id,
      address: item.address,
      name: item.name,
      deliveryFee: item.deliveryFee || 60
    }
    addnewadd(theSelectedAddress)
    setSelectAddressStyle(item.id)
  }

  const handleAddress = () => {
    setPopUp(true)
    setAddAddress(false)
  };

  //////////////////////////////////////////////////////////////
  const handeleCity = async (x) => {
    try {
      const res = await axios.get(`${URL}/areas?city=${x}`);
      const mes = res.data.data.areas.map((area) => ({
        name: area.area_name_en,
        namear: area.area_name_ar,
        id: area.id
      }))
      setAreaContainer(mes)
    } catch (e) {
      console.log("the error is :", e);
    }
  };
  //////////////////////////////////////////////////////////////

  const handeleAddAddress = async () => {
    setPopUp(false)
    setAddAddress(true)
    try {
      const res = await axios.get(`${URL}/cities`)
      const x = res.data.data.cities.map(city => ({
        name: city.name_en,
        namear: city.name_ar,
        id: city.id
      }))
      setCityNameId(x)
    } catch (e) {
      console.log("the error :", e)
    }
  }
  //////////////////////////////////////////////////////////////

  const addNewAddress = async (e) => {
    e.preventDefault()
    if (
      !area?.trim() ||
      !street?.trim() ||
      !bulding?.trim() ||
      !floor?.trim() ||
      !Apartment?.trim() ||
      !addName?.trim()
    ) {
      toast.error(t('Cart.completeRequirements'))
      return;
    }
    else {
      setLoading(true)
      try {
        const Basicurl = `${URL}/profile/address/add?area=${area}&street=${street}&building=${bulding}&floor=${floor}&apt=${Apartment}&name=${addName}&lat=20.222222&lng=30.333333&api_token=${token}`
        console.log("Basicurl:", Basicurl);
        const res = await axios.post(`${Basicurl}`);
        console.log("Address added successfully:", res.data);

        // Reset form after success
        setArea("");
        setStreet("");
        setBulding("");
        setFloor("");
        setApartment("");
        setAddName("");
        setErrMessage(false);

        setAddAddress(false);
        await fetchAddresses()
        toast.success(t('Cart.addSuccess'))
        setPopUp(true)
      } catch (e) {
        console.error("Error adding address:", e);
      } finally {
        setLoading(false)
      }
    }
  };
  //////////////////////////////////////////////////////////////

  const handelpickup = async () => {
    const res = await axios.get(`${URL}/branches/1`)
    const allBranches = res.data.data.branches.map((bran) => ({
      name: bran.name_en,
      namear: bran.name_ar,
      id: bran.id,
    }))
    setBranchs(allBranches)
  }
  //////////////////////////////////////////////////////////////

  useEffect(() => {
    handelpickup()
  }, [])

  ///////////////////////////////////////////////////


  const handelOrder = async () => {

    if (credit) {
      // جهز البيانات اللي هنبعتها لصفحة الدفع
      const pendingOrder = {
        pickup,
        SelectedBranch,
        addresscontainer,
        cart,
        total,
        deliveryFee,
        tax2,
        discount
      };

      startPayment();
      navigate("/payment");
      return;
    }

    //----------------------------------------------------------//
    // chash on delevery 
    //----------------------------------------------------------//
    else if (pickup && !SelectedBranch) {
      toast.error("you must Select Branch");
      return;
    } else {

      const deliveryType = pickup ? 2 : 1;
      const paymentType = credit ? 2 : 1;


      const itemsData = {
        items: cart.map((item) => ({

          id: item.infoID,
          choices: [],
          extras: item.extras.map((ex) => ex.id),
          options: item.option ? [item.option.id] : [],
          count: item.quantity,
          special: item.special || ""
        }))
      };
      const itemsString = JSON.stringify(itemsData);
      const orderUrl = `${URL}/orders/create?delivery_type=${deliveryType}&payment=${paymentType}&lat=0&lng=0&address=${addresscontainer?.id}&area=10&branch=${SelectedBranch || 2}&items=${itemsString}&device_id=&notes=&time=&car_model=&car_color=&gift_cards=&coins=0.00&api_token=${token}`;

      try {
        setLoading(true);
        const res = await axios.post(orderUrl);
        if (res.data.response === false) {
          if (res.data.message === "Invalid Token") {
            localStorage.removeItem("token");
            setErrMessage(true);
          } else {
            toast.error(t('Cart.SomethingWrong'));
          }
        } else {
          toast.success(t('Cart.OrderCreated'));
          setOrderID(res.data.data.order_id);
          console.log(res?.data?.data)
          cleare();
        }


      } catch (e) {
        console.log("Order error:", e);
        toast.error("Something went wrong while creating the order");
      } finally {
        setLoading(false);
      }


    }


  }
  /////////////////////////////////////
  useEffect(() => {
    setTotal(total);
  }, [total]); // to store the total and use it in the payment page 


   useEffect(() => {
   console.log("canPay:", canPay);
   }, [canPay]);


  /////////////////////////////////////////////////
  return (
    <div className='cart_container' dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* /////////////nav bar /////////////////////// */}
      <div className="navprofilebar">
        <NaveBare token={token} />
      </div>
      {/* ////////////////////////////////////// */}
      <div className="content_of_cart">
        {!pickup && (
          <div className='address_of_user'>
            <h2>{t('Cart.addresses')}</h2>
            <div className='the_actual_address'>
              {!token ? (
                <p>{t('Cart.mustLogin')}</p>
              ) : addresscontainer && addresscontainer.address ? (
                <p>{addresscontainer.address}</p>
              ) : addressMessage.length === 0 ? (
                <p>{t('Cart.noAddresses')}</p>
              ) : (
                <p>{t('Cart.selectAddress')}</p>
              )}
            </div>
            <Button
              size="small"
              onClick={() => { setPopUp(true) }}
              loading={loading}
              variant="outlined"
              className='the_button2'
              disabled={!token}
              sx={{
                width: "100%",
                marginTop: "30px",
                backgroundColor: "#f44336",
                border: 0,
                borderRadius: "15px",
                padding: "10px 5px",
                cursor: "pointer",
                transition: "0.5s",
                border: "3px solid #f44336",
                color: "white",
                fontWeight: 700,
                fontSize: "14px",
                alignSelf: "center"
              }}
            >
              {t('Cart.changeAddress')}
            </Button>
          </div>
        )}

        {pickup && (
          <div className='address_of_user'>
            <h6>{t('Cart.selectBranch')}</h6>
            <select
              onChange={(e) => setSelectedBranch(e.target.value)}
              value={SelectedBranch}
              className='select_prach'
            >
              <option value="" disabled>{t('Cart.selectBranch')}</option>
              {brachs.map((branch) => (
                <option key={branch.id} value={branch.id} onClick={() => { setTheShop(brachs.id) }} >
                  {getDisplayName(branch)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="items_products">
          <div className='cart_menu' >
            <img src={imag8} alt='logo' style={{ maxWidth: "50px", marginRight: "10px" }} />
            <span> {t("chili's")}</span>
          </div>
          <hr />

          <div className='cart_item'>
            {cart && cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="card mb-3 mx-auto"
                  style={{ maxWidth: "500px" }}
                >
                  <div className="row">
                    <div className="">
                      <div className="card-body  " >
                        <div className='header_of_the_card'   >
                          <div className='header_text_cart' >
                            <h6 className="">{getDisplayName(item)}</h6>
                          </div>
                          <div className="counter">
                            <button
                              className="counter-btn"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.id, item.quantity - 1);
                                }
                                else {
                                  handeleDelet(item.id)
                                }
                              }}
                              style={{ width: "30px", height: "30px", lineHeight: "1" }}
                            >
                              -
                            </button>
                            <span className="counter-value">{item.quantity}</span>
                            <button
                              className="counter-btn"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{ width: "30px", height: "30px", lineHeight: "1" }}
                            >
                              +
                            </button>
                            <button
                              className="close-btn"
                              aria-label="Close popup"
                              onClick={() => {
                           
                                handeleDelet(item.id)
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                        <hr />
                        <div className="delevery_total_price">
                          <div>
                            <p>{t('Cart.regular')}</p>
                            <p>{(item.price * item.quantity).toFixed(2)} {t('Cart.egp')}</p>
                          </div>

                          {item.option && (
                            <div>

                              <p>{getDisplayName(item.option)}</p>
                            </div>
                          )}
                          {item.extras && (
                            <div className='d-flex flex-column mt-1' >
                              {item.extras.map((ee) => (
                                <div key={ee.id} >
                                  <p>{getDisplayName(ee)}</p>
                                  <p>{(ee.price) * (item.quantity)} {t('Cart.egp')}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          placeholder={t('Cart.enterNote')}
                          type="text"
                          style={{ marginTop: "5px", width: "100%", border: "1px solid black" }}
                          value={item.special || ""}
                          onChange={(e) => updateNote(item.id, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", fontSize: "20px" }} >{t('Cart.noItems')}</p>
            )}
          </div>
          <hr />
          {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <div className='coupon_section' style={{
            width: "100%",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <input
              type="text"
              placeholder={t('Apply.placeHolder')}
              style={{ marginTop: "5px", width: "70%", border: "1px solid black" }}
              value={coupon}
              className='input'
              onChange={(e) => {
                setCoupon(e.target.value)
                setCancel(false)
              }
              }
            />

            {/* APPLY button: يظهر لو طول الكوبون أقل من 1 */}
            {!cancel && (
              <Button
                size="small"
                loading={loading}
                onClick={handleApplyCoupon}
                variant="outlined"
                className='the_button2'
                sx={{
                  width: "20%",
                  marginTop: "3px",
                  backgroundColor: "#f44336",
                  border: "3px solid #f44336",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: "0px",
                  padding: "8px 8px",
                  cursor: "pointer",
                  transition: "0.5s",
                }}
              >
                {t('Apply.Apply')}
              </Button>
            )}

            {/* CANCEL button: يظهر لو طول الكوبون أكبر من 1 */}
            {cancel && (
              <Button
                size="small"
                onClick={handleCancelCoupon}
                variant="outlined"
                sx={{
                  width: "20%",
                  marginTop: "-2px",
                  backgroundColor: "gray",
                  border: "3px solid gray",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: "0px",
                  padding: "8px 8px",
                  cursor: "pointer",
                  transition: "0.5s",
                }}
              >
                {t('cancel')}
              </Button>
            )}

            {couponError && <p style={{ color: "red" }}>{couponError}</p>}
            {discount > 0 && (
              <p style={{ color: "red" }}>
                {`you have ${discount}% discount`}
              </p>
            )}

          </div>
          <br />

          {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <div className='item_total_price'>
            <div className='Select_delivery_type' >
              <h5>{t('Cart.selectDeliveryType')}</h5>
              <div className='type_of_delevery mt-2 '>
                <div  >
                  <label className="radio_label" onClick={() => setPickup(false)}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={!pickup}
                    />
                    {t('Cart.delivery')}
                  </label>
                </div>
                <div>
                  <label className="radio_label "
                    onClick={() => { setPickup(true) }}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value={pickup}
                      checked={pickup}
                    />
                    {t('Cart.pickup')}
                  </label>
                </div>
              </div>
              <hr />
              <div className="delevery_total_price">
                <div>
                  <p>{t('Cart.subtotal')}</p>
                  <p>{subtotal.toFixed(2)} {t('Cart.egp')}</p>
                </div>
                {!pickup && (
                  <div>
                    <p>{t('Cart.deliveryFee')}</p>
                    <p>{deliveryFee.toFixed(2)} {t('Cart.egp')}</p>
                  </div>
                )}
                <div>
                  <p>{t('Cart.tax')} {Math.floor(tax3)}%</p>
                  <p>{tax2.toFixed(2)} {t('Cart.egp')}</p>
                </div>
                {/*        
                          <div>
                  <p>{t('Cart.coupon')} </p>
                  <p>{Math.floor(discount)}%</p>
                </div> */}
                <hr />
                <div>
                  <h4>{t('Cart.total')}</h4>
                  <p>{total.toFixed(2)} {t('Cart.egp')}</p>
                </div>
              </div>
            </div>
            <div className='the_buttom_cart' >
              <h5>{t('Cart.selectPaymentMethod')}</h5>
              <div className='type_of_delevery mt-2'>
                <div  >
                  <label className="radio_label"  >
                    <input
                      type="radio"
                      name="PaymentMethod"
                      value="delivery"
                      checked={!credit}
                      onChange={() => setCredit(false)}

                    />
                    {t('Cart.cashOnDelivery')}
                  </label>
                </div>
                <div>
                  <label className="radio_label"  >
                    <input
                      type="radio"
                      name="PaymentMethod"
                      value="pickup"
                      checked={credit}
                      onChange={() => setCredit(true)}

                    />
                    {t('Cart.creditCard')}
                  </label>
                </div>
              </div>

              <Button
                size="small"
                onClick={handelOrder}
                loading={loading}
                disabled={cart.length === 0 || !token}
                variant="outlined"
                className='the_button2'
                sx={{
                  width: "100%",
                  marginTop: "30px",
                  backgroundColor: cart.length === 0 ? "gray" : "#f44336",
                  border: 0,
                  borderRadius: "15px",
                  padding: "13px 10px",
                  cursor: "pointer",
                  transition: "0.5s",
                  border: "3px solid #f44336",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  alignSelf: "center",

                }}
              >
                {t('Cart.order')}
              </Button>
            </div>
          </div>


        </div>
      </div>

      {popUp && (
        <div className="overlay" onClick={() => setPopUp(false)}>
          <div className="myModal" role="document" onClick={(e) => e.stopPropagation()} >
            <div className="modal_header">
              <h2> {t('Cart.addresses')} </h2>
              <button
                className="close-btn"
                aria-label="Close popup"
                onClick={() => setPopUp(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal_body">
              <div>
                {addressMessage.length === 0 ? (
                  <p className="no-address">{t('Cart.noAddressesYet')}</p>
                ) : (
                  addressMessage.map((msg) => (
                    <div key={msg.id} className={`the_addresses ${selectAddressStyle === msg.id ? 'active_address ' : ''} `} onClick={() => handeleChooseAddress(msg)} >
                      <p className='topOfTheMessage'>
                        {msg.name}
                      </p>
                      <p className='AddressMessage'>{msg.address}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setPopUp(false)}>
                {t('Cart.cancel')}
              </button>
              <button onClick={handeleAddAddress} >
                {t('Cart.add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {addAddress && (
        <div className="overlay" onClick={() => handleAddress()} >
          <div className="myModal" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal_header">
              <h2>{t('Cart.addAddresses')}</h2>
              <button
                className="close-btn"
                aria-label="Close popup"
                onClick={() => {
                  setPopUp(true)
                  setAddAddress(false)
                }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={addNewAddress}>
              <div className="modal_body">
                <p className="lable">{t('Cart.city')}</p>
                <select className="form_AddAddress" required defaultValue="" value={city} onChange={(e) => {
                  const selectID = e.target.value
                  setCity(selectID)
                  setArea("")
                  handeleCity(selectID)
                }} >
                  <option value="" disabled>{t('Cart.selectCity')}</option>
                  {cityNameId.map((mes) => (
                    <option key={mes.id} value={mes.id} >{getDisplayName(mes)}</option>
                  ))}
                </select>

                <p className="lable">{t('Cart.area')}</p>
                <select className="form_AddAddress form_add2" required defaultValue="" value={area} onChange={(e) => {
                  const ar = e.target.value
                  setArea(ar)
                }} disabled={!city} >
                  <option value="" disabled>{t('Cart.selectArea')}</option>
                  {areaContainer.map((mes) => (
                    <option key={mes.id} value={mes.id} >{getDisplayName(mes)}</option>
                  ))}
                </select>

                <p className="lable">{t('Cart.street')}</p>
                <input type="text" className="form_AddAddress" required value={street} onChange={(e) => setStreet(e.target.value)} />

                <p className="lable">{t('Cart.building')}</p>
                <input type="text" className="form_AddAddress" required value={bulding} onChange={(e) => setBulding(e.target.value)} />

                <p className="lable">{t('Cart.floor')}</p>
                <input type="text" className="form_AddAddress" required value={floor} onChange={(e) => setFloor(e.target.value)} />

                <p className="lable">{t('Cart.apartment')}</p>
                <input type="text" className="form_AddAddress" required value={Apartment} onChange={(e) => setApartment(e.target.value)} />

                <div className='home_work_other' >
                  <button type="button" onClick={() => {
                    setAddName("")
                    setAddName("Home")
                    setOther(false)
                  }}>{t('Cart.home')}</button>
                  <button type="button" onClick={() => {
                    setAddName("")
                    setAddName("Work")
                    setOther(false)
                  }}>{t('Cart.work')}</button>
                  <button type="button" onClick={() => {
                    setOther(true);
                    setAddName("");
                  }}>{t('Cart.other')}</button>
                </div>

                {other && (
                  <div>
                    <p className="lable">{t('Cart.other')}</p>
                    <input
                      type="text"
                      required
                      value={addName}
                      onChange={(e) => setAddName(e.target.value)}
                      className='form_AddAddress'
                      placeholder={t('Cart.enterAddressName')}
                    />
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setAddAddress(false)
                    setPopUp(true)
                  }}
                >
                  {t('Cart.cancel')}
                </button>
                <LoadingButton
                  type="submit"
                  size="small"
                  loading={loading}
                  variant="outlined"
                  className='the_button2'
                  sx={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontWeight: "500",
                    cursor: "pointer",
                    border: "2px solid #f44336",
                    transition: "background 0.2s ease"
                  }}
                >
                  {t('Cart.addAddress')}
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      )}


     {!loginPlease && (

 
           <div className="overlay" onClick={() => setLoginPlease(true)}>
          <div className="myModal" role="document" onClick={(e) => e.stopPropagation()} >
            <div className="modal_header">
              <h2> {t('Cart.Login')} </h2>
              <button
                className="close-btn"
                aria-label="Close popup"
                onClick={() => setLoginPlease(true)}
              >
                &times;
              </button>
            </div>
            <div className="modal_body">
              <div>
              
                  <p className="no-address">{t('Cart.LoginPlease')}</p>
            
                
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary"   onClick={() => setLoginPlease(true)}>
                {t('Cart.cancel')}
              </button>
              <button onClick={() => {navigate('/Login')}} >
                {t('Login.title')}
              </button>
            </div>
          </div>
        </div>
      

     )}

{/* //////////////////////////////////////////////////////// */}
      {errMessage && (
        <LogInAgain />
      )}
 



    </div>
  )
}

export default Cart