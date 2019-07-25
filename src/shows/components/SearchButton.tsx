
import React from "react";
import {
    View,
    TextInput,
    StyleSheet
} from "react-native";
import { DATA_CONST } from "../../constants";
import Category from "./Category";
import { useStateValue } from "../context";

interface Props {
    selected: boolean;
    onSearch: (query: string) => void;
    onFocus: () => void;
    preferredFocus: boolean;
}

const SearchButton = (props: Props) => {
    const { selected, onSearch, ...other } = props;
    const [state, dispatch] = useStateValue();
    const { searchBarVisible } = state;
    const updateSearchBarVisibility = (visible: boolean) => {
        dispatch({
            type: "UPDATE_SEARCH_BAR_VISIBILITY",
            payload: visible
        });
    };

    return (<View>
        <Category
            key={DATA_CONST.CATEGORIES.SEARCH_CATEGORY}
            icon={DATA_CONST.CATEGORIES.SEARCH_CATEGORY}
            title={"Search"}
            selected={selected}
            onPress={() => updateSearchBarVisibility(true)}
            {...other}
        />{searchBarVisible ? (
            <TextInput
                placeholder="Search"
                onSubmitEditing={({ nativeEvent: { text: query } }) => {
                    onSearch(query)
                }}
                onBlur={() => updateSearchBarVisibility(false)}
                autoFocus={true}
                style={styles.searchBar}
            />) : (<View />)}
    </View>);
};

const styles = StyleSheet.create({
    searchBar: {
        display: "none"
    }
});

export default SearchButton;