
import React from 'react'
import AppFooter from './Footer'

function Main({children}: {children: React.ReactNode}) {
  return (
    <>
        {children}
        <AppFooter />
    </>
  )
}

export default Main