import React from 'react';
import './Auditorium.css';
import Navbar from '../Components/Navbar'
import meeting from '../images/schedule.svg'

function Auditorium() {
  return (
    <>
      <Navbar />
      <div className="row w-100 h-100">
      <h2 className="text-center">Schdule New Class</h2>

          <div className="col-md-4 mt-5 mx-auto">
          <form>
            <label>HOST NAME : </label>
            <input type="text" placeholder="Enter Hostname" name="hostname" required />
            <br></br><br></br>
            <label>TITLE OF SESSION : </label>
            <input type="text" placeholder="Enter Session Title" name="title" required />
            <br></br><br></br>
            <button type="submit">Start</button>
            </form>
          </div>
        
        <div className="col-md-4 mt-5 mx-auto">
          <img src={meeting} alt="Code" className="img" />
        </div>
      </div>


    </>
  );
}

export default Auditorium;
