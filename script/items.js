(function(window) {
    'use strict';

    window.bosses = {
        kraid: false,
        phantoon: false,
        draygon: false,
        ridley: false
    };

    window.ammo = {
        missile: {
            value: 0,
            icon: 'items/missile.png',
            w: 96,
            h: 64,
            x: 0,
            y: 0
        },

        supermissile: {
            value: 0,
            icon: 'items/super.png',
            w: 64,
            h: 64,
            x: 130,
            y: 0
        },

        powerbomb: {
            value: 0,
            icon: 'items/pbomb.png',
            w: 64,
            h: 64,
            x: 224,
            y: 0
        }
    };

    window.items = {
        charge: {
            value: false,
            icon: 'items/charge.png',
            x: 8,
            y: 97
        },

        ice: {
            value: false,
            icon: 'items/ice.png',
            x: 69,
            y: 97
        },

        wave: {
            value: false,
            icon: 'items/wave.png',
            x: 130,
            y: 97
        },

        spazer: {
            value: false,
            icon: 'items/spazer.png',
            x: 191,
            y: 97
        },

        plasma: {
            value: false,
            icon: 'items/plasma.png',
            x: 252,
            y: 97
        },

        varia: {
            value: false,
            icon: 'items/varia.png',
            x: 130,
            y: 149
        },

        gravity: {
            value: false,
            icon: 'items/gravity.png',
            x: 192,
            y: 149
        },

        morph: {
            value: false,
            icon: 'items/morph.png',
            x: 252,
            y: 146
        },

        bombs: {
            value: false,
            icon: 'items/bomb.png',
            x: 130,
            y: 201
        },

        springball: {
            value: false,
            icon: 'items/springball.png',
            x: 190,
            y: 201
        },

        screw: {
            value: false,
            icon: 'items/screw.png',
            x: 250,
            y: 198
        },

        hijump: {
            value: false,
            icon: 'items/hijump.png',
            x: 127,
            y: 253
        },

        space: {
            value: false,
            icon: 'items/space.png',
            x: 190,
            y: 253
        },

        speed: {
            value: false,
            icon: 'items/speed.png',
            x: 250,
            y: 251
        }
    };
}(window));
