import React, { Component } from "react";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import * as actions from "../../redux-store/actions";
import { StyleSheet, View, ScrollView } from "react-native";
import { StateContext } from "../context";
import Choices from "../options/Choices";

interface Props {
    updateSettings(path:string, value:any): AnyAction;
    settings: any;
};

class ConfigurationBody extends Component<Props> {
    static contextType = StateContext;

    render() {
        const {updateSettings, settings} = this.props;
        const { language, quality } = settings;

        return (
            <ScrollView
                removeClippedSubviews={false}
                contentContainerStyle={styles.scrollInnerContainer}
                style={styles.scrollOuterContainer}
            >
                <View
                    style={styles.container}
                >
                    <Choices
                        title="Language"
                        options={[
                            { title: 'dubs', value: 'dubs' },
                            { title: 'subs', value: 'subs' }
                        ]}
                        onPress={choice => updateSettings("language", choice)}
                        choice={language}
                    />
                    <Choices
                        title="Quality"
                        choice={quality}
                        options={[
                            { title: '1080p', value: 5000000 },
                            { title: '720p', value: 2500000 },
                            { title: '480p', value: 1250000 }
                        ]}
                        onPress={choice => updateSettings("quality", choice)}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    scrollInnerContainer: {
        paddingLeft: 12,
        paddingRight: 12,
        marginBottom: 10
    },
    scrollOuterContainer: {
        paddingBottom: 10
    },
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexWrap: "wrap"
    },
    infiniteScrollingContainer: {
        marginTop: 20,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40
    }
});

const mapDispatchToProps = {
    ...actions
  };
  
  const mapStateToProps = state => ({
    settings: state.settings
  });
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ConfigurationBody);