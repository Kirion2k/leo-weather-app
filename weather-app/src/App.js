import React, { useState } from 'react';
import axios from 'axios';


function App() {
  const apiCall = 'http://api.openweathermap.org/geo/1.0/direct?q=Palmerston&limit=1&appid=f331c633b4eef1787c1b5f80f96c3bb5';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=$beijing&units=metric&appid=$f331c633b4eef1787c1b5f80f96c3bb5`;
  

  return (
    <div className="App">

    </div>
  );
}

export default App;
