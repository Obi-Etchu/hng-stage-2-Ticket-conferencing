/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import "./page.css"; // Import the CSS file
import { useLocalStorage } from 'usehooks-ts'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'




export default function Page() {
  const [currentStep, setCurrentStep] = useLocalStorage('currentStep', 1);
  const [ticketError, setTicketError] = useState("");
  const [formdata, setFormdata] = useLocalStorage('formdata',{
    name: '',
    email: '', 
    request: '',
    file: null,
  })
  const [tickets, setTickets] = useLocalStorage('tickets', 0)
  const [errors, setErrors] = useState({
    email: "",
    name: "",
  });
  const totalSteps = 3;

  const handleBook=()=>{
    setCurrentStep(1)
    setFormdata({
      name: '',
      email: '',
      request: ''
    })
    setTickets(0)
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    if (validate()) {
        console.log("Form submitted:", formdata);
        setErrors("")
        nextStep();
      }
}
  const handleDownload=()=>{
    const ticketContainer = document.querySelector('.box');

    if (ticketContainer) {
      // Ensure the Cloudinary image is loaded
      const imageElement = ticketContainer.querySelector('img');
      if (imageElement) {
        imageElement.onload = () => {
          // Use html2canvas to capture the ticket as an image
          html2canvas(ticketContainer).then((canvas) => {
            // Convert the canvas to a data URL
            const image = canvas.toDataURL('image/png');
  
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = image;
            link.download = 'ticket.png'; // Set the file name
            document.body.appendChild(link);
  
            // Trigger the download
            link.click();
  
            // Clean up
            document.body.removeChild(link);
          });
        };
        // If the image is already loaded, trigger the download immediately
        if (imageElement.complete) {
          imageElement.onload();
        }
      } else {
        console.error('Image element not found');
      }
    } else {
      console.error('Ticket container not found');
    }
  }
const handleInput =(e)=>{
    const {name, value} = e.target;
    setFormdata((prevFormData)=>({
        ...prevFormData,
        [name]:value,
    }))
  }

  const [file, setFile] = useLocalStorage("file", null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("upload_preset", "Ticket");
    data.append("cloud_name", "deoquc5xb");
  
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/deoquc5xb/image/upload", {
        method: "POST",
        body: data,
      });
      const uploadedImageURL = await res.json();
      console.log(uploadedImageURL.url);
  
      // Update formdata with the uploaded image URL
      setFormdata((prevFormData) => ({
        ...prevFormData,
        file: uploadedImageURL.secure_url, // Use secure_url from Cloudinary
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
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
    if (!formdata.file) {
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
          <div style={{display:"flex", alignItems:"center"}}>
          <svg width="41" height="36" viewBox="0 0 41 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="0.5" width="39" height="35" rx="11.5" fill="#052F35"/>
<rect x="1" y="0.5" width="39" height="35" rx="11.5" stroke="#0E464F"/>
<path d="M17.4999 9.5V26.5M10.9639 15.344C10.7159 15.344 10.4889 15.142 10.4999 14.879C10.5669 13.337 10.7549 12.333 11.2799 11.539C11.5794 11.0865 11.9549 10.6893 12.3899 10.365C13.5549 9.5 15.1999 9.5 18.4919 9.5H22.5059C25.7979 9.5 27.4429 9.5 28.6099 10.365C29.0409 10.685 29.4169 11.082 29.7189 11.539C30.2439 12.333 30.4319 13.337 30.4989 14.879C30.5099 15.142 30.2829 15.344 30.0339 15.344C28.6479 15.344 27.5239 16.533 27.5239 18C27.5239 19.467 28.6479 20.656 30.0339 20.656C30.2829 20.656 30.5099 20.858 30.4989 21.122C30.4319 22.663 30.2439 23.667 29.7189 24.462C29.4193 24.9141 29.0438 25.311 28.6089 25.635C27.4429 26.5 25.7979 26.5 22.5059 26.5H18.4929C15.2009 26.5 13.5559 26.5 12.3889 25.635C11.9543 25.3106 11.5791 24.9134 11.2799 24.461C10.7549 23.667 10.5669 22.663 10.4999 21.121C10.4889 20.858 10.7159 20.656 10.9639 20.656C12.3499 20.656 13.4739 19.467 13.4739 18C13.4739 16.533 12.3499 15.344 10.9639 15.344Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          <svg width="47" height="26" viewBox="0 0 47 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="path-1-outside-1_4015_294" maskUnits="userSpaceOnUse" x="-0.5" y="-0.312" width="47" height="26" fill="black">
<rect fill="white" x="-0.5" y="-0.312" width="47" height="26"/>
<path d="M8.572 23.992C8.252 23.992 7.81467 23.8747 7.26 23.64C6.70533 23.384 6.14 23.064 5.564 22.68C4.988 22.2747 4.49733 21.8587 4.092 21.432C3.68667 20.984 3.484 20.5573 3.484 20.152C3.484 19.9173 3.49467 19.672 3.516 19.416C3.53733 19.16 3.56933 18.8293 3.612 18.424C3.65467 17.9973 3.68667 17.432 3.708 16.728C3.72933 16.024 3.74 15.1067 3.74 13.976C3.74 13.5493 3.74 13.1013 3.74 12.632C3.74 12.1627 3.72933 11.672 3.708 11.16H3.132L1.5 9.016L1.724 8.504C2.85467 8.376 3.56933 8.03467 3.868 7.48C4.16667 6.92533 4.316 6.08267 4.316 4.952L4.86 4.76L6.812 6.232C6.812 6.616 6.812 6.98933 6.812 7.352C6.812 7.71467 6.812 8.07733 6.812 8.44H9.532L11.132 10.68L10.908 11.16H6.844C6.844 11.928 6.844 12.664 6.844 13.368C6.844 14.072 6.844 14.744 6.844 15.384C6.844 16.6213 6.82267 17.5707 6.78 18.232C6.75867 18.8933 6.72667 19.384 6.684 19.704C6.64133 20.024 6.62 20.3227 6.62 20.6C6.62 21.0267 6.844 21.24 7.292 21.24C7.676 21.24 8.092 21.144 8.54 20.952C8.988 20.7387 9.404 20.4827 9.788 20.184H10.236L11.74 22.68C11.4413 23.0427 10.972 23.352 10.332 23.608C9.692 23.864 9.10533 23.992 8.572 23.992Z"/>
<path d="M16.1423 6.296L14.0303 4.024V3.704C14.6063 2.936 15.3849 2.264 16.3663 1.688L18.4783 3.896L18.4463 4.28C18.0196 4.57867 17.6143 4.90933 17.2303 5.272C16.8676 5.63467 16.5049 5.976 16.1423 6.296ZM18.9902 24.312C17.6249 23.8 16.5689 23.3413 15.8223 22.936C15.0969 22.5093 14.7343 22.1253 14.7343 21.784C14.7343 21.4853 14.7662 21.0267 14.8302 20.408C14.9156 19.768 14.9583 19.1493 14.9583 18.552V13.976C14.9583 13.4213 14.9796 12.9093 15.0223 12.44C15.0863 11.9493 15.1823 11.5227 15.3103 11.16H14.2543L12.5583 8.984L12.7823 8.44H16.8783L18.7343 10.936C18.4783 11.2773 18.3076 11.704 18.2222 12.216C18.1582 12.728 18.1263 13.3787 18.1263 14.168V18.904C18.1263 19.672 18.0942 20.3547 18.0303 20.952C17.9663 21.528 17.9342 21.9653 17.9342 22.264C17.9342 22.4773 18.0089 22.648 18.1583 22.776C18.3289 22.8827 18.7343 23.1067 19.3743 23.448L18.9902 24.312Z"/>
<path d="M30.5505 19.288L33.2385 21.016C32.8118 22.0187 32.1932 22.7867 31.3825 23.32C30.5932 23.8533 29.6972 24.12 28.6945 24.12C28.0545 24.12 27.3718 23.9813 26.6465 23.704C25.9212 23.4053 25.2385 23.032 24.5985 22.584C23.9585 22.136 23.4252 21.6667 22.9985 21.176C22.5932 20.6853 22.3905 20.2267 22.3905 19.8C22.3905 19.5227 22.3905 19.096 22.3905 18.52C22.4118 17.944 22.4225 17.3467 22.4225 16.728C22.4438 16.088 22.4545 15.5547 22.4545 15.128V12.504C22.4545 11.096 22.8812 10.0293 23.7345 9.304C24.5878 8.55733 25.7292 8.184 27.1585 8.184C27.6065 8.184 28.1292 8.32267 28.7265 8.6C29.3238 8.856 29.9105 9.208 30.4865 9.656C31.0625 10.0827 31.5425 10.5627 31.9265 11.096C32.3105 11.608 32.5025 12.12 32.5025 12.632C32.5025 13.1867 32.4812 13.6773 32.4385 14.104C32.3958 14.5093 32.3425 14.8827 32.2785 15.224L28.9825 14.584C29.1532 13.56 29.2385 12.664 29.2385 11.896C29.2385 11.5333 29.1638 11.288 29.0145 11.16C28.8865 11.032 28.6732 10.968 28.3745 10.968C26.5398 10.968 25.6225 11.8853 25.6225 13.72V16.28C25.6225 17.6453 25.6012 18.648 25.5585 19.288C25.5372 19.9067 25.5265 20.3973 25.5265 20.76C25.5265 20.9947 25.6332 21.176 25.8465 21.304C26.0598 21.432 26.3265 21.496 26.6465 21.496C27.4358 21.496 28.1078 21.336 28.6625 21.016C29.2172 20.6747 29.7185 20.1307 30.1665 19.384L30.5505 19.288Z"/>
<path d="M36.8448 23.672L34.9888 20.888C35.3088 20.3547 35.7568 19.6507 36.3328 18.776C36.9301 17.9013 37.5594 16.9733 38.2208 15.992C38.9034 14.9893 39.5434 14.04 40.1408 13.144C40.7594 12.248 41.2501 11.5227 41.6128 10.968H41.0688C40.0234 10.968 39.1914 11.032 38.5728 11.16C37.9754 11.288 37.4848 11.5227 37.1008 11.864H36.5568L34.6048 8.984L34.8608 8.44H42.6688L44.7488 11.288C44.5568 11.608 44.2581 12.0773 43.8528 12.696C43.4688 13.3147 43.0208 14.0187 42.5088 14.808C42.0181 15.576 41.5061 16.3653 40.9728 17.176C40.4608 17.9653 39.9701 18.712 39.5008 19.416C39.0528 20.0987 38.6901 20.664 38.4128 21.112H38.6048C39.2234 21.1333 40.0021 21.1333 40.9408 21.112C41.9008 21.0693 42.8394 20.9733 43.7568 20.824L45.2928 23.128L45.0368 23.672H36.8448Z"/>
</mask>
<path d="M8.572 23.992C8.252 23.992 7.81467 23.8747 7.26 23.64C6.70533 23.384 6.14 23.064 5.564 22.68C4.988 22.2747 4.49733 21.8587 4.092 21.432C3.68667 20.984 3.484 20.5573 3.484 20.152C3.484 19.9173 3.49467 19.672 3.516 19.416C3.53733 19.16 3.56933 18.8293 3.612 18.424C3.65467 17.9973 3.68667 17.432 3.708 16.728C3.72933 16.024 3.74 15.1067 3.74 13.976C3.74 13.5493 3.74 13.1013 3.74 12.632C3.74 12.1627 3.72933 11.672 3.708 11.16H3.132L1.5 9.016L1.724 8.504C2.85467 8.376 3.56933 8.03467 3.868 7.48C4.16667 6.92533 4.316 6.08267 4.316 4.952L4.86 4.76L6.812 6.232C6.812 6.616 6.812 6.98933 6.812 7.352C6.812 7.71467 6.812 8.07733 6.812 8.44H9.532L11.132 10.68L10.908 11.16H6.844C6.844 11.928 6.844 12.664 6.844 13.368C6.844 14.072 6.844 14.744 6.844 15.384C6.844 16.6213 6.82267 17.5707 6.78 18.232C6.75867 18.8933 6.72667 19.384 6.684 19.704C6.64133 20.024 6.62 20.3227 6.62 20.6C6.62 21.0267 6.844 21.24 7.292 21.24C7.676 21.24 8.092 21.144 8.54 20.952C8.988 20.7387 9.404 20.4827 9.788 20.184H10.236L11.74 22.68C11.4413 23.0427 10.972 23.352 10.332 23.608C9.692 23.864 9.10533 23.992 8.572 23.992Z" fill="#0E464F"/>
<path d="M16.1423 6.296L14.0303 4.024V3.704C14.6063 2.936 15.3849 2.264 16.3663 1.688L18.4783 3.896L18.4463 4.28C18.0196 4.57867 17.6143 4.90933 17.2303 5.272C16.8676 5.63467 16.5049 5.976 16.1423 6.296ZM18.9902 24.312C17.6249 23.8 16.5689 23.3413 15.8223 22.936C15.0969 22.5093 14.7343 22.1253 14.7343 21.784C14.7343 21.4853 14.7662 21.0267 14.8302 20.408C14.9156 19.768 14.9583 19.1493 14.9583 18.552V13.976C14.9583 13.4213 14.9796 12.9093 15.0223 12.44C15.0863 11.9493 15.1823 11.5227 15.3103 11.16H14.2543L12.5583 8.984L12.7823 8.44H16.8783L18.7343 10.936C18.4783 11.2773 18.3076 11.704 18.2222 12.216C18.1582 12.728 18.1263 13.3787 18.1263 14.168V18.904C18.1263 19.672 18.0942 20.3547 18.0303 20.952C17.9663 21.528 17.9342 21.9653 17.9342 22.264C17.9342 22.4773 18.0089 22.648 18.1583 22.776C18.3289 22.8827 18.7343 23.1067 19.3743 23.448L18.9902 24.312Z" fill="#0E464F"/>
<path d="M30.5505 19.288L33.2385 21.016C32.8118 22.0187 32.1932 22.7867 31.3825 23.32C30.5932 23.8533 29.6972 24.12 28.6945 24.12C28.0545 24.12 27.3718 23.9813 26.6465 23.704C25.9212 23.4053 25.2385 23.032 24.5985 22.584C23.9585 22.136 23.4252 21.6667 22.9985 21.176C22.5932 20.6853 22.3905 20.2267 22.3905 19.8C22.3905 19.5227 22.3905 19.096 22.3905 18.52C22.4118 17.944 22.4225 17.3467 22.4225 16.728C22.4438 16.088 22.4545 15.5547 22.4545 15.128V12.504C22.4545 11.096 22.8812 10.0293 23.7345 9.304C24.5878 8.55733 25.7292 8.184 27.1585 8.184C27.6065 8.184 28.1292 8.32267 28.7265 8.6C29.3238 8.856 29.9105 9.208 30.4865 9.656C31.0625 10.0827 31.5425 10.5627 31.9265 11.096C32.3105 11.608 32.5025 12.12 32.5025 12.632C32.5025 13.1867 32.4812 13.6773 32.4385 14.104C32.3958 14.5093 32.3425 14.8827 32.2785 15.224L28.9825 14.584C29.1532 13.56 29.2385 12.664 29.2385 11.896C29.2385 11.5333 29.1638 11.288 29.0145 11.16C28.8865 11.032 28.6732 10.968 28.3745 10.968C26.5398 10.968 25.6225 11.8853 25.6225 13.72V16.28C25.6225 17.6453 25.6012 18.648 25.5585 19.288C25.5372 19.9067 25.5265 20.3973 25.5265 20.76C25.5265 20.9947 25.6332 21.176 25.8465 21.304C26.0598 21.432 26.3265 21.496 26.6465 21.496C27.4358 21.496 28.1078 21.336 28.6625 21.016C29.2172 20.6747 29.7185 20.1307 30.1665 19.384L30.5505 19.288Z" fill="#0E464F"/>
<path d="M36.8448 23.672L34.9888 20.888C35.3088 20.3547 35.7568 19.6507 36.3328 18.776C36.9301 17.9013 37.5594 16.9733 38.2208 15.992C38.9034 14.9893 39.5434 14.04 40.1408 13.144C40.7594 12.248 41.2501 11.5227 41.6128 10.968H41.0688C40.0234 10.968 39.1914 11.032 38.5728 11.16C37.9754 11.288 37.4848 11.5227 37.1008 11.864H36.5568L34.6048 8.984L34.8608 8.44H42.6688L44.7488 11.288C44.5568 11.608 44.2581 12.0773 43.8528 12.696C43.4688 13.3147 43.0208 14.0187 42.5088 14.808C42.0181 15.576 41.5061 16.3653 40.9728 17.176C40.4608 17.9653 39.9701 18.712 39.5008 19.416C39.0528 20.0987 38.6901 20.664 38.4128 21.112H38.6048C39.2234 21.1333 40.0021 21.1333 40.9408 21.112C41.9008 21.0693 42.8394 20.9733 43.7568 20.824L45.2928 23.128L45.0368 23.672H36.8448Z" fill="#0E464F"/>
<path d="M8.572 23.992C8.252 23.992 7.81467 23.8747 7.26 23.64C6.70533 23.384 6.14 23.064 5.564 22.68C4.988 22.2747 4.49733 21.8587 4.092 21.432C3.68667 20.984 3.484 20.5573 3.484 20.152C3.484 19.9173 3.49467 19.672 3.516 19.416C3.53733 19.16 3.56933 18.8293 3.612 18.424C3.65467 17.9973 3.68667 17.432 3.708 16.728C3.72933 16.024 3.74 15.1067 3.74 13.976C3.74 13.5493 3.74 13.1013 3.74 12.632C3.74 12.1627 3.72933 11.672 3.708 11.16H3.132L1.5 9.016L1.724 8.504C2.85467 8.376 3.56933 8.03467 3.868 7.48C4.16667 6.92533 4.316 6.08267 4.316 4.952L4.86 4.76L6.812 6.232C6.812 6.616 6.812 6.98933 6.812 7.352C6.812 7.71467 6.812 8.07733 6.812 8.44H9.532L11.132 10.68L10.908 11.16H6.844C6.844 11.928 6.844 12.664 6.844 13.368C6.844 14.072 6.844 14.744 6.844 15.384C6.844 16.6213 6.82267 17.5707 6.78 18.232C6.75867 18.8933 6.72667 19.384 6.684 19.704C6.64133 20.024 6.62 20.3227 6.62 20.6C6.62 21.0267 6.844 21.24 7.292 21.24C7.676 21.24 8.092 21.144 8.54 20.952C8.988 20.7387 9.404 20.4827 9.788 20.184H10.236L11.74 22.68C11.4413 23.0427 10.972 23.352 10.332 23.608C9.692 23.864 9.10533 23.992 8.572 23.992Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1_4015_294)"/>
<path d="M16.1423 6.296L14.0303 4.024V3.704C14.6063 2.936 15.3849 2.264 16.3663 1.688L18.4783 3.896L18.4463 4.28C18.0196 4.57867 17.6143 4.90933 17.2303 5.272C16.8676 5.63467 16.5049 5.976 16.1423 6.296ZM18.9902 24.312C17.6249 23.8 16.5689 23.3413 15.8223 22.936C15.0969 22.5093 14.7343 22.1253 14.7343 21.784C14.7343 21.4853 14.7662 21.0267 14.8302 20.408C14.9156 19.768 14.9583 19.1493 14.9583 18.552V13.976C14.9583 13.4213 14.9796 12.9093 15.0223 12.44C15.0863 11.9493 15.1823 11.5227 15.3103 11.16H14.2543L12.5583 8.984L12.7823 8.44H16.8783L18.7343 10.936C18.4783 11.2773 18.3076 11.704 18.2222 12.216C18.1582 12.728 18.1263 13.3787 18.1263 14.168V18.904C18.1263 19.672 18.0942 20.3547 18.0303 20.952C17.9663 21.528 17.9342 21.9653 17.9342 22.264C17.9342 22.4773 18.0089 22.648 18.1583 22.776C18.3289 22.8827 18.7343 23.1067 19.3743 23.448L18.9902 24.312Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1_4015_294)"/>
<path d="M30.5505 19.288L33.2385 21.016C32.8118 22.0187 32.1932 22.7867 31.3825 23.32C30.5932 23.8533 29.6972 24.12 28.6945 24.12C28.0545 24.12 27.3718 23.9813 26.6465 23.704C25.9212 23.4053 25.2385 23.032 24.5985 22.584C23.9585 22.136 23.4252 21.6667 22.9985 21.176C22.5932 20.6853 22.3905 20.2267 22.3905 19.8C22.3905 19.5227 22.3905 19.096 22.3905 18.52C22.4118 17.944 22.4225 17.3467 22.4225 16.728C22.4438 16.088 22.4545 15.5547 22.4545 15.128V12.504C22.4545 11.096 22.8812 10.0293 23.7345 9.304C24.5878 8.55733 25.7292 8.184 27.1585 8.184C27.6065 8.184 28.1292 8.32267 28.7265 8.6C29.3238 8.856 29.9105 9.208 30.4865 9.656C31.0625 10.0827 31.5425 10.5627 31.9265 11.096C32.3105 11.608 32.5025 12.12 32.5025 12.632C32.5025 13.1867 32.4812 13.6773 32.4385 14.104C32.3958 14.5093 32.3425 14.8827 32.2785 15.224L28.9825 14.584C29.1532 13.56 29.2385 12.664 29.2385 11.896C29.2385 11.5333 29.1638 11.288 29.0145 11.16C28.8865 11.032 28.6732 10.968 28.3745 10.968C26.5398 10.968 25.6225 11.8853 25.6225 13.72V16.28C25.6225 17.6453 25.6012 18.648 25.5585 19.288C25.5372 19.9067 25.5265 20.3973 25.5265 20.76C25.5265 20.9947 25.6332 21.176 25.8465 21.304C26.0598 21.432 26.3265 21.496 26.6465 21.496C27.4358 21.496 28.1078 21.336 28.6625 21.016C29.2172 20.6747 29.7185 20.1307 30.1665 19.384L30.5505 19.288Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1_4015_294)"/>
<path d="M36.8448 23.672L34.9888 20.888C35.3088 20.3547 35.7568 19.6507 36.3328 18.776C36.9301 17.9013 37.5594 16.9733 38.2208 15.992C38.9034 14.9893 39.5434 14.04 40.1408 13.144C40.7594 12.248 41.2501 11.5227 41.6128 10.968H41.0688C40.0234 10.968 39.1914 11.032 38.5728 11.16C37.9754 11.288 37.4848 11.5227 37.1008 11.864H36.5568L34.6048 8.984L34.8608 8.44H42.6688L44.7488 11.288C44.5568 11.608 44.2581 12.0773 43.8528 12.696C43.4688 13.3147 43.0208 14.0187 42.5088 14.808C42.0181 15.576 41.5061 16.3653 40.9728 17.176C40.4608 17.9653 39.9701 18.712 39.5008 19.416C39.0528 20.0987 38.6901 20.664 38.4128 21.112H38.6048C39.2234 21.1333 40.0021 21.1333 40.9408 21.112C41.9008 21.0693 42.8394 20.9733 43.7568 20.824L45.2928 23.128L45.0368 23.672H36.8448Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1_4015_294)"/>
</svg>

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
                <h2 className="title">
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
            {formdata.file ? (
              <img
                src={formdata.file} // Use formdata.file for the image URL
                alt="Uploaded Profile"
                style={{ width: "140px", height: "140px", borderRadius: "10px", marginTop: "20px" }}
              />
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
              <br></br>
              <div className="line"></div>
              <br />
              <br></br>
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
              <div className="joined">
             <div className="box">
  <div className="corner top-left"></div>
  <div className="corner top-right"></div>
  <div className="corner bottom-left"></div>
  <div className="corner bottom-right"></div>
  <div className="center">
    <div className="details" style={{width:"190px", height:"76px", color:"white"}}>
                  <b>Techember Fest '25</b>
                  <br />
                  <small>📍04 Rumens roads, Ikoyi, Lagos</small>
                  <br></br>
                  <small style={{fontSize:""}}>March, 15 2025 | 7:00pm</small> 
      </div>
      <div className="cloudinary">
      {formdata.file && (
              <img
                src={formdata.file} // Use the Cloudinary URL
                alt="Uploaded Profile"
                style={{ width: "140px", height: "140px", borderRadius: "10px", marginTop:"20px" }}
              />
      )}
      </div>
  <div className="ticket-container">
      <div className="user-info" style={{display:"flex", justifyContent:"space-between"}}>
        <div className="name">
           <small style={{color:"#a0b2b8"}}>Your name</small>
           <br></br>
           <small style={{color:"white"}}>{formdata.name}</small>
        </div>
        <div className="email">
          <small style={{color:"#a0b2b8"}}>Your email</small>
          <br></br>
          <small style={{color:"white"}}>{formdata.email}</small>
        </div>
      </div>
      <hr></hr>
      <br></br>
      <div className="ticket-info" style={{display:"flex", justifyContent:"space-between"}}>
      <div>
      <small style={{color:"#a0b2b8"}}>Type of Ticket</small>
      <p></p>
        </div>
        
        <div>
        <small style={{color:"#a0b2b8"}}>Number of tickets</small>
        <br></br>
        <small style={{color:"white"}}>{tickets}</small>
        </div>
        
      </div>
    <hr></hr>
      <div style={{overflow:"hidden",wordWrap:"break-word",overflowWrap:"break-word"}}>
          <small style={{color:"#a0b2b8", display:"flex",textAlign:"left"}} >special request</small>
          
          <small style={{color:"white"}}>{formdata.request}</small>
          </div>
    </div>
  </div>
  
</div>
<div className="small-box">
  <div className="corner top-left"></div>
  <div className="corner top-right"></div>
  <div className="corner bottom-left"></div>
  <div className="corner bottom-right"></div>
  <div className="center">
  
  </div>
</div>
 </div>
 <br></br>
 <br></br>

              {/* Navigation Buttons */}
              <div className="buttons" style={{ gap:"20px"}}>
              <button onClick={handleBook} disabled={currentStep === 1} style={{width:"266px", height:"48", backgroundColor:"#052228", border:"2px solid #24A0B5", color:"white"}} 
            >
            Book another Ticket
          </button>
          <button onClick={handleDownload} className="next" style={{width:"266px", height:"48", backgroundColor:"#24A0B5", color:"white"}}>
            Download Ticket
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
