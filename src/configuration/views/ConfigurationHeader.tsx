import React, { Component } from "react";
import { connect } from "react-redux";
import {
    View,
    Image,
    Text,
    StyleSheet,
    Dimensions
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { debounce } from "lodash";
import { DISPLAY_CONST, DATA_CONST } from "../../constants";
import { StateContext } from "../context";
import { Show } from "../../types";
import { AnyAction } from "redux";
import * as actions from "../../redux-store/actions";
import { Category } from "../components";

let winSize = Dimensions.get("window");

interface Props {
    style: object;
    navigation: any;
}

class ConfigurationHeader extends Component<Props> {
    static contextType = StateContext;
    public static defaultProps = {
        style: {}
    };
    categories = [{ title: "Main", value: "main" }];
    public render() {
        const [state, dispatch] = this.context;
        const { navigation } = this.props;
        const { category = "main" } = state;

        const updateCategory = newCategory => {
            dispatch({
                type: "SET_CATEGORY",
                payload: newCategory
            });
        };

        const goToSettings = () => {
            navigation.dispatch(
                StackActions.push({
                    routeName: "Settings"
                })
            );
        }

        return (
            <View style={{ ...styles.container, ...this.props.style }}>
                <View style={styles.categoryContainer}>
                    {this.categories.map(({ title, value }) => <Category
                        preferredFocus={value === category}
                        key={value}
                        title={title}
                        onFocus={() => { }}
                        onPress={() => updateCategory(value)}
                        selected={value === category}
                    />)}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: "auto",
        width: winSize.width,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        backgroundColor: "rgb(30,30,25)",
        elevation: 2
    },
    descriptionContainer: {
        marginTop: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    categoryContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 10,
        paddingBottom: 5,
    },
    descriptionTextContainer: {
        justifyContent: "flex-start",
        height: DISPLAY_CONST.SHOW_ITEM.ITEM_WIDTH * 0.9,
        paddingLeft: 20,
        paddingRight: 20
    },
    description: {
        opacity: 1,
        color: "white",
        width: winSize.width - (DISPLAY_CONST.SHOW_ITEM.ITEM_HEIGHT * 0.9 + 80),
        fontSize: 12
    },
    title: {
        opacity: 1,
        color: "white",
        fontSize: 22,
        marginBottom: 10,
        marginTop: -2.5
    },
    image: {
        width: DISPLAY_CONST.SHOW_ITEM.ITEM_HEIGHT * 0.9,
        height: DISPLAY_CONST.SHOW_ITEM.ITEM_WIDTH * 0.9
    }
});

const mapDispatchToProps = {
    ...actions
};

const mapStateToProps = state => ({
    shows: state.shows
});

export default ConfigurationHeader;
