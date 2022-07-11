import React from 'react'
import logo from '../logo.png'
import './Header.css'
import { HeaderControls } from './HeaderControls'

export const AppHeader = () => {
  return (
    <header className="App-header">
      <div className="title-container">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="title-font">Recipe Press</h1>
      </div>
      <HeaderControls />
    </header>
  )
}
