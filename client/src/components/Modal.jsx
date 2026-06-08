import React from "react";
import "./Modal.css";

export default function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
