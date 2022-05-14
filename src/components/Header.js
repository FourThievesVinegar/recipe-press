import React from 'react'
import { HeaderMenu } from './HeaderMenu'
import logo from '../logo.png'
import './Header.css'
import { HeaderControls } from './HeaderControls'

export const AppHeader = () => {
  return (
    <header className="App-header">
      <HeaderMenu />
      <img src={logo} className="App-logo" alt="logo" />
      <HeaderControls />
    </header>
  )
}
