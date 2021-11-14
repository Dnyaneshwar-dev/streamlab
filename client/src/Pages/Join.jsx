import React from 'react';
import './Auditorium.css';
import Navbar from '../Components/Navbar'
import meeting from '../images/meeting.svg'
import localStorage from 'redux-persist/es/storage';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useState } from 'react'
function Join() {
  const history = useHistory()
  const [passcode, setPasscode] = useState('')
  const [name, setName] = useState('')
  const [roomid, setroomId] = useState('')
  const joinRoom = async (e) => {
    e.preventDefault()
    console.log(name);
    
    history.push(`/join?roomid=${roomid}&passcode=${passcode}`)
    sessionStorage.setItem('name', String(name))
  }
  useEffect(() => {

  }, [])
  return (
    <section>
      <Navbar />

      <div className="row w-100 h-100">
        <h2 className="text-center"> Join Class</h2>

        <div className="col-md-4 mt-5 mx-auto">
          <form method="post">
            <label>Your Name : </label>
            <input type="text" placeholder="Enter Your Name" name="name" required
              onChange={
                (e) => {
                  setName(e.target.value)
                }}
            />
            <br></br><br></br>
            <label>Meeting Code : </label>
            <input type="text" placeholder="Enter Meeting Code" name="roomid" required
              onChange={
                (e) => {
                  setroomId(e.target.value)
                }}
            />
            <br></br><br></br>
            <label> Passcode : </label>
            <input type="text" placeholder="Enter Passcode" name="passcode" required
              onChange={
                (e) => {
                  setPasscode(e.target.value)
                }}
            />
            <br></br><br></br>
            <button onClick={ joinRoom }>Join Now</button>
          </form>
        </div>

        <div className="col-md-4 mt-5 mx-auto">
          <img src={meeting} alt="Code" className="img" id="meet" />
        </div>
      </div>

    </section>
  );
}

export default Join;