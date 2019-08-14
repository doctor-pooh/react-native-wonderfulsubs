import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { CheckBox } from "react-native-elements";
import { Button } from '../../components';
import {isEqual} from 'lodash';

class ButtonWrapper extends Component<any>{
    render() {
        const props = this.props;
        return <Button underlayStyle={{ opacity: 1, backgroundColor: "rgba(192, 135, 48, 0.15)" }} style={{ opacity: 0.5 }} focusChildStyle={{ opacity: 1 }} {...props} />;
    }
}

type Option = {
    title: string,
    value: any
}

interface Props {
    title?: string,
    options: Option[],
    choice?: any,
    onPress?: (choice: any) => void
}

class Choices extends Component<Props> {
    render() {
        const { title, choice, options = [], onPress = () => { } } = this.props;
        const optionRenderer = options.map(option => <CheckBox
            center
            key={option.value}
            title={option.title}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={isEqual(option.value, choice)}
            containerStyle={styles.checkBoxConainer}
            textStyle={styles.checkBoxText}
            onPress={() => onPress(option.value)}
            checkedColor="rgb(192, 135, 48)"
            Component={ButtonWrapper}
        />);
        return (
            <View style={{ flexDirection: "row", width: "100%"}}>
                <View style={styles.titleContainer} >
                    <Text style={styles.textStyle}>{title}</Text>
                </View>
                {optionRenderer}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    checkBoxConainer: {
        top: 3,
        backgroundColor: "transparent",
        borderWidth: 0,
        opacity: 0.75,
        width: 200
    },
    titleContainer: {
        width: 200,
        justifyContent: "center",
        paddingLeft: 20
    },
    checkBoxText: {
        color: "#FFF"
    },
    textStyle: {
        color: "#999",
        fontSize: 16
    }
});

export default Choices;