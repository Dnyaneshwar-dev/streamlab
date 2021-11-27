import React, { useState } from 'react';
import './Auditorium.css';
import Navbar from '../Components/Navbar'
import meeting from '../images/schedule.svg'
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { customRandom, urlAlphabet, nanoid } from 'nanoid';
import axios from 'axios';

function Create() {
  const history = useHistory()
  const [passcode,setPasscode] = useState('')
  const [hostname,setHostname] = useState('')
  const [title,setTitle] = useState('')

  const createRoom = async (e) => {
      e.preventDefault()
      const id = nanoid()
      console.log(id);
      const answer = await axios.post('http://localhost:5000/room',{
          title:title,
          hostname:hostname,
          passcode:passcode,
          roomid:id
      })
      sessionStorage.setItem('hostname', String(hostname))
      history.push(`/host?roomid=${id}&passcode=${passcode}`)
  }
  useEffect(() => {
    
  }, [])
  return (
    <>
      <Navbar />
      <div className="row w-100 h-100">
      <h2 className="text-center">Schedule New Class</h2>

          <div className="col-md-4 mt-5 mx-auto">
          <form method="post">
            <label>HOST NAME : </label>
            <input type="text" placeholder="Enter Hostname" name="hostname" required onChange={
              (e) => {
                setHostname(e.target.value)
              }
          
            }/>
            <label>TITLE OF SESSION : </label>
            <input type="text" placeholder="Enter Session Title" name="title" required 
              onChange={
                (e) => {
                  setTitle(e.target.value)
                }}
            />
            <label>6 DIGIT PASSCODE : </label>
            <input type="password" placeholder="Enter Passcode" name="passcode" required  onChange={(e)=>{
              setPasscode(e.target.value)
      
            }}/>
            <br/><br/>
            <button onClick={createRoom}>Start</button>
            </form>
          </div>
        
        <div className="col-md-4 mt-5 mx-auto">
          <img src={meeting} alt="Code" className="img" />
        </div>
      </div>


    </>
  );
}

export default Create;
