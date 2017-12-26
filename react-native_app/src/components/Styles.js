// @flow
import {StyleSheet, Dimensions} from "react-native";

import variables from "../../native-base-theme/variables/commonColor";

const {width} = Dimensions.get("window");
const Styles = StyleSheet.create({
    header: {
        width,
        height: width * 440 / 750
    },
    flexGrow: {
        flex: 1
    },
    center: {
        justifyContent: "center",
        alignItems: "center"
    },
    textCentered: {
        textAlign: "center"
    },
    bg: {
        backgroundColor: "white"
    },
    row: {
        flexDirection: "row"
    },
    whiteBg: {
        backgroundColor: "white"
    },
    whiteText: {
        color: "white"
    },
    grayText: {
        color: variables.listBorderColor
    },
    listItem: {
        flexDirection: "row",
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor,
        marginHorizontal: variables.contentPadding * 2
    },
    form: {
        marginHorizontal: variables.contentPadding * 2
    }
});

export default Styles;