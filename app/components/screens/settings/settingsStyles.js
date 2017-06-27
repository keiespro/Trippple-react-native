import {
    StyleSheet,
    PixelRatio,
} from 'react-native';
import colors from '../../../utils/colors';
import { DeviceHeight, DeviceWidth, MagicNumbers } from '../../../utils/DeviceConfig';


const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        alignSelf: 'stretch',
        backgroundColor: colors.outerSpace,
        justifyContent: 'center',
        position: 'relative',
    },
    inner: {
        alignItems: 'stretch',
        backgroundColor: colors.outerSpace,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    blur: {
        alignSelf: 'stretch',
        alignItems: 'center',
        flex: 1,
        paddingTop: 0,
        paddingBottom: 40,
    },
    formHeader: {
        marginTop: 40,
    },
    formHeaderText: {
        color: colors.rollingStone,
        fontFamily: 'omnes',
    },
    formRow: {
        alignItems: 'center',
        alignSelf: 'stretch',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.rollingStone,
        flex: 1,
        flexDirection: 'row',
        paddingTop: 0,
    },
    tallFormRow: {
        alignSelf: 'stretch',
        alignItems: 'center',
        left: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        width: 250,
        height: 220,
    },
    insideSelectable: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
    },
    bioText:{
        alignSelf: 'stretch',
        color: colors.white,
        fontFamily: 'omnes',
        fontSize: 18,
        flexWrap: 'wrap',
        overflow: 'hidden',
        textAlign: 'left',
        height: 50,
    },
    sliderFormRow: {
        paddingLeft: 30,
        paddingRight: 30,
        height: 160,
    },
    picker: {
        alignItems: 'stretch',
        alignSelf: 'flex-end',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 200,
    },
    halfcell: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-around',
        width: DeviceWidth / 2,
    },
    formLabel: {
        flex: 8,
        fontSize: 18,
        fontFamily: 'omnes',
    },
    header: {
        fontSize: 24,
        fontFamily: 'omnes'
    },
    textfield: {
        alignItems: 'stretch',
        color: colors.white,
        flex: 1,
        fontFamily: 'montserrat',
        fontSize: 20,
        textAlign: 'left',
    },
    paddedSpace: {
        paddingHorizontal: MagicNumbers.screenPadding/2
    },
    autogrowTextinput: {
        alignSelf: 'stretch',
        color: colors.white,
        fontSize: MagicNumbers.size18 + 2,
        fontFamily: 'omnes',
        padding: 0,
        width: DeviceWidth - MagicNumbers.screenPadding,
    },
    textareaWrap: {
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.shuttleGray,
        flexWrap: 'wrap',
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: MagicNumbers.screenPadding/2,
        width: DeviceWidth - MagicNumbers.screenPadding,
        height: 70,
    },
});

export default styles
