import React, { useEffect, useState } from "react";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/events/")
      .then(response => setEvents(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Events List</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.name} - {event.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
