
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import './Profile.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import NaveBare from './NaveBare';
import LoadingButton from '@mui/lab/LoadingButton';
import { useCartAddresses } from '../store/CartStore';

const URL = "https://myres.me/chilis-dev/api";


function Profile() {
  const user_name = localStorage.getItem('user_name');
  const user_id = localStorage.getItem('user_id');
  const user_email = localStorage.getItem('user_email');
  const user_phone = localStorage.getItem('user_phone');
  const token = localStorage.getItem('token');
  const [popUp, setPopUp] = useState(false);
  const [addAddress, setAddAddress] = useState(false)
  const [addressMessage, setAddressMessage] = useState([])
  const [cityNameId, setCityNameId] = useState([])
  const [areaContainer, setAreaContainer] = useState([])
  const [addressName, setAddressName] = useState('')

  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [street, setStreet] = useState('')
  const [bulding, setBulding] = useState('')
  const [floor, setFloor] = useState('')
  const [Apartment, setApartment] = useState('')
  const [addName, setAddName] = useState('')
  const [other, setOther] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errMessage, setErrMessage] = useState('')



    const addnewadd = useCartAddresses((state) => state.addAddress)
    const addresscontainer = useCartAddresses((state) => state.address)
  const [selectAddressStyle, setSelectAddressStyle] = useState(addresscontainer?.id || null )
const clearAddress =useCartAddresses((state)=> state.cleerAddress )

    

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };


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



  const handleAddress = async (e) => {
    setPopUp(true)
    setAddAddress(false)
  };

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

  const handeleCity = async (x) => {
    // console.log(x);
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


  const handeleDelet = async (x) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "butttton",
        cancelButton: "butttton2"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.post(
            `${URL}/profile/address/delete/${x}?api_token=${token}`
          );

          if (res.data.data.message == "Address Removed Successfully") {

            setAddressMessage(prev => prev.filter(addr => addr.id != x))
            toast.success('Address Removed Successfully')

          if (addresscontainer?.id === x || selectAddressStyle === x) {
            clearAddress();

            setSelectAddressStyle(null); 
    
          }

          }
       
        } catch (e) {
          console.log("the error is :", e);
          Swal.fire("Error", "Something went wrong while deleting!", "error");
        }
      }
    });
  };

  /////////////////////
  
    const handeleChooseAddress = (item) => {
    const theSelectedAddress = {
      id: item.id,
      address: item.address,
      name: item.name
    }
    addnewadd(theSelectedAddress)
    setSelectAddressStyle(item.id)
  }
  
  ////////////////////////

  return (


    <div className='container_feedBack'>
      <div className="navprofilebar">
        <NaveBare token={token} />

      </div>


      <div className="testimonial">
        <div className="profile">
          <div className="avatar"></div>
        </div>

        <div className={token ? 'quote' : 'donot_show'}>
          {/* <p>id: {user_id}</p> */}
          <p>Name: {user_name}</p>
          <p>Email: {user_email}</p>
          <p>Phone: {user_phone}</p>
        </div>

        <p className={token ? 'donot_show' : 'error2'}>
          You don't have an account yet.
        </p>


        <div onClick={handleAddress} className='address_sec'>
          <h2 className='arow'> &gt; </h2>
          <h4>Addresses</h4>
          <p>Add or remove addresses</p>
        </div>
      </div>

      <div className='container_button'>
        <div className={token ? 'token' : 'donot_show'}>
          <Link to='/edit-profile' className='the_button'>Edit profile</Link>
          <Link to='/change-password' className='the_button'>Change password</Link>
        </div>

        <div className={token ? 'donot_show' : 'token'}>
          <Link to='/Login' className='the_button'>Log In</Link>
          <Link to='/Regester' className='the_button'>Register</Link>
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
                        <button
                          className="close-btn delet_add"
                          onClick={(e) => {
                            e.stopPropagation()
                            handeleDelet(msg.id)

                          }}
                        >
                          &times;
                        </button>
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
              <p className={errMessage ? 'error2' : 'donot_show'} > {errMessage} </p>
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
  );
}

export default Profile;

