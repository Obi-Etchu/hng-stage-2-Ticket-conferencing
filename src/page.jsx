import { useState } from "react";
import "./page.css"; // Import the CSS file
import { useLocalStorage } from 'usehooks-ts'
import { Link } from 'react-router-dom'

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [ticketError, setTicketError] = useState("");
  const [formdata, setFormdata] = useLocalStorage('formdata',{
    name: '',
    email: '',
    file: null, 
    request: '',
  })
  const [tickets, setTickets] = useState(0)
  const [errors, setErrors] = useState({
    email: "",
    username: "",
  });
  const totalSteps = 3;

  const handleSubmit=(e)=>{
    e.preventDefault()
    if (validate()) {
        console.log("Form submitted:", formdata);
        nextStep();
      }
}
  
const handleInput =(e)=>{
    const {name, value} = e.target;
    setFormdata((prevFormData)=>({
        ...prevFormData,
        [name]:value,
    }))
  }

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const validate = () => {
    let newErrors = { email: "", name: "", request: "", file: null, tickets: 0 };
    let isValid = true;

    // Email Validation
    if (!formdata.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formdata.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    // Username Validation
    if (!formdata.name.trim()) {
      newErrors.name = "Username is required.";
      isValid = false;
    } else if (formdata.name.length < 3) {
      newErrors.name = "Username must be at least 3 characters long.";
      isValid = false;
    }

    // Request Validation
    if (!formdata.request.trim()) {
        newErrors.request = "Write Something.";
        isValid = false;
      } else if (formdata.request.length < 3) {
        newErrors.request = "Requests should be longer";
        isValid = false;
      }

      if(tickets===0){
        newErrors.tickets = "Choose a ticket"
        isValid= false;
      }

      // Avatar Validation
    if (!file) {
        newErrors.file = "Photo is required.";
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateTickets = () => {
    if (tickets < 1) {
      setTicketError("You must select at least one ticket.");
      return false;
    }
    setTicketError(""); // Clear error if valid
    return true;
  };
  
  const handleNext = () => {
    if (validateTickets()) {
      nextStep(); // Move to the next step only if valid
    }
  };

//   const handleFileUpload =()=>{

//   }
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="whole">
    <div>
        <div className="header">
          <div style={{display:"flex"}}>
            <p><svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00002 1.5V18.5M1.46402 7.344C1.21602 7.344 0.989018 7.142 1.00002 6.879C1.06702 5.337 1.25502 4.333 1.78002 3.539C2.07948 3.08653 2.45503 2.68933 2.89002 2.365C4.05502 1.5 5.70002 1.5 8.99202 1.5H13.006C16.298 1.5 17.943 1.5 19.11 2.365C19.541 2.685 19.917 3.082 20.219 3.539C20.744 4.333 20.932 5.337 20.999 6.879C21.01 7.142 20.783 7.344 20.534 7.344C19.148 7.344 18.024 8.533 18.024 10C18.024 11.467 19.148 12.656 20.534 12.656C20.783 12.656 21.01 12.858 20.999 13.122C20.932 14.663 20.744 15.667 20.219 16.462C19.9195 16.9141 19.5439 17.311 19.109 17.635C17.943 18.5 16.298 18.5 13.006 18.5H8.99302C5.70102 18.5 4.05602 18.5 2.88902 17.635C2.45438 17.3106 2.07918 16.9134 1.78002 16.461C1.25502 15.667 1.06702 14.663 1.00002 13.121C0.989018 12.858 1.21602 12.656 1.46402 12.656C2.85002 12.656 3.97402 11.467 3.97402 10C3.97402 8.533 2.85002 7.344 1.46402 7.344Z" stroke="white" width="1.5" />
   </svg>
tiez</p>
          </div>
          <ul>
            <Link to={'/'} style={{color:"white"}}>Events</Link>
            <Link to={'/'} style={{color:"white"}}>My Tickets </Link>
            <Link to={'/about'} style={{color:"white"}}>About Project</Link>
          </ul>
        
          <div className="link">
            <Link to={'/'} style={{color:"black"}}><p>My Tickets <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5V3.5ZM17.3536 4.35355C17.5488 4.15829 17.5488 3.84171 17.3536 3.64645L14.1716 0.464466C13.9763 0.269204 13.6597 0.269204 13.4645 0.464466C13.2692 0.659728 13.2692 0.976311 13.4645 1.17157L16.2929 4L13.4645 6.82843C13.2692 7.02369 13.2692 7.34027 13.4645 7.53553C13.6597 7.7308 13.9763 7.7308 14.1716 7.53553L17.3536 4.35355ZM1 4.5L17 4.5V3.5L1 3.5V4.5Z" fill="#0A0C11"/>
</svg>
 </p></Link>
          </div>
        </div>
    <div className="Total">
        
      <div className="Top">
        <div className="step-header">
          {/* Dynamic Header Title */}
          <h2 className="header-title">
            {currentStep === 1 && "Ticket Selection"}
            {currentStep === 2 && "Attendee Details"}
            {currentStep === 3 && "Ready"}
          </h2>
          <h2 className="header-step">
            Step {currentStep} / {totalSteps}
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      
        {/* Step Content */}
        <div className="step-content">
          {currentStep === 1 && (
            <div className="container">
            <div className="one">
              <div className="event-info">
                <h2>
                  <b>Techember Fest '25</b>
                </h2>
                <p>
                  Join us for an unforgettable experience at
                  <br />
                  [EventName] Secure your spot now
                  <br />
                  📍[Event Location] || March, 15 2025 | 7:00pm
                </p>
              </div>
              <br />
              <br />
              <div className="line"></div>
              <br />
              <p className="text">Select Ticket Type:</p>
              <div className="types">
              <div className="grouped">
              <div className="free" onClick={()=>
                setTickets(tickets+1)
              }>
                   <b>Free</b><br></br>
                   <small>REGULAR ACCESS</small><br></br>
                   <small>20/52</small>
              </div>
 
                <div className="VIP" onClick={()=>setTickets(tickets+1)}>
                   <b>$150</b><br></br>
                   <small>VIP ACCESS</small><br></br>
                   <small>20/52</small><br></br>
                 </div>
 
                 <div className="VVIP" onClick={()=>setTickets(tickets+1)}>
                   <b>$150</b><br></br>
                   <small>VVIP ACCESS</small><br></br>
                   <small>20/52</small>
                 </div>    
            </div>
                

              </div>
              <br></br>
              <br></br>
              <label htmlFor="Amount" className="amount">Number of tickets</label>
              <input type="number" value={tickets} required min="1" onChange={(e) => { setTickets(Math.max(1, Number(e.target.value))); 
              setTicketError("");  }}></input>
             {ticketError && <small style={{ color: "red" }}>{ticketError}</small>}
             <br></br>
             <br></br>
              {/* Navigation Buttons */}
              <div className="buttons">
              <button onClick={prevStep} disabled={currentStep === 1} style={{width:"266px", height:"48", backgroundColor:"#052228", border:"2px solid #24A0B5", color:"white"}}>
            Previous
          </button>
          <button onClick={handleNext} disabled={currentStep === totalSteps} style={{width:"266px", height:"48", backgroundColor:"#24A0B5", color:"white"}}>
            Next
          </button>
              </div>
            </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="container2">
            <div className="two">
                <p className="pfp">Upload Profile picture</p>
              <div className="event-info">
              <div className="upload-container">
      <label
        className="upload-box"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input type="file" onChange={handleFileChange} hidden />
        {errors.file && <small style={{ color: "red" }}>{errors.file}</small>}
        {file ? (
          <p>{file.name}</p>
        ) : (
          <>
            <span className="upload-icon">☁️</span>
            <p>Drag & drop or click to upload</p>
          </>
        )}
      </label>
    </div>
              </div>
              <br>
              </br>
              <br>
              </br>
              <div className="line"></div>
              <br />

              <form onSubmit={handleSubmit}>
              <label htmlFor="Username">Enter your name:</label>
              <br />
              <input type="text" id="Username" placeholder="Full Name" value={formdata.name} name="name" onChange={handleInput}/>
              {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
              <br />
              <br />
              <label htmlFor="Email">Enter your email:</label>
              <br />
              <input type="text" id="Email" placeholder="example@email.com" value={formdata.email} name="email" onChange={handleInput}/>
              {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
              <br />
              <br />
              <label htmlFor="description">Special Request?:</label>
              <br />
              <textarea id="description" placeholder="Describe your project..." value={formdata.request} name="request" onChange={handleInput}/>
              {errors.request && <small style={{ color: "red" }}>{errors.request}</small>}
               <br></br>
              {/* Navigation Buttons */}
              <div className="buttons">
                <button onClick={prevStep} style={{width:"266px", height:"48", backgroundColor:"#052228", border:"2px solid #24A0B5", color:"white"}}>Previous</button>
                <button type="submit"  style={{width:"266px", height:"48", backgroundColor:"#24A0B5", color:"white"}}>Get My free Ticket</button>
              </div>
              </form>
            </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="confirmation">
             <div className="circle">
              </div>;

              {/* Navigation Buttons */}
              <div className="buttons">
              <button onClick={prevStep} disabled={currentStep === 1} style={{width:"266px", height:"48", backgroundColor:"#052228", border:"2px solid #24A0B5", color:"white"}} >
            Previous
          </button>
          <button onClick={nextStep} disabled={currentStep === totalSteps} className="next" style={{width:"266px", height:"48", backgroundColor:"#24A0B5", color:"white"}}>
            Next
          </button>
              </div>
            </div>
          )}
        </div>
      
    </div>
</div>
</div>
  );
}
