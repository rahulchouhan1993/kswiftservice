import React from 'react'
import a6 from '../../img/a6.png'
import a5 from '../../img/a5.png'
import a4 from '../../img/a4.png'
import a3 from '../../img/a3.png'
import a2 from '../../img/a2.png'
import a1 from '../../img/a1.png'
import { useTranslation } from 'react-i18next';


export default function AboutFeatures() {
   const { t } = useTranslation();

   // Get features from translation, fallback to empty array if issue
   const translatedFeatures = t('about.features.items', { returnObjects: true });
   
   // Hardcoded icons array to map with translations
   const icons = [a1, a2, a3, a4, a5, a6];

   // Merge icons with translated features
   const features = Array.isArray(translatedFeatures) ? translatedFeatures.map((item, index) => ({
      ...item,
      icon: icons[index] || a1 // fallback icon
   })) : [];

  return (
   <div className="mx-auto">
     <section className="relative z-10 py-20">
         <div className="text-center mb-8 "  >
            <h2 className="fading text-white text-3xl lg:text-4xl font-bold mb-2">{t('about.features.title', 'Our Approach')}</h2>
            <p className='fading text-gray-500 mb-8'>{t('about.features.description', 'A System, Not Just an App. Every feature exists to reduce friction:')}</p>
        </div>

        <div className='grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
         {features && features.map((feature, index) => {
            return <React.Fragment key={index}>
               <div className="fading rounded-[20px] !p-[1px] bg-gradient-to-r from-gray-600 to-gray-800">
                  <div className="bg-black h-full rounded-[20px] p-6 text-start">
                     <div className="w-14 h-14 ">
                        <img src={feature.icon} />
                     </div>
                     <h3 className="text-xl text-gray-300 mb-1">{feature.title}</h3>
                     {/* feature.description is not in json structure currently, keeping consistent with original */}
                     {feature.description && <p className="text-gray-400 text-sm">{feature.description}</p>}
                  </div>
               </div>
            </React.Fragment>
         })}
        </div>
    </section>
   </div>
  )
}
