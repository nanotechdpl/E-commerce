
//03-02-25
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    return `${day}-${month}-${year}`;
  };


//UTC.03-02-25.
  export function customUTCFormat(dateInput: Date | string): string {
    // Parse the input into a Date object
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date input");
    }
  
    // Extract the UTC year, month, and day
    const year = date.getUTCFullYear() % 100; // Last two digits of the year
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getUTCDate()).padStart(2, "0");
  
    // Format as "UTC.XX-XX-XX"
    return `UTC.${String(year).padStart(2, "0")}-${month}-${day}`;
  }
  //02:05  PM
  export function customUTCTime(dateInput: Date | string): string {
    // Parse the input into a Date object
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date input");
    }
  
    // Extract UTC time components
    const hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  
    // Convert to 12-hour format and determine AM/PM
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = String(hours % 12 || 12).padStart(2, "0");
  
    // Return time in the format HH:MM AM/PM
    return `${formattedHours}:${minutes} ${period}`;
  }
  

  export const formatDate2 = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  export const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    // Time components
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format, 0 should be 12
    
    return `(${hours}:${minutes} ${ampm})`;
  };

   //  02 sep 2024
   export const formatDate3 = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()]; // Get the month name
    const day = date.getDate().toString().padStart(2, '0');
    return `${day} ${month} ${year}`;
  };