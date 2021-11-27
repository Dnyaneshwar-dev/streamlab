import React from 'react'
import Navbar from '../Components/Navbar'
import homeIcon from '../images/home.svg'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
const Home = () => {
    return (
        <div>

            <Navbar />
            
            <div className="row w-100 h-100">
                <div className="col-md-6 mt-5 text-center" >
                    <h1 id="home" className="text-center"> Welcome to StreamLab</h1>
                    <br />
                    <h4 id="subtitle" className="text-center">Streamlab helps to let your labs and classes goes online, Try it Now!!</h4 >
                    <br />
                    <button className="text-center btn-lg btn-outline-white btn-primary w-50" onClick={()=>{window.location='/#/create'}}> Get Started <ArrowRightAltIcon></ArrowRightAltIcon></button>
                </div>

                <div className="col-md-4 mt-5 mx-auto w-50">
                    <img src={homeIcon} alt="Code" width="600px" height="300px" />
                </div>
            </div>

        </div>
    )
}

export default Home
