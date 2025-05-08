import { StyleSheet } from 'react-native';

const venueStyles = StyleSheet.create( {
    bannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        width: '100%',
        position: 'relative'
    },
    bannerImg: {
        width: '100%',
        height: '100%',
        margin: 0
    },
    bannerTextContainer: {
        width: '80%',
        position: 'absolute'
    },
    bannerTextTitle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold'
    },
    bannerTextSnippet: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    cardContainer: {
        padding: 10
    },
    cardItem: {
        flex: 1,
        margin: 5,
        justifyContent: 'center'
    }
});

export default venueStyles;