// @flow
import {Asset} from "expo";

export default class Images {
    static login = require("./login.jpg");
    static signUp = require("./signUp.jpg");
    static walkthrough = require("./walkthrough.jpg");
    static profile = require("./profile.jpg");

    static defaultAvatar = require("./avatars/default-avatar.jpg");
    static avatar1 = require("./avatars/avatar-1.jpg");
    static avatar2 = require("./avatars/avatar-2.jpg");
    static avatar3 = require("./avatars/avatar-3.jpg");

    static music = require("./music.jpg");
    static architecture = require("./architecture.jpg");
    static travel = require("./travel.jpg");

    static downloadAsync(): Promise<*>[] {
        return [
            Asset.fromModule(Images.login).downloadAsync(),
            Asset.fromModule(Images.signUp).downloadAsync(),
            Asset.fromModule(Images.walkthrough).downloadAsync(),
            Asset.fromModule(Images.profile).downloadAsync(),

            Asset.fromModule(Images.defaultAvatar).downloadAsync(),
            Asset.fromModule(Images.avatar1).downloadAsync(),
            Asset.fromModule(Images.avatar2).downloadAsync(),
            Asset.fromModule(Images.avatar3).downloadAsync(),

            Asset.fromModule(Images.music).downloadAsync(),
            Asset.fromModule(Images.architecture).downloadAsync(),
            Asset.fromModule(Images.travel).downloadAsync()
        ];
    }
}
