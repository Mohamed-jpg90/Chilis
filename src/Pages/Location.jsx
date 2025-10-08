import '../App.css'
import React, { useState } from 'react'
import NaveBare from './NaveBare'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'
import { useTranslation } from 'react-i18next';

const areas = [
  { 
    name: "Hurghada", 
    namear: "الغردقة",
    link: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d443.99103195695534!2d33.822011!3d27.095558000000004!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x144d7fdfa1ad441f%3A0xc40143d93a5d442e!2sSenzo%20Mall%20hurgada!5e0!3m2!1sen!2seg!4v1758119306602!5m2!1sen!2seg" 
  },
  { 
    name: "Cairo Festival City Mall", 
    namear: "مول القاهرة فيستيفال سيتي",
    link: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d110536.94656609789!2d31.407586000000002!3d30.028836!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583dd9f831b247%3A0xa7848c6a8c566be8!2sCairo%20Festival%20City%20Mall!5e0!3m2!1sen!2seg!4v1758121305417!5m2!1sen!2seg" 
  },
  { 
    name: "City Stars Mall", 
    namear: "مول سيتي ستارز",
    link: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6905.449037660384!2d31.347324!3d30.07343!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145815f8139c47a3%3A0xc1744516bae86a18!2sCitystars%20Mall!5e0!3m2!1sen!2seg!4v1758121334366!5m2!1sen!2seg" 
  },
  { 
    name: "El Merghani", 
    namear: "المرغني",
    link: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6904.62432217386!2d31.333449!3d30.085245!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e18d2304f19%3A0x8fa81ade84b7bbfa!2s93%20Kobri%20Al%20Merghani%2C%20Al%20Golf%2C%20Nasr%20City%2C%20Cairo%20Governorate%204451426!5e0!3m2!1sen!2seg!4v1758121379634!5m2!1sen!2seg" 
  },
  { 
    name: "Porto el Sokhna", 
    namear: "بورتو السخنة",
    link: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6948.920835703513!2d32.480484!3d29.444562999999995!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1456f89b2e969467%3A0x9a6a9f192957d3e2!2sCFVJ%2BR5H%2C%20Suez%20Governorate%208127226!5e0!3m2!1sen!2seg!4v1758121416660!5m2!1sen!2seg" 
  },
  { 
    name: "Dandy Mall", 
    namear: "مول داندي",
    link: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6906.1363669648335!2d31.027351!3d30.06358!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14585b0554c9b7a3%3A0xdb3b24f330c6ae90!2sDandy%20Mega%20Mall!5e0!3m2!1sen!2seg!4v1758121703739!5m2!1sen!2seg" 
  },
  { 
    name: "Porto Marina", 
    namear: "بورتو مارينا",
    link: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6852.3606497701885!2d29.004171999999997!3d30.825613000000004!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145fed76ba7c1805%3A0xff6cf35e084b671e!2sR2G3%2B6MV%2C%20Marsa%20Matrouh%20Governorate%205081001!5e0!3m2!1sen!2seg!4v1758121769972!5m2!1sen!2seg" 
  },
  { 
    name: "Gleem", 
    namear: "جليم",
    link: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d27290.1109224892!2d29.959462!3d31.241118000000004!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c526f8375db7%3A0xab53704fcd23647c!2sGlime%20Beach!5e0!3m2!1sen!2seg!4v1758121855651!5m2!1sen!2seg" 
  },
  { 
    name: "Mall of Egypt", 
    namear: "مول أوف إيجيبت",
    link: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6912.471716831713!2d31.015219!3d29.972651!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145851ee0be1eec3%3A0xa5b302adfcac13d1!2sMall%20of%20Egypt!5e0!3m2!1sen!2seg!4v1758121994745!5m2!1sen!2seg" 
  },
  { 
    name: "City Centre Almaza", 
    namear: "سيتي سنتر الماظة",
    link: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6904.940212776287!2d31.364988!3d30.080720000000003!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583df81720ed69%3A0xb597301dcb56aacf!2sCity%20Centre%20Almaza!5e0!3m2!1sen!2seg!4v1758122096329!5m2!1sen!2seg" 
  },
  { 
    name: "The Isle", 
    namear: "ذا آيل",
    link: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6906.697453110733!2d31.073817!3d30.055537!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14585a42f4d61cc9%3A0xdb49779be3815311!2s26th%20of%20July%20Corridor!5e0!3m2!1sen!2seg!4v1758122411911!5m2!1sen!2seg" 
  },
];

function Location() {
  const [selectedArea, setSelectedArea] = useState("Hurghada")
  const [loadMap, setLoadMap] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handeleArea = (name) => {
    setSelectedArea(name)
    setLoadMap(false)
  }

  // Helper function to get display name based on current language
  const getDisplayName = (area) => {
    return currentLanguage === 'ar' && area.namear ? area.namear : area.name;
  };

  return (
    <div className='Page_of_location' dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <NaveBare token={token} />

      <div className="container_of_Location">
        <div className='theEreas'>
          <h2>{t('Location.selectLocation')}</h2>
          {areas.map((area, index) => (
            <div key={index} className='area_item'>
              <label>
                <input
                  type="radio"
                  checked={selectedArea === area.name}
                  value={area.name}
                  onClick={() => handeleArea(area.name)} 
                  className={currentLanguage === 'ar' ? 'ms-2' : 'me-2'}
                />
                {getDisplayName(area)}
              </label>
            </div>
          ))}
        </div>
        
        <div className='map'>
          {selectedArea && (
            <iframe
              src={areas.find(area => area.name === selectedArea)?.link}
              title={getDisplayName(areas.find(area => area.name === selectedArea))}
              style={{ border: 0 }}
              allowFullScreen=""
              loading='lazy'
            ></iframe>
          )}
        </div>
      </div>
    </div>
  )
}

export default Location