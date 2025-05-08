export default function getVenues({setVenueData}:{setVenueData:Function}) {
     // function to fetch data from API
    const fetchVenues = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_NGROK_AUTH_TOKEN}/get_venues`, {
                // this is the request we're going to send to the url
                method: 'GET',
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const json:VenueJson = await response.json()
                setVenueData(json.all_venues) // json.all_venues is an array of VenueItem
            }
        }
        catch (error) {
            console.log("Error fetching data: ", error)
        }
    } // end fetchVenues

    fetchVenues()
}