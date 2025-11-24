import React from 'react'
import Header from '../common/Header'
import Footer from '../home/Footer'

export default function Layout({children}) {
  return (
    <>
    <Header />
    {children}
    <Footer />
    </>
  )
}
