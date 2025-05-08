import { Image, View, Text } from "react-native";
import venueStyles from "./VenueStyles";
import { ThemedView } from "./ThemedView";

export default function Banner() {
    return (
        <ThemedView style={venueStyles.bannerContainer}>
            <Image 
            // The require keyword in TypeScript is used to import modules, JSON files, and other scripts into a TypeScript file. It’s similar to the import statement but follows the CommonJS module syntax, which is native to Node.js environments. (https://www.spguides.com/require-keyword-in-typescript/)
            // With `require`, you can load modules dynamically at runtime, which is useful for handling dependencies between files. (https://www.webdevtutor.net/blog/typescript-using-require)
            source={require('@/assets/images/cover.jpg')}
            style={venueStyles.bannerImg}
            resizeMode="cover"
            />
            <View style={venueStyles.bannerTextContainer}>
                <Text style={venueStyles.bannerTextTitle}>Where every event finds its venue</Text>
                <Text style={venueStyles.bannerTextSnippet}>Finding the perfect venue has never been easier. Whether it's a wedding, corporate event, or private party, we connecting people to the perfect place.</Text>
            </View>
        </ThemedView>
    );
}