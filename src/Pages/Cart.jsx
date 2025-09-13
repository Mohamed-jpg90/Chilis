import { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css'
import NaveBare from './NaveBare';
import imag7 from '../images/london.jpg'
import imag8 from '../images/logo.png'
import Button from '@mui/material/Button';
import { useCartStore } from '../store/CartStore';
const token = localStorage.getItem("token")
const URL = "https://myres.me/chilis-dev/api";
import { toast } from 'react-hot-toast';
import { useCartAddresses } from '../store/CartStore';
import LoadingButton from '@mui/lab/LoadingButton';


/////////////////////////////////////////////////////////////
function Cart() {
  const [loading, setLoading] = useState(false)
  const cart = useCartStore((state) => state.cart)
  // const [quantity, setQuantity] = useState(cart.quantity)
  const removeFromCart = useCartStore((state) => state.removeFromTheCart)
  const updateQuantity = useCartStore((state) => state.updateCart)

  const addnewadd = useCartAddresses((state) => state.addAddress)
  const addresscontainer = useCartAddresses((state) => state.address)
  const clearAddress = useCartAddresses((state) => state.cleerAddress)

  const [pickup, setPickup] = useState(false)
  const [addressMessage, setAddressMessage] = useState([]);
  const [popUp, setPopUp] = useState(false)
  const [addAddress, setAddAddress] = useState(false)
  const [areaContainer, setAreaContainer] = useState([])


  const [cityNameId, setCityNameId] = useState([])

  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [street, setStreet] = useState('')
  const [bulding, setBulding] = useState('')
  const [floor, setFloor] = useState('')
  const [Apartment, setApartment] = useState('')
  const [addName, setAddName] = useState('')
  const [other, setOther] = useState(false)

  const [errMessage, setErrMessage] = useState('')
  const [selectAddressStyle, setSelectAddressStyle] = useState(addresscontainer?.id || null)


  const [brachs, setBranchs] = useState([])
  const [ SelectedBranch, setSelectedBranch]= useState('')
  /////////////////////////////////////////////////////
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.price || 0;
    const extrasTotal = item.extras?.reduce((eSum, e) => eSum + (e.price || 0), 0) || 0;
    return sum + (itemPrice + extrasTotal) * item.quantity;
  }, 0);


  const deliveryFee = pickup ? 0 : 50;
  const taxRate = 0.14;
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax;

  //////////////////////////////////////////////////////

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${URL}/profile/address?api_token=${token}`);
      const addresses = res.data.data.address.map(addr => ({
        name: addr.address_name,
        address: addr.address1,
        id: addr.id
      }));
      setAddressMessage(addresses);


    } catch (e) {
      console.log("the error is :", e);
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, []);

  ///////////////////////////////////////////////////////////
  const handeleChooseAddress = (item) => {
    const theSelectedAddress = {
      id: item.id,
      address: item.address,
      name: item.name
    }
    addnewadd(theSelectedAddress)
    setSelectAddressStyle(item.id)
  }
  ////////////////////////////////////

  const handleAddress =  () => {
    setPopUp(true)
    setAddAddress(false)
  };
  //////////////////////////////////////////////////////////////
  const handeleCity = async (x) => {

    try {
      const res = await axios.get(`${URL}/areas?city=${x}`);

      const mes = res.data.data.areas.map((area) => ({
        name: area.area_name_en,
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
        id: city.id
      }))

      setCityNameId(x)

      //  console.log(res.data.data.cities[0].name_en)
    } catch (e) {
      console.log("the error :", e)
    }


  }


  // const handeleDelet = async (x) => {
  //   const swalWithBootstrapButtons = Swal.mixin({
  //     customClass: {
  //       confirmButton: "butttton",
  //       cancelButton: "butttton2"
  //     },
  //     buttonsStyling: false
  //   });

  //   swalWithBootstrapButtons.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonText: "No, cancel!",
  //     reverseButtons: true
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const res = await axios.post(
  //           `${URL}/profile/address/delete/${x}?api_token=${token}`
  //         );

  //         if (res.data.data.message == "Address Removed Successfully") {

  //           setAddressMessage(prev => prev.filter(addr => addr.id != x))
  //           toast.success('Address Removed Successfully')

  //         }
  //       } catch (e) {
  //         console.log("the error is :", e);
  //         Swal.fire("Error", "Something went wrong while deleting!", "error");
  //       }
  //     }
  //   });
  // };
  //////////////////////////////////////////////



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
      // setErrMessage("You should complete all requirements.");
      toast.error("You should complete all requirements.")
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
        setErrMessage("");

        setAddAddress(false);
        await fetchAddresses()
        toast.success('add success')
        setPopUp(true)
      } catch (e) {
        console.error("Error adding address:", e);
        setErrMessage("Failed to add address. Please try again.");
      } finally {
        setLoading(false)
      }
    }

  };
  //////////////////////////
  const handelpickup = async () => {
    const res = await axios.get(`${URL}/branches/1`)
    const allBranches = res.data.data.branches.map((bran) => (
      {
        name: bran.name_en,
        id: bran.id,
      }

    ))
    setBranchs(allBranches)
  }
  useEffect(() => {
    handelpickup()
  }, [])
  ///////////////////////////////////////////////////
  return (
    <div className='cart_container' >
          <div className="navprofilebar">
            <NaveBare token={token} />
          </div>
      <div className="content_of_cart">
        {!pickup && (

          <div className='address_of_user'>


            <h2>Addresses</h2>
            <div className='the_actual_address'>
              {addresscontainer && addresscontainer.address ? (
                <p>{addresscontainer.address}</p>
              ) : addressMessage.length === 0 ? (
                <p>No addresses yet</p>
              ) : (
                <p>Please select an address</p>
              )}
            </div>
            <Button
              size="small"
              onClick={() => { setPopUp(true) }}
              loading={loading}
              // loadingIndicator="Loading…"
              variant="outlined"
              className='the_button2'
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
              change the Address

            </Button>
          </div>
        )}

        {pickup && (
          <div className='address_of_user'>
            <h6>Select a branch for pickup</h6>
            <select
              onChange={(e) => setSelectedBranch(e.target.value)}
              value={SelectedBranch}
              className='select_prach'
            >
              <option value="" disabled  >Select a branch</option>
              {brachs.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}


        <div className="items_products">
          <div className='cart_menu' >
            <img src={imag8} alt='logo' style={{ maxWidth: "50px", marginRight: "10px" }} />  <span > chili’s </span>
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
                  <div className="row g-0">
                    {/* <div className="col-md-4 imag_cart_item">
                      <img
                        src={item.image } // لو عندك صورة جوه المنتج
                        className="img-fluid rounded-start"
                        alt={item.name}
                      />
                    </div> */}
                    <div className="col-md-8">
                      <div className="card-body ">
                        <div className='header_of_the_card' >
                          <div className='header_text_cart' > <h6 className="">{item.name}</h6></div>

                          <div className="counter">
                            <button
                              className="counter-btn"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.id, item.quantity - 1);
                                }
                                else {
                                  removeFromCart(item.id)
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

                                useCartStore.getState().removeFromTheCart(item.id)
                              }

                              }
                            >
                              &times;
                            </button>
                          </div>

                        </div>
                        <hr />
                        <div className="delevery_total_price">
                          <div>
                            <p>Regular</p>
                            <p>{(item.price * item.quantity).toFixed(2)} EGP</p>
                          </div>

                          {item.option && (
                            <div>
                              <p>option</p>
                              <p>  {item.option.name} </p>
                            </div>
                          )}
                          {item.extras && (
                            <div className='d-flex flex-column mt-1' >
                              {item.extras.map((ee) => (
                                <div key={ee.id} >
                                  <p>{ee.name}</p>
                                  <p>{ee.price} EGP</p>
                                </div>
                              ))}
                            </div>
                          )}


                        </div>
                        <input
                          placeholder='Enter Your Note'
                          type="text"
                          style={{ marginTop: "-8px", width: "100%", borderTop: "1px solid #f44336" }}
                        />

                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No items in cart</p>
            )}
          </div>

          <hr />

          <div className='item_total_price'>
            <div className='Select_delivery_type' >
              <h5>Select delivery type</h5>
              <div className='type_of_delevery mt-2 '>
                <div  >
                  <label className="radio_label" onClick={() => setPickup(false)}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={!pickup}

                    />
                    Delivery
                  </label>
                </div>

                <div>
                  <label className="radio_label "
                    onClick={() => {

                      setPickup(true)
                    }}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value={pickup}
                      checked={pickup}
                    />
                    Pickup
                  </label>
                </div>
              </div>
              <hr />
              <div className="delevery_total_price">
                <div>
                  <p>Subtotal</p>
                  <p>{subtotal.toFixed(2)} EGP</p>
                </div>
                {!pickup && (
                  <div>
                    <p>Delivery Fee</p>
                    <p>{deliveryFee.toFixed(2)} EGP</p>
                  </div>
                )}

                <div>
                  <p>Tax %{Math.floor(taxRate * 100)}</p>
                  <p>{tax.toFixed(2)} EGP</p>
                </div>
                <hr />
                <div>
                  <h4>total</h4>
                  <p>{total.toFixed(2)} EGP</p>
                </div>

              </div>
            </div>
            <div className='the_buttom_cart' >
              <h5>Select Payment Method</h5>
              <div className='type_of_delevery mt-2'>
                <div  >
                  <label className="radio_label"  >
                    <input
                      type="radio"
                      name="PaymentMethod"
                      value="delivery"
                      checked
                    />
                    Cash on Delivery
                  </label>
                </div>

                <div>
                  <label className="radio_label"  >
                    <input
                      type="radio"
                      name="PaymentMethod"
                      value="pickup"
                    />
                    Credit Card
                  </label>
                </div>
              </div>

              <Button
                size="small"
                onClick={() => { }}
                loading={loading}
                // loadingIndicator="Loading…"
                disabled={cart.length === 0}
                variant="outlined"
                className='the_button2'
                sx={{
                  width: "100%",

                  marginTop: "30px",
                  backgroundColor: "#f44336",
                  border: 0,
                  borderRadius: "15px",
                  padding: "13px 10px",
                  cursor: "pointer",
                  transition: "0.5s",
                  border: "3px solid #f44336",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  alignSelf: "center"

                }}
              >
                Order

              </Button>
            </div>


          </div>


        </div>
      </div>



      {popUp && (
        <div className="overlay" onClick={() => setPopUp(false)}>
          <div className="myModal" role="document" onClick={(e) => e.stopPropagation()} >
            <div className="modal_header">
              <h2> Addresses </h2>
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
                  <p className="no-address">You have no addresses yet.</p>
                ) : (
                  addressMessage.map((msg) => (
                    <div key={msg.id} className={`the_addresses ${selectAddressStyle === msg.id ? 'active_address ' : ''} `} onClick={() => handeleChooseAddress(msg)} >
                      <p className='topOfTheMessage'>
                        {msg.name}
                        {/* <button
                          className="close-btn delet_add"
                          onClick={(e) =>{ 
                            e.stopPropagation()
                            handeleDelet(msg.id)

                          }}
                        >
                          &times;
                        </button> */}
                      </p>
                      <p className='AddressMessage'>{msg.address}</p>
                    </div>
                  ))
                )}
              </div>

            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setPopUp(false)}>
                Cancel
              </button>
              <button onClick={handeleAddAddress} >
                ADD
              </button>
            </div>
          </div>
        </div>
      )}

      {addAddress && (
        <div className="overlay" onClick={() => handleAddress()} >
          <div className="myModal" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal_header">
              <h2>Add Addresses</h2>
              {/* <p className={errMessage ? 'error2' : 'donot_show'} > {errMessage} </p> */}
              <button
                className="close-btn"
                aria-label="Close popup"
                onClick={() => {
                  setPopUp(true)
                  setAddAddress(false)

                }

                }
              >
                &times;
              </button>
            </div>


            <form onSubmit={addNewAddress}>
              <div className="modal_body">
                <p className="lable">City</p>
                <select className="form_AddAddress" required defaultValue="" value={city} onChange={(e) => {


                  const selectID = e.target.value
                  setCity(selectID)
                  setArea("")
                  handeleCity(selectID)
                }
                } >
                  <option value="" disabled>
                    Select city
                  </option>
                  {cityNameId.map((mes) => (
                    <option key={mes.id} value={mes.id} >{mes.name}</option>
                  ))}
                </select>

                <p className="lable">Area</p>
                <select className="form_AddAddress form_add2" required defaultValue="" value={area} onChange={(e) => {
                  const ar = e.target.value
                  setArea(ar)

                  console.log(ar)
                }
                } disabled={!city} >
                  <option value="" disabled>
                    Select area
                  </option>
                  {areaContainer.map((mes) => (

                    <option key={mes.id} value={mes.id} >{mes.name}</option>

                  ))}
                </select>

                <p className="lable">Street</p>
                <input type="text" className="form_AddAddress" required value={street} onChange={(e) => setStreet(e.target.value)} />


                <p className="lable">Building</p>
                <input type="text" className="form_AddAddress" required value={bulding} onChange={(e) => setBulding(e.target.value)} />

                <p className="lable">Floor</p>
                <input type="text" className="form_AddAddress" required value={floor} onChange={(e) => setFloor(e.target.value)} />

                <p className="lable">Apartment</p>
                <input type="text" className="form_AddAddress" required value={Apartment} onChange={(e) => setApartment(e.target.value)} />



                <div className='home_work_other' >

                  <button type="button" onClick={() => {
                    setAddName("")
                    setAddName("Home")
                    setOther(false)
                  }}>Home</button>
                  <button type="button" onClick={() => {
                    setAddName("")
                    setAddName("Work")
                    setOther(false)
                  }}>Work</button>



                  <button type="button" onClick={() => {
                    setOther(true);
                    setAddName("");
                  }}>Other</button>


                </div>

                {other && (
                  <div>
                    <p className="lable">other</p>

                    <input
                      type="text"
                      required
                      value={addName}
                      onChange={(e) => setAddName(e.target.value)} className='form_AddAddress'
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
                  Cancel
                </button>

                <LoadingButton
                  type="submit"
                  size="small"
                  loading={loading}
                  // loadingIndicator="Loading…"
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
                  Add Address
                </LoadingButton>
                {/* <button type="submit">Add Address</button> */}
              </div>
            </form>
          </div>
        </div>
      )}






    </div>
  )
}

export default Cart
