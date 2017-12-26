// @flow
import * as _ from "lodash";
import * as React from "react";
import {Animated, StyleSheet, Easing} from "react-native";

import type {BaseProps} from "../components/Types";

type Atomic = string | number;
type InterpolationConfigType = {
    inputRange: number[],
    outputRange: Atomic[]
};

type TransformKey = "perspective" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "scale" | "scaleX" | "scaleY" |
    "translateX" | "translateY" | "skewX" | "skewY";

type AnimatedViewProps = BaseProps & {
    animations: {
        [string]: InterpolationConfigType,
        transform?: { [TransformKey]: InterpolationConfigType }[]
    },
    delay: number,
    duration: number,
    easing: number => number,
    children?: React.ChildrenArray<React.Element<*>>
};

type AnimatedViewState = {
    animation: Animated.Value
};

export const simpleInterpolation = (start: Atomic, finish: Atomic): InterpolationConfigType =>
    ({ inputRange: [0, 1], outputRange: [start, finish] });

export const directInverseInterpolation = (): InterpolationConfigType => simpleInterpolation(1, 0);
export const directInterpolation = (): InterpolationConfigType => simpleInterpolation(0, 1);

export class AnimatedView extends React.Component<AnimatedViewProps, AnimatedViewState> {

    static defaultProps = {
        animations: {
            opacity: { inputRange: [0, 1], outputRange: [0, 1] },
            transform: [ { translateY: { inputRange: [0, 1], outputRange: [20, 0] } } ]
        },
        delay: 0,
        duration: 600,
        easing: Easing.inOut(Easing.ease)
    }

    componentWillMount() {
        this.setState({
            animation: new Animated.Value(0)
        });
    }

    componentDidMount() {
        const {delay, easing, duration} = this.props;
        const {animation} = this.state;
        Animated.timing(
            animation,
            {
                toValue: 1,
                duration,
                delay,
                easing,
                useNativeDriver: true
            }
        )
        .start();
    }

    render(): React.Node {
        const {children, animations} = this.props;
        const {animation} = this.state;
        const style = StyleSheet.flatten(this.props.style) || {};
        const newStyle = _.pickBy(style, (value, key) => key !== "transform");
        const animatedStyle = {};
        const transformStyle = { transform: [] };
        _.forEach(animations, (interpolation, prop) => {
            if (prop !== "transform") {
                animatedStyle[prop] = animation.interpolate(interpolation);
            } else {
                interpolation.forEach(transformation => {
                    _.forEach(transformation, (interpolation, key) => {
                        transformStyle.transform.push({ [key]: animation.interpolate(interpolation) });
                    });
                })
            }
        });
        if (style.transform) {
            transformStyle.transform = [...transformStyle.transform, ...style.transform];
        }
        return (
            <Animated.View style={[newStyle, animatedStyle, transformStyle]}>{children}</Animated.View>
        );
    }
}
