import React, { useState } from 'react';
import "./Popup.css"

export default function Popup({ children, isOpen, onClose }) {
  return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content" onClick={e => e.stopPropagation()}>
          {children}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
  );
}