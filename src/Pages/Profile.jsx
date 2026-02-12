import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import NaveBare from './NaveBare';
import { useCartAddresses } from '../store/CartStore';
import LogInAgain from './LogInAgain';
import { useTranslation } from 'react-i18next';
import AddressModal from './AddressModal'
import AddAddresses from './AddAddresses'

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

  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [street, setStreet] = useState('')
  const [bulding, setBulding] = useState('')
  const [floor, setFloor] = useState('')
  const [Apartment, setApartment] = useState('')
  const [addName, setAddName] = useState('')
  const [other, setOther] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errMessage, setErrMessage] = useState(false)

  const addnewadd = useCartAddresses((state) => state.addAddress)
  const addresscontainer = useCartAddresses((state) => state.address)
  const [selectAddressStyle, setSelectAddressStyle] = useState(addresscontainer?.id || null)
  const clearAddress = useCartAddresses((state) => state.cleerAddress)

  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;

  // Helper function to get display name based on current language


  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${URL}/profile/address?api_token=${token}`);

      if (res.data.response == false) {
        if (res.data.message === "Invalid Token") {
          localStorage.removeItem("token");
          setErrMessage(true);
        } else {
          toast.error(t('Profile.somethingWrong'));
        }
      } else {
        const addresses = res.data.data.address.map(addr => ({
          name: addr.address_name,
          address: addr.address1,
          id: addr.id
        }));

        setAddressMessage(addresses);
        //////////////////////////////// if there is one address 
        if (addresses.length === 1) {
          addnewadd(addresses[0]);
          setSelectAddressStyle(addresses[0].id);
        }
      }
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






  return (
    <div className='container_feedBack' dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="navprofilebar">
        <NaveBare token={token} />
      </div>

      <div className="testimonial">
        <div className="profile">
          <div className="avatar"></div>
        </div>

        <div className={token ? 'quote' : 'donot_show'}>
          <p>{t('Profile.name')}: {user_name}</p>
          <p>{t('Profile.email')}: {user_email}</p>
          <p>{t('Profile.phone')}: {user_phone}</p>
        </div>

        <p className={token ? 'donot_show' : 'error2'}>
          {t('Profile.noAccount')}
        </p>

        <div onClick={handleAddress} className='address_sec'>
          <h2 className={currentLanguage == 'en' ? `arow ` : 'arowAR'}  > &gt; </h2>
          <h4>{t('Profile.addresses')}</h4>
          <p>{t('Profile.addOrRemove')}</p>
        </div>
      </div>

      <div className='container_button'>
        <div className={token ? 'token' : 'donot_show'}>
          <Link to='/edit-profile' className='the_button'>{t('Profile.editProfile')}</Link>
          <Link to='/change-password' className='the_button'>{t('Profile.changePassword')}</Link>
        </div>

        <div className={token ? 'donot_show' : 'token'}>
          <Link to='/Login' className='the_button'>{t('Profile.login')}</Link>
          <Link to='/Regester' className='the_button'>{t('Profile.register')}</Link>
        </div>
      </div>

      {popUp && (
        <AddressModal
          setPopUp={setPopUp}
          setAddAddress={setAddAddress}
          setCityNameId={setCityNameId}
          addressMessage={addressMessage}
          setAddressMessage={setAddressMessage}
          fetchAddresses={fetchAddresses}
          Profile = {true}

        />
      )}

      {addAddress && (
        <AddAddresses
          setPopUp={setPopUp}
          setAddAddress={setAddAddress}
          setCityNameId={setCityNameId}
          cityNameId={cityNameId}
          addressMessage={addressMessage}
          setAddressMessage={setAddressMessage}
          fetchAddresses={fetchAddresses}
        />
      )}

      {errMessage && (
        <LogInAgain />
      )}
    </div>
  );
}

export default Profile;