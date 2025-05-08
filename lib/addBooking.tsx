export default function addBooking({ venueId, bookItem, setResponse } :
    { venueId:string, bookItem:BookingItem, setResponse:Function }) {
    // function to fetch data from API
   const postBooking = async () => {
       try {
           const response = await fetch(`${process.env.EXPO_PUBLIC_NGROK_AUTH_TOKEN}/add_booking`, {
               // this is the request we're going to send to the url
               method: 'POST',
               headers: {
                   'ngrok-skip-browser-warning': 'true',
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                    venue_id: venueId,
                    booking_date: bookItem.booking_date,
                    email: bookItem.email,
                    name_lastname: bookItem.name_lastname
               })
           })
           if(response.ok) {
               const json:BookResponseJson = await response.json()
               setResponse(json)
           }
       }
       catch (error) {
           console.log("Error fetching data: ", error)
       }
   }

   postBooking()
}