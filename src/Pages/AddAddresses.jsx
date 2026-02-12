import React, { useState, useEffect } from 'react'
import LogInAgain from './LogInAgain';
import { useTranslation } from 'react-i18next';

import { useCartAddresses } from '../store/CartStore';
import toast from 'react-hot-toast';

import Swal from 'sweetalert2';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaRegTrashAlt } from "react-icons/fa";

import { z } from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";

import Button from '@mui/material/Button';

function AddAddresses({
    setPopUp,
    setAddAddress,
    setCityNameId,
    cityNameId,
    addressMessage,
    setAddressMessage,
    fetchAddresses
}) {

    const URL = "https://myres.me/chilis-dev/api";
    const token = localStorage.getItem('token');


    const [areaContainer, setAreaContainer] = useState([])
    const addnewadd = useCartAddresses((state) => state.addAddress)
    const addresscontainer = useCartAddresses((state) => state.address)
    const clearAddress = useCartAddresses((state) => state.cleerAddress)


    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const getDisplayName = (item) => {
        return currentLanguage === 'ar' && item.namear ? item.namear : item.name;
    };


    const addAddressSchema = z.object({
        city: z.string().min(1, "City is required"),
        area: z.string().min(1, "Area is required"),
        street: z.string().min(1, "Street is required"),
        building: z.string().min(1, "Building is required"),
        floor: z.string().min(1, "Floor is required"),
        apartment: z.string().min(1, "Apartment is required"),
        name: z.string().min(1, "Address name is required"),
    });

    const { register, handleSubmit,reset,setValue,watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(addAddressSchema),
       mode: "onChange"
    })
    ///////////////////////////////////////
    const handleAddress = async (e) => {
        setPopUp(true)
        setAddAddress(false)
    };


    ///////////////////////////////////////////
    const addNewAddress = async (data) => {
        try {
        
            const Basicurl = `${URL}/profile/address/add?area=${data.area}&street=${data.street}&building=${data.building}&floor=${data.floor}&apt=${data.apartment}&name=${data.name}&lat=20.222222&lng=30.333333&api_token=${token}`;

            await axios.post(Basicurl);

            toast.success(t('Profile.addSuccess'));

            reset();

            setAddAddress(false);
            await fetchAddresses();
            setPopUp(true);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };


    ///////////////////////////////////////////

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
    ////////////////////////////
    const city = watch("city");
    const area = watch("area");
    const addName = watch("name");


    return (

        <div className="overlay" onClick={() => {
            setAddAddress(false)
            setPopUp(true)
        }}>
            <div className="myModal" role="document" onClick={(e) => e.stopPropagation()}>
                <div className="modal_header">
                    <h2>{t('Profile.addAddresses')}</h2>
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

                <form onSubmit={handleSubmit(addNewAddress)}>
                    <div className="modal_body">
                        <p className="lable">{t('Profile.city')}</p>
                        <select
                            className="form_AddAddress"
                            {...register("city")}
                            onChange={(e) => {
                                setValue("city", e.target.value);
                                handeleCity(e.target.value);
                                setValue("area", "");
                            }}
                        >
                            <option value="">{t('Profile.selectCity')}</option>

                            {cityNameId.map((mes) => (
                                <option key={mes.id} value={mes.id}>
                                    {getDisplayName(mes)}
                                </option>
                            ))}
                        </select>
                          {errors.city && <p style ={{color: "red" , fontSize: "15px"}}>{errors.city.message}</p>}
                        <p className="lable">{t('Profile.area')}</p>
                        <select
                            className="form_AddAddress"
                            {...register("area")}
                            disabled={!city}
                        >
                            <option value="">{t('Profile.selectArea')}</option>

                            {areaContainer.map((mes) => (
                                <option key={mes.id} value={mes.id}>
                                    {getDisplayName(mes)}
                                </option>
                            ))}
                        </select>

  {errors.area && <p style ={{color: "red" , fontSize: "15px"}}>{errors.area.message}</p>}
                        <p className="lable">{t('Profile.street')}</p>
                        <input
                            className="form_AddAddress"
                            {...register("street")}
                        />
  {errors.street && <p style ={{color: "red" , fontSize: "15px"}}>{errors.street.message}</p>}
                        <p className="lable">{t('Profile.building')}</p>
                        <input
                            className="form_AddAddress"
                            {...register("building")}
                        />
                          {errors.building && <p style ={{color: "red" , fontSize: "15px"}}>{errors.building.message}</p>}

                        <p className="lable">{t('Profile.floor')}</p>
                        <input
                            className="form_AddAddress"
                            {...register("floor")}
                        />
                          {errors.floor && <p style ={{color: "red" , fontSize: "15px"}}>{errors.floor.message}</p>}

                        <p className="lable">{t('Profile.apartment')}</p>
                        <input
                            className="form_AddAddress"
                            {...register("apartment")}
                        />
                          {errors.apartment && <p style ={{color: "red" , fontSize: "15px"}}>{errors.apartment.message}</p>}
                        <div className="home_work_other">
                            <button
                                type="button"
                                onClick={() => setValue("name", "Home")}
                            >
                                {t('Profile.home')}
                            </button>

                            <button
                                type="button"
                                onClick={() => setValue("name", "Work")}
                            >
                                {t('Profile.work')}
                            </button>

                            <button
                                type="button"
                                onClick={() => setValue("name", "")}
                            >
                                {t('Profile.other')}
                            </button>
                        </div>


                        {!["Home", "Work"].includes(addName) && (
                            <div>
                                <p className="lable">{t('Profile.other')}</p>
                                 <input
                                className="form_AddAddress"
                                {...register("name")}
                            />
                            </div>
                           
                        )}
                        {errors.name && <p style ={{color: "red" , fontSize: "15px"}}>{errors.name.message}</p>}

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
                            {t('Profile.cancel')}
                        </button>

                        <Button
                            type="submit"
                            size="small"
                            disabled={isSubmitting}
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
                            {isSubmitting ? "Loading..." : t('Profile.addAddress')}

                        </Button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default AddAddresses