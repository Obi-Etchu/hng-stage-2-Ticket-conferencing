import { useState } from "react";
import "./page.css"; // Import the CSS file
import { useLocalStorage } from 'usehooks-ts'

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [ticketError, setTicketError] = useState("");
  const [formdata, setFormdata] = useLocalStorage('formdata',{
    name: '',
    email: '',
    avatar: '', 
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
          <div>
            <p>tiez</p>
          </div>
          <ul>
            <li>Events</li>
            <li>My Tickets </li>
            <li>About Project</li>
          </ul>
          <div>
            <p>My Tickets</p>
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
              <button onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </button>
          <button onClick={handleNext} disabled={currentStep === totalSteps}>
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
                <button onClick={prevStep}>Previous</button>
                <button type="submit">Get My free Ticket</button>
              </div>
              </form>
            </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="confirmation">
             

              {/* Navigation Buttons */}
              <div className="buttons">
              <button onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </button>
          <button onClick={nextStep} disabled={currentStep === totalSteps} className="next">
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
