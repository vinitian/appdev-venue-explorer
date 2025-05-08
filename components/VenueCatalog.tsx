import { useEffect, useState } from "react"
import { ThemedText } from "./ThemedText"
import { Card, Text, Avatar } from "react-native-paper"
import { Button, FlatList, useWindowDimensions, View } from "react-native"
import venueStyles from "./VenueStyles"
import { useAppContext } from "@/app/(nav)/_layout"
import getVenues from "@/lib/getVenues"
import { router } from "expo-router"

export default function VenueCatalog() {

    // useEffect is for fetching the data while the component is being rendered
    // useState is for storing the state in the component

    // Run this Flask API first: (don't forget to change the ngrok url below after running)
    // https://colab.research.google.com/drive/1J9A6SnOrJ4FzztzGqX1gnN2QGRzC6GQZ#scrollTo=YcXB9FxnO8MR

    const {selectedVenue, setSelectedVenue} = useAppContext() // instead of useState, we use useAppContext() and store it in an object {selectedVenue, setSelectedVenue}
    const [ venueData, setVenueData ] = useState<VenueItem[]>([]) // by default, venueData is an empty array of type VenueItem
    const { height, width } = useWindowDimensions()
    const SM_SCREEN = 576
    const MD_SCREEN = 768
    const numColumns = width < SM_SCREEN ? 1 : width < MD_SCREEN ? 2 : 3
    // const to determine how many columns to display in the screen
    // small screen -> 1 column
    // medium screen -> 2 columns
    // large screen -> 3 columns

    useEffect( () => {
        // call function to fetch data from API
        getVenues({setVenueData: setVenueData}) // left = attribute name , right = the thing we're passing into

    }, []) // [] = this useEffect runs *once* when the component is being rendered 
    
    

    const renderCardData = ( {item}:{item:VenueItem} ) => (
        <Card style={venueStyles.cardItem}>
            <Card.Title title={item.name} subtitle={`${item.dailyrate} Baht`}
                left={(props)=> ( // render Avatar to the left of the Card Title
                    <Avatar.Image 
                        {...props}
                        source={require('@/assets/images/logo.png')}
                    />
                )} />
            <Card.Content>
                <Text variant="bodyMedium">
                    {item.address} {item.district} {item.province} {item.postalcode}
                </Text>
            </Card.Content>
            <Card.Cover source={{ uri: `data:image/jpeg;base64,${item.picture}` }}/>
            <Card.Actions>
                <Button title="Book this Venue" color="#9b59b6"
                    onPress = { ()=>{
                        setSelectedVenue(item._id)
                        // don't want to keep history of navigation, so instead router.push(), we use router.replace()
                        router.replace('/explore')
                    } }/>
            </Card.Actions>
        </Card>
    )

    
    return(
        // <ThemedText>There are {venueData.length} venues.</ThemedText>
        // venueData.forEach(renderCardData)

        <View>
            {   // if venueData is an empty array (length is 0), don't show anything
                // once venueData is fetched, it'll show the cards
                (venueData.length > 0) ? 
                <FlatList
                    data={venueData}
                    keyExtractor={(item) => item._id} // extract data from item id
                    renderItem={renderCardData} // render with this function
                    numColumns={numColumns}
                    key={ numColumns } // re-render when numColumns changes
                    contentContainerStyle={venueStyles.cardContainer}
                    scrollEnabled={false} // in index.tsx, we already have ParallaxScrollView
                />
                : <ThemedText>Venue information is not available.</ThemedText>
            }
        </View>
    )
}