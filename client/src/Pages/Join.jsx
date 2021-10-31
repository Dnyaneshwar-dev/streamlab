import React from 'react';
import './Auditorium.css';
import Navbar from '../Components/Navbar'
import meeting from '../images/meeting.svg'

function Team() {
  return (
    <section>
      <Navbar />

      <div className="row w-100 h-100">
      <h2 className="text-center"> Join Class</h2>

          <div className="col-md-4 mt-5 mx-auto">
          <form>
            <label>Meeting Code : </label>
            <input type="text" placeholder="Enter Meeting Code" name="roomid" required />
            <br></br><br></br>
            <label> Passcode : </label>
            <input type="text" placeholder="Enter Passcode" name="passcode" required />
            <br></br><br></br>
            <button type="submit">Join Now</button>
            </form>
          </div>
        
        <div className="col-md-4 mt-5 mx-auto">
          <img src={meeting} alt="Code" className="img" id="meet" />
        </div>
      </div>

    </section>
  );
}

export default Team;