(function(window) {
    'use strict';

    window.bosses = {
        kraid: false,
        phantoon: false,
        draygon: false,
        ridley: false
    };

    window.ammo = {
        missile: 0,
        'super-missile': 0,
        'power-bomb': 0,
        get super_missile() { return this['super-missile']; },
        set super_missile(v) { this['super-missile'] = v; },
        get power_bomb() { return this['power-bomb']; },
        set power_bomb(v) { this['power-bomb'] = v; }
    };

    window.items = {
        charge: false,
        ice: false,
        wave: false,
        spazer: false,
        plasma: false,
        varia: false,
        gravity: false,
        morph: false,
        bombs: false,
        'spring-ball': false,
        screw: false,
        'hi-jump': false,
        space: false,
        speed: false
    };
}(window));
