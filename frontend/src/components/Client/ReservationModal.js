
import React, { useState } from 'react';
import './ReservationModal.css';

const ReservationModal = ({ availability, onSubmit, onClose }) => {
  const [reservationData, setReservationData] = useState({
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reservationData);
  };

  return (
    <div className="modal-overlay">
      <div className="reservation-modal">
        <h2>Make a Reservation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={reservationData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="start_time"
              value={reservationData.start_time}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="end_time"
              value={reservationData.end_time}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={reservationData.notes}
              onChange={handleChange}
            />
          </div>
          
          <div className="booked-slots">
            <h4>Already Booked:</h4>
            {availability.length > 0 ? (
              availability.map((slot, index) => (
                <div key={index} className="booked-slot">
                  {slot.start_time} - {slot.end_time}
                </div>
              ))
            ) : (
              <p>No bookings for this date</p>
            )}
          </div>
          
          <div className="modal-buttons">
            <button type="submit" className="submit-button">
              Book Now
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;