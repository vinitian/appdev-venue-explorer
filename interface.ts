interface BookingItem {
    booking_date: string,
    email:string,
    name_lastname: string
}

interface VenueItem {
    _id: string,
    name: string,
    address: string,
    district: string,
    province: string,
    postalcode: string,
    tel: string,
    picture: string,
    dailyrate: number,
    bookings: BookingItem[]

}

interface VenueJson {
    all_venues: VenueItem[]
}

interface BookResponseJson {
    message: string
}