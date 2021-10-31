import React from 'react';
import './Lobby.css';
import Navbar from '../Components/Navbar'

function Lobby() {
  return (
    <section>
      <Navbar />
      <div className='lobby'>
      <h1 id="center">STREAM LAB</h1>
      </div>
      <div id="center">
        <img src="./images/lobby.jpg" alt=""/>
      </div>

    </section>
     
  );
}

export default Lobby;