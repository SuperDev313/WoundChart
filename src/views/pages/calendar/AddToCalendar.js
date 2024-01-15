import React, { useEffect } from 'react';

const AddToCalendarButton = ({ startDate, endDate, timeZone, title, description, location }) => {
    useEffect(() => {
        // Load the AddEvent script dynamically
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdn.addevent.com/libs/atc/1.6.1/atc.min.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
            // Clean up the script when the component unmounts
            document.head.removeChild(script);
        };
    }, []);

    return (
        <div className="addeventatc" title="Add to Calendar">
            Add to Calendar
            <span className="start">{startDate}</span>
            <span className="end">{endDate}</span>
            <span className="timezone">{timeZone}</span>
            <span className="title">{title}</span>
            <span className="description">{description}</span>
            <span className="location">{location}</span>
        </div>
    );
};

export default AddToCalendarButton;

// import React, { useState } from 'react';
// import {
//     Modal,
//     ModalHeader,
//     ModalBody,
//     ModalFooter,
//     Button,
//     Row,
//     Col,
//     Label,
//     Input,
//     InputGroup,
//     InputGroupText,
//     Dropdown,
//     DropdownToggle,
//     DropdownMenu,
//     DropdownItem,
// } from 'reactstrap';

// const AddToCalendarButton = ({ appointment }) => {
//     const [isDropdownOpen, setDropdownOpen] = useState(false);

//     const handleDropdownToggle = () => {
//         setDropdownOpen(!isDropdownOpen);
//     };

//     console.log(appointment);

//     const event = {
//         title: appointment.title,
//         purpose: appointment.purpose,
//         date: appointment.date,
//     };


//     const handleAddToCalendar = (platform, event) => {
//         switch (platform) {
//             case 'Google':
//                 // For Google Calendar, construct a URL with appointment details.
//                 const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.purpose)}&dates=${encodeURIComponent(event.date)}`;
//                 // Open the Google Calendar event creation page.
//                 window.open(googleUrl, '_blank');
//                 break;

//             case 'Outlook':
//                 // For Outlook Calendar, construct a URL with appointment details.
//                 const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(event.purpose)}&start=${encodeURIComponent(event.date)}`;
//                 // Open the Outlook Calendar event creation page.
//                 window.open(outlookUrl, '_blank');
//                 break;

//             case 'Yahoo':
//                 // For Yahoo Calendar, construct a URL with appointment details.
//                 const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(event.title)}&desc=${encodeURIComponent(event.purpose)}&st=${encodeURIComponent(event.date)}`;
//                 // Open the Yahoo Calendar event creation page.
//                 window.open(yahooUrl, '_blank');
//                 break;

//             case 'Apple':
//                 // For Apple Calendar, construct a URL with appointment details using the webcal protocol.
//                 const appleUrl = `webcal://p24-calendarws.icloud.com/ca/subscribe/${encodeURIComponent(event.title)}?details=${encodeURIComponent(event.purpose)}&start=${encodeURIComponent(event.date)}`;
//                 // Open the Apple Calendar event creation page.
//                 window.open(appleUrl, '_blank');
//                 break;

//             default:
//                 console.log(`Unsupported platform: ${platform}`);
//         }
//     };


//     return (
//         <>
//             <Dropdown isOpen={isDropdownOpen} toggle={handleDropdownToggle} direction={'down'}>
//                 <DropdownToggle caret>Dropdown</DropdownToggle>
//                 <DropdownMenu>
//                     <DropdownItem onClick={() => handleAddToCalendar('Apple')}>Apple</DropdownItem>
//                     <DropdownItem onClick={() => handleAddToCalendar('Google')}>Google</DropdownItem>
//                     <DropdownItem onClick={() => handleAddToCalendar('Office365')}>Office 365</DropdownItem>
//                     <DropdownItem onClick={() => handleAddToCalendar('Outlook')}>Outlook</DropdownItem>
//                     <DropdownItem onClick={() => handleAddToCalendar('Outlook.com')}>Outlook.com</DropdownItem>
//                     <DropdownItem onClick={() => handleAddToCalendar('Yahoo')}>Yahoo</DropdownItem>
//                 </DropdownMenu>
//             </Dropdown>
//         </>
//     );
// };

// export default AddToCalendarButton;

