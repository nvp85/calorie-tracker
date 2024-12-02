import React, { useState } from 'react';
import "./Popup.css";
import { LuX } from "react-icons/lu";


export default function Popup({ children, onClose }) {
  return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content position-relative" onClick={e => e.stopPropagation()}>
          {children}
          <button onClick={onClose} className='close-btn'><LuX /></button>
        </div>
      </div>
  );
}