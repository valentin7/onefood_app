// @flow
import {Asset} from "expo";

export default class Images {
    static login = require("./login.jpg");
    static signUp = require("./signUp.jpg");
    static walkthrough = require("./walkthrough.jpg");
    static walkthrough1 = require("./walkthrough1.jpg");
    static walkthrough2 = require("./walkthrough2.jpg");
    static walkthrough3 = require("./walkthrough3.jpg");
    static walkthrough4 = require("./walkthrough4.jpg");
    static walkthrough5 = require("./walkthrough5.jpg");
    static ingredientes = require("./ingredientes.jpg");
    static botellaNaranja = require("./botellaNaranja.jpg");
    static botellaNegro = require("./botellaNegro.jpg");

    static chaiCompleta = require("./SABORES-ONE-FOOD-A-CHAI.jpg");
    static cocoaCompleta = require("./SABORES-ONE-FOOD-A-COCOA.jpg");
    static frutosCompleta = require("./SABORES-ONE-FOOD-A-FRUTOS-ROJOS.jpg");
    static mixtoCompleta = require("./SABORES-ONE-FOOD-A-MIXTO.jpg");

    static chaiSnack = require("./SABORES-ONE-FOOD-B-CHAI.jpg");
    static cocoaSnack= require("./SABORES-ONE-FOOD-B-COCOA.jpg");
    static frutosSnack = require("./SABORES-ONE-FOOD-B-FRUTOS-ROJOS.jpg");
    static mixtoSnack = require("./SABORES-ONE-FOOD-B-MIXTO.jpg");

    static oneFoodLogo = require("./oneFoodLogo.png");
    static oneFull = require("./oneFull.png");
    static tablaNutricional = require("./tablaNutricional.jpg");
    static markerCirculoAzul = require("./circleMarker.png");

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
            Asset.fromModule(Images.walkthrough1).downloadAsync(),
            Asset.fromModule(Images.walkthrough2).downloadAsync(),
            Asset.fromModule(Images.walkthrough3).downloadAsync(),
            Asset.fromModule(Images.walkthrough4).downloadAsync(),
            Asset.fromModule(Images.walkthrough5).downloadAsync(),
            Asset.fromModule(Images.tablaNutricional).downloadAsync(),
            Asset.fromModule(Images.ingredientes).downloadAsync(),
            Asset.fromModule(Images.oneFoodLogo).downloadAsync(),
            Asset.fromModule(Images.botellaNegro).downloadAsync(),
            Asset.fromModule(Images.botellaNaranja).downloadAsync(),

            Asset.fromModule(Images.chaiCompleta).downloadAsync(),
            Asset.fromModule(Images.cocoaCompleta).downloadAsync(),
            Asset.fromModule(Images.frutosCompleta).downloadAsync(),
            Asset.fromModule(Images.mixtoCompleta).downloadAsync(),
            Asset.fromModule(Images.chaiSnack).downloadAsync(),
            Asset.fromModule(Images.cocoaSnack).downloadAsync(),
            Asset.fromModule(Images.frutosSnack).downloadAsync(),
            Asset.fromModule(Images.mixtoSnack).downloadAsync(),

            Asset.fromModule(Images.profile).downloadAsync(),
            Asset.fromModule(Images.markerCirculoAzul).downloadAsync(),

            Asset.fromModule(Images.defaultAvatar).downloadAsync(),
            Asset.fromModule(Images.avatar1).downloadAsync(),
            Asset.fromModule(Images.avatar2).downloadAsync(),
            Asset.fromModule(Images.avatar3).downloadAsync(),

            Asset.fromModule(Images.music).downloadAsync(),
            Asset.fromModule(Images.oneFull).downloadAsync(),
            Asset.fromModule(Images.architecture).downloadAsync(),
            Asset.fromModule(Images.travel).downloadAsync()
        ];
    }
}
