import React, { useEffect } from 'react'
import logo from '../../img/swiftlogo.png'
import { Link } from '@inertiajs/react'
import AOS from 'aos';
import 'aos/dist/aos.css';
export default function Header() {
  useEffect(()=>{ 
    AOS.init();
  },[]);

  return (
    <div className=' !fixed top-4 left-0 w-full  !z-[999]'>
      <div className=' container mx-auto w-full '>
        <header className="relative flex justify-between items-center p-3 rounded-[50px] border border-gray-500 backdrop-blur-[5px] ">
          <div className="text-2xl font-bold">
          <img src={logo} alt="KSwift Logo" className="max-w-[100px] w-full ps-4"/>
          </div>
          <div>
          <ul className='flex items-center '>
              <li>
                <Link href="/" className="font-bold text-gray-300 hover:text-white mx-4 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about-us" className="font-bold text-gray-300 hover:text-white mx-4 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact-us" className="font-bold text-gray-300 hover:text-white mx-4 transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="#" className="font-bold text-gray-300 hover:text-white mx-4 transition-colors">Contact</Link>
              </li>
          </ul>
          </div>
          <button className="px-6 py-2 rounded-full  bg-main text-white font-medium   transition-all duration-300  ">
            Contact
          </button>
        </header>
      </div>
    </div>
  )
}
