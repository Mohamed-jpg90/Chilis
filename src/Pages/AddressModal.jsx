import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { useCartAddresses } from '../store/CartStore';
import Swal from 'sweetalert2';

import { FaRegTrashAlt } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const URL = "https://myres.me/chilis-dev/api";


function AddressModal({
  addressMessage,
  setPopUp,
  setAddAddress,
  setCityNameId,
  setAddressMessage,
  fetchAddresses,
  Profile,

}) {
  const token = localStorage.getItem('token');

  const addnewadd = useCartAddresses((state) => state.addAddress)
  const addresscontainer = useCartAddresses((state) => state.address)
  const clearAddress = useCartAddresses((state) => state.cleerAddress)
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  // const [selectAddressStyle, setSelectAddressStyle] =
  //   useState(addressMessage?.[0]?.id || null)

  const handeleChooseAddress = (item) => {
    addnewadd({
      id: item.id,
      address: item.address,
      name: item.name,
      deliveryFee: item.deliveryFee ?? 70
    })
  }


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

  const handeleDelet = async (x) => {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.post(
            `${URL}/profile/address/delete/${x}?api_token=${token}`
          );

          if (res.data.data.message == "Address Removed Successfully") {
            setAddressMessage(prev => prev.filter(addr => addr.id != x))
            toast.success(t('Profile.deleteSuccess'))

            if (addresscontainer?.id === x) {
              clearAddress();
              setSelectAddressStyle(null);
            }
          }
        } catch (e) {
          console.log("the error is :", e);
          Swal.fire(t('Profile.error'), t('Profile.deleteError'), "error");
        }
      }
    });
  };


  return (

    <div className="overlay" onClick={() => setPopUp(false)}>
      <div className="myModal" role="document" onClick={(e) => e.stopPropagation()} >
        <div className="modal_header">
          <h2> {t('Profile.addresses')} </h2>
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
              <p className="no-address">{t('Profile.noAddresses')}</p>
            ) : (
              addressMessage.map((msg) => (
                <div key={msg.id} className={`the_addresses ${addresscontainer?.id === msg.id ? 'active_address' : ''} `}
                  onClick={() => handeleChooseAddress(msg)} >
                  <p className='topOfTheMessage'>
                    {msg.name}

                    {Profile && (
                      <button
                        className={currentLanguage == "en" ? "close-btn delet_add" : "close-btn delet_addAR"}
                        onClick={(e) => {
                          e.stopPropagation()
                          handeleDelet(msg.id)
                        }}
                      >
                        <FaRegTrashAlt className=' fs-5 ' />
                      </button>
                    )}


                  </p>
                  <p className='AddressMessage'>{msg.address}</p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setPopUp(false)}>
            {t('Profile.cancel')}
          </button>
          <button onClick={handeleAddAddress} >
            {t('Profile.add')}
          </button>
        </div>
      </div>
    </div>

  )
}

export default AddressModal