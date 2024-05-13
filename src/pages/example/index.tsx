import Image from "next/image";
import { Inter } from "next/font/google";
import { FaWhatsapp } from "react-icons/fa";
import { ChangeEvent, SetStateAction, useState } from "react";
import axios from 'axios';
const inter = Inter({ subsets: ["latin"] });
interface ApiResponse {
  message: string;
  results: { phoneNumber: string; status: string }[];
}

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  // State to track sending status



  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber([e.target.value]); // Store phone number as an array
  };
  
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  const sendWhatsappMessage = async () => {
    try {
      if (phoneNumber.length === 0 || !message) {
        alert('Phone number and message are required');
        return;
      }

      setSending(true);

      const cleanedPhoneNumbers = phoneNumber.map(num => num.replace(/\D/g, ''));

      const response = await axios.post<ApiResponse>('http://localhost:3000/api/sendwhatsapp', {
        phoneNumber: cleanedPhoneNumbers,
        message
      });

      console.log('WhatsApp messages sent successfully:', response.data);
      alert('WhatsApp messages sent successfully');

      setPhoneNumber([]);
      setMessage('');
    } catch (error) {
      console.error('Error sending WhatsApp messages:', error);
      alert('Failed to send WhatsApp messages');
    } finally {
      setSending(false);
    }
  };
  const sendToFixedNumber = () => {
    // Provide a specific phone number here
    const fixedPhoneNumber = '+1234567890';
    setPhoneNumber([fixedPhoneNumber]); // Set the phone number as a single-element array
  };
  const [phoneNumberuser, setPhoneNumberuser] = useState('');

  const handleWhatsAppClick = async () => {
    if (!phoneNumber) {
      alert('Please enter a phone number');
      return;
    }

    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Hello`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Open in WhatsApp',
          text: 'Check out this message!',
          url,
        });
      } catch (error) {
        console.error('Error sharing to WhatsApp:', error);
        window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=Hello`, '_blank');
      }
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=Hello`, '_blank');
    }
  };
  const handleMessageClick = async () => {
    if (!phoneNumberuser) {
      alert('Please enter a phone number');
      return;
    }
  
    const cleanedPhoneNumber = phoneNumberuser.replace(/\D/g, ''); // Remove non-numeric characters from the phone number
  
    const messageText = encodeURIComponent('join inside-wrapped'); // Encode message text
  
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanedPhoneNumber}&text=${messageText}`;
  
    // Open the WhatsApp URL
    window.open(whatsappUrl, '_blank');
  
    // Wait for a short delay before redirecting (adjust as needed)
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds (2000 milliseconds)
  
    // Redirect to Twilio phone number URL
    const twilioPhoneNumber = '+14155238886'; // Replace with your Twilio phone number
    const twilioUrl = `https://www.twilio.com/console/phone-numbers/${encodeURIComponent(twilioPhoneNumber)}`;
  
    // Redirect to Twilio phone number URL
    window.location.href = twilioUrl;
  };
  const handleWhatsAppRedirect = () => {
    const twilioPhoneNumber = '+14155238886'; // Replace with your Twilio phone number
    const initialMessage = 'Hello, please save this Twilio number: ' + twilioPhoneNumber;
   
    const messageText = encodeURIComponent('join inside-wrapped'); 
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${twilioPhoneNumber }&text=${messageText}`;
  
    // Open WhatsApp URL to prompt user to start a conversation
    window.open(whatsappUrl, '_blank');
  
    // Display instructions for the user
    alert('Please copy and paste the following message into the chat: ' + initialMessage);
  };
  
  const handlePhoneNumberChangeuser = (event: { target: { value: SetStateAction<string>; }; }) => {
    setPhoneNumberuser(event.target.value);
  };
  return (
    <>
    <div className="p-10 ">
    <h1>twilio demo</h1>

  

     {/* Drawer component */}
     <div className="flex justify-start mt-10">
     <div className="dropdown dropdown-bottom dropdown-start">
  <div tabIndex={0} role="button" className="btn m-1"><FaWhatsapp className="text-4xl text-green-700"/></div>
  <div tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow  rounded-box w-96 bg-gray-200">
    <div>
    <div className="mb-4">
              <label htmlFor="phoneInput" className="block text-gray-800 font-semibold mb-1">
                Phone Number:
              </label>
              <input
                type="tel"
                id="phoneInput"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="messageInput" className="block text-gray-800 font-semibold mb-1">
                Message:
              </label>
              <textarea
                id="messageInput"
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Type your message"
                value={message}
                  onChange={handleMessageChange}
              ></textarea>
            </div>
            <div className=" flex justify-between">
            <button
                  onClick={sendWhatsappMessage}
                  className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
           
            </div>
            <div>
            <div className="mt-20">
      <input
        type="number"
        placeholder="Enter phone number"
        value={phoneNumberuser}
        onChange={handlePhoneNumberChangeuser }
      />
      <FaWhatsapp
        className="text-4xl text-red-700"
        onClick={handleMessageClick}
        style={{ cursor: 'pointer', marginLeft: '10px' }}
      />
    </div>
            </div>
            <FaWhatsapp
        className="text-4xl text-grey-700"
        onClick={handleWhatsAppRedirect }
        style={{ cursor: 'pointer', marginLeft: '10px' }}
      />
          </div>
    </div>
  </div>
</div>
    </div>
    
    </>
  );
}
