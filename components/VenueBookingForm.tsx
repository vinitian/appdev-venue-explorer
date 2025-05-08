import { ThemedView } from "./ThemedView"
import getVenues from "@/lib/getVenues";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import venueBookStyles from "./VenueBookStyles";
import { useWindowDimensions, TextInput, Button } from "react-native";
import { ThemedText } from "./ThemedText";
import { DatePickerModal } from "react-native-paper-dates";
import { en, registerTranslation } from 'react-native-paper-dates'
import addBooking from "@/lib/addBooking";
import { format } from "date-fns";

export default function VenueBookForm( {preSelectedVenueId} : {preSelectedVenueId:string} ) {

    const { height, width } = useWindowDimensions()
    const SM_SCREEN = 576

    const [ venueData, setVenueData ] = useState<VenueItem[]>([]) // by default, venueData is an empty array of type VenueItem
    const [ venueId, setVenueId ] = useState(preSelectedVenueId)
    
    const [ email, setEmail ] = useState('')
    const [ nameLastname, setNameLastname ] = useState('')
    
    const [ showDatePicker, setShowDatePicker ] = useState(false)
    const [ bookingDate, setBookingDate ] = useState<Date|undefined>(undefined)

    const [ isValidEmail, setIsValidEmail ] = useState(false)
    const [ invalidMsg, setInvalidMsg ] = useState('')

    const [ bookResponse, setBookResponse ] = useState<BookResponseJson|undefined>(undefined)

    useEffect( () => {
        // call function to fetch data from API
        getVenues({setVenueData: setVenueData}) // left = attribute name , right = the thing we're passing into

    }, []) // [] = this useEffect runs *once* when the component is being rendered 
        
    useEffect( () => {
        setVenueId(preSelectedVenueId) 
    }, [preSelectedVenueId]) // if preSelectedVenueId is changed, then re-render VenueBookingForm


    const onDatePickerConfirm = ( params: {date:Date|undefined} ) => {
        setShowDatePicker(false)
        setBookingDate(params.date)
    }

    // for locale="en" in DatePickerModal
    // https://web-ridge.github.io/react-native-paper-dates/docs/intro/#supported
    // if we don't include this it'll have warnings in terminal
    registerTranslation('en', en)

    const validateEmail = (email:string) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email)
    }

    const handleBookingSubmit = () => {
        
        // https://stackoverflow.com/questions/54069253/the-usestate-set-method-is-not-reflecting-a-change-immediately
        // https://dmitripavlutin.com/react-hooks-stale-closures/
        // there's a bug that invalidMsg is not immediately set to the message we want. the blog above calls it stale closures
        // setInvalidMsg('test')
        // console.log(invalidMsg)

        const today = new Date()
        today.setHours(23,59,59)

        if (venueId.trim()==='') {
            setInvalidMsg('Please select venue')
        }
        else if (email.trim()==='' || !isValidEmail) {
            setInvalidMsg('Please enter valid email address')
        }
        else if (nameLastname.trim()==='') {
            setInvalidMsg('Please enter name-lastname')
        }
        else if (!bookingDate || bookingDate===undefined) {
            setInvalidMsg('Please select booking date')
        }
        else if (bookingDate <= today) {
            setInvalidMsg('Booking date must be later than today')
        }
        else {
            setInvalidMsg('')
        }

        // ถ้าใส่ field ไหนผิดก็ควรจะขึ้นตรง console
        // console.log("after checks: ", invalidMsg)

        if (invalidMsg==='') {
            const booking:BookingItem = {
                email: email,
                name_lastname: nameLastname,
                // our API accepts date in dd-MM-yyyy format, so we format it here before sending
                booking_date: (bookingDate!=undefined) ? format(bookingDate, 'dd-MM-yyyy') : ''
            }
            addBooking( { venueId: venueId,
                bookItem: booking,
                setResponse: setBookResponse
            })

            // Reset booking form
            setEmail('')
            setNameLastname('')
            setBookingDate(undefined)
        }

    }



    return (
        // if screen is small, fill form to entire width. if screen is big, then fill only 50% of screen width
        <ThemedView style={{width: (width>SM_SCREEN) ? "50%":"auto"}}>  
            <Picker selectedValue={venueId} onValueChange={(value)=> setVenueId(value)}
                style={venueBookStyles.picker} dropdownIconColor="#4654eb">
                {
                    venueData.map((venueItem) => (
                        <Picker.Item label={venueItem.name} value={venueItem._id}
                        key={venueItem._id} />
                    ))
                }

            </Picker>
            <ThemedText style={venueBookStyles.label}>Email: </ThemedText>
           {/* the keyboard shown will be suitable for entering email e.g. it'll have @ and .com */}
           {/* don't auto-capitalize and don't autocorrect  */}
            <TextInput
                value={email} onChangeText={ (inputText:string) => {
                    setEmail(inputText)
                    setIsValidEmail(validateEmail(inputText))
                } } 
                placeholder="enter email address"
                style={venueBookStyles.input}
                placeholderTextColor={"#999"}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            {
                (email && !isValidEmail) ? 
                <ThemedText style={venueBookStyles.invalidWarn}>Please enter valid email</ThemedText>
                : <ThemedText></ThemedText> // empty i.e. doesn't show anything
            }
            <ThemedText style={venueBookStyles.label}>Name-Lastname: </ThemedText>
            <TextInput
                value={nameLastname} onChangeText={setNameLastname} 
                placeholder="enter name-lastname"
                style={venueBookStyles.input}
                placeholderTextColor={"#999"}
            />
            {/* Button doesn't support styling, so we wrap it inside ThemedView and style that instead */}
            <ThemedView style={{marginVertical:20, width:"50%"}}> 
                <Button title="Select booking date" color="#8d97fc"
                onPress={()=>setShowDatePicker(true)}/>
            </ThemedView>
            {/* can pick only one date at a time*/}
            {/* onDismiss = when we close the modal */}
            {/* onConfirm = when we confirm the date */}
            <DatePickerModal 
                visible={showDatePicker}
                locale="en"
                mode="single" 
                onDismiss={()=>setShowDatePicker(false)} 
                onConfirm={onDatePickerConfirm}
                date={bookingDate}
            />
            <ThemedText>Booking Date: { bookingDate? bookingDate.toDateString() : "None" }</ThemedText>
            <ThemedView style={{marginVertical:20}}> 
                <Button title="Book this venue" color="#4654eb" onPress={handleBookingSubmit}/>
            </ThemedView>
            <ThemedText style={venueBookStyles.invalidWarn}>{invalidMsg}</ThemedText>
            <ThemedText type='subtitle'>
                { (bookResponse!=undefined) ? bookResponse.message :  '' }
            </ThemedText>
        </ThemedView>

    )
}