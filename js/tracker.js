(function(window) {
    'use strict';

    var panels = ['.map', '.ridley', '.mbrain', '.skill', '.option'];
    var beam = 0;

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

    window.display_ammo = function(type) {
        var amount = pad(ammo[type], type === 'missile' ? 3 : 2);
        document.querySelectorAll('#'+type+' [class*="digit-"]')
            .forEach(function(digit, i) { digit.className = 'digit-'+amount[i]; });
    };

    // increments Missile, Super, or Power Bomb count
    window.inc_ammo = function(type, amount) {
        ammo[type] += amount;
        if (ammo[type] < 0) ammo[type] = 0;
        if (type === 'missile' && ammo[type] > 995) ammo[type] = 995;
        if (type !== 'missile' && ammo[type] > 95) ammo[type] = 95;
        display_ammo(type);
        ridley_calc();
    };

    // Toggles items on the tracker (besides ammo)
    window.toggle = function(x) {
        items[x] = !items[x];
        document.getElementById(x).className = items[x] ? 'item active' : 'item';

        // put IF statement for beams later...
        beam = get_beam_damage();
        var amount = pad(beam/10, 2); // The 1 digit is always zero, and thus ignored
        document.querySelectorAll('#ridley-beam [class*="digit-"]')
            .forEach(function(digit, i) { digit.className = 'digit-'+amount[i]; });

        ridley_calc();
    };

    function pad(x, n) { return ('' + (1000 + x)).substring(4-n, x.length); }

    // Toggles the Golden Statues
    window.toggle_boss = function(x) {
        bosses[x] = !bosses[x];
        document.getElementById(x).className = bosses[x] ? 'boss defeated' : 'boss';
    };

    // Procedure for clicking the panel buttons in the menu
    window.toggle_panel = function(x) {
        document.querySelectorAll('#menu .button')
            .forEach(function(each) { each.classList.remove('active'); });
        document.querySelectorAll('#panels .panel')
            .forEach(function(each) { each.classList.remove('active'); });

        document.querySelector('#menu '+panels[x]).classList.add('active');
        document.querySelector('#panels '+panels[x]).classList.add('active');
    };

    window.get_beam_damage = function() {
        if (!items.charge) return 0;
        return [
            60, // charge
            90, // charge + ice
            150, // charge + wave
            180, // charge + ice + wave
            120, // charge + spazer
            180, // charge + ice + spazer
            210, // charge + wave + spazer
            300, // charge + ice + wave + spazer
            450, // charge + plasma
            600, // charge + ice + plasma
            750, // charge + wave + plasma
            900, // charge + ice + wave + plasma
        ][
            (items.ice ? 1 : 0) +
            (items.wave ? 2 : 0) +
            (items.spazer || items.plasma ? 4 : 0) +
            (items.plasma ? 4 : 0)
        ];
    };

    window.ridley_calc = function() {
        var no_ammo = !ammo.missile && !ammo.super_missile && !ammo.power_bomb;
        var strategy = 
            no_ammo && !beam ? 'FIND SOME AMMO or CHARGE BEAM, N00B!' :
            no_ammo ? ridley_no_ammo() :
            !beam ? ridley_only_ammo() :
            // charge + ice + wave + plasma
            beam === 900 ?
                !ammo.super_missile ? '20 charge shots.\n\n(9 shots after Ridley turns red.)' :
                ridley_strong_beam_and_supers() :
            beam >= 300 ?
                !ammo.super_missile ? ridley_medium_beam_no_supers() :
                ridley_medium_beam_and_supers() :
            // Weaker than charge + ice + wave + spazer
            ammo.super_missile >= 30 ? ridley_weak_beam_but_enough_supers() :
            ammo.missile + 6*ammo.super_missile >= 180 ? ridley_weak_beam_but_enough_missiles() :
            ammo.missile + 6*ammo.super_missile > 90 ? ridley_weak_beam_missiles_before_red() :
            ridley_weak_beam_missiles_after_red();

        document.getElementById('ridley-strategy').innerHTML = strategy
            .replace(/---/g, '<hr>')
            .replace(/\n/g, '<br>');
    };

    function ridley_no_ammo() {
        var charges = Math.ceil(18000/beam);
        return template('{charges} charge shots.\n\n({red} shots after Ridley turns red.)', {
            charges: charges,
            red: charges - 9000/beam - 1
        });
    }

    function ridley_only_ammo() {
        var max_dmg = 100*ammo.missile + 600*ammo.super_missile + 400*ammo.power_bomb;
        return template(
            'NO CHARGE BEAM!---Maximum damage: {dmg}\n\n' +
            '{less:Not enough ammo to kill Ridley!}' +
            '{enough:Just enough... DON\'T BLOW IT!}' +
            '{more:Extra damage: {extra}\n(That\'s {supers} supers)\n\nYou got this!!}', {
                dmg: max_dmg,
                less: max_dmg < 18000,
                enough: max_dmg === 18000,
                more: { _: max_dmg > 18000,
                    extra: max_dmg - 18000,
                    supers: Math.floor((max_dmg - 18000)/600)
                }
            });
    }

    function ridley_strong_beam_and_supers() {
        var extras = ammo.super_missile > 30 ? ammo.super_missile - 30 :
            ammo.super_missile < 30 && ammo.super_missile % 3 === 1 ? 1 : 0,
            supers = ammo.super_missile - extras;
        return template(
            '20 charge shots.\n\n' +
            '>> OR <<\n\n' +
            '{supers} supers{then_charges:, then {charges} charge shots.\n|. }' +
            'For every 3 misses{beyond: (beyond {extras})}, add 2 charge shots.', {
                supers: ammo.super_missile >= 30 ? 30 : supers,
                then_charges: { _: ammo.super_missile < 30,
                    charges: Math.ceil((18000 - 600*supers)/900)
                },
                beyond: { _: extras,
                    extras: extras
                }
            });
    }

    function ridley_medium_beam_no_supers() {
        return template('{charges} charge shots.\n\n({red} shots after Ridley turns red.)', {
            charges: 18000/beam,
            red: 9000/beam - 1
        });
    }

    function ridley_medium_beam_and_supers() {
        var extras = ammo.super_missile > 30 ? ammo.super_missile - 30 : 0,
            supers = ammo.super_missile,
            charges = Math.ceil((18000 - 600*supers)/beam);
        return template(
            '{few_supers:{charges} charge shots{red: ({charges} shots after Ridley turns red)}, then }{supers} supers.\n\n' +
            'For each miss{beyond: (beyond {extras})}, add {add} charge shot{pl:s}.', {
                few_supers: { _: ammo.super_missile < 30,
                    charges: charges,
                    red: { _: ammo.super_missile < 15,
                        charges: charges - 9000/beam - 1
                    }
                },
                supers: supers,
                beyond: { _: extras,
                    extras: extras
                },
                add: Math.round(6000/beam)/10,
                pl: beam !== 600
            });
    }

    function ridley_weak_beam_but_enough_supers() {
        return template(
            '30 supers.\n\n' +
            'For each miss{beyond: (beyond {extras})}, add 6 missiles or {charges} charge shots.', {
                beyond: { _: ammo.super_missile > 30,
                    extras: ammo.super_missile - 30
                },
                charges: Math.round(6000/beam)/10
            });
    }

    function ridley_weak_beam_but_enough_missiles() {
        return template(
            '{missiles} missiles, then {supers} supers.\n\n' +
            '1 super\n=\n6 missiles\n=\n{charges} charge shots', {
                missiles: 180 - 6*ammo.super_missile,
                supers: ammo.super_missile,
                charges: Math.round(6000/beam)/10
            });
    }

    function ridley_weak_beam_missiles_before_red() {
        var hp = 18000 - 600*ammo.super_missile - 100*ammo.missile,
            pb_dmg = Math.min(hp, 400*ammo.power_bomb),
            use_pb = ammo.power_bomb > 0 && beam < 100;
        hp -= use_pb ? pb_dmg : 0;
        return template(
            '{power_bomb:PB for {hits} hits. ({charges} shots per miss)\n\nThen, }' +
            '{then_charges:{charges} shots.\n\nThen, }use missiles.\n\n' +
            '{table}', {
                power_bomb: { _: use_pb,
                    hits: Math.ceil(pb_dmg/200),
                    charges: Math.round(2000/beam)/10
                },
                then_charges: { _: hp > 0,
                    charges: Math.ceil(hp/beam)
                },
                table: ridley_miss_table()
            });
    }

    function ridley_weak_beam_missiles_after_red() {
        var hp = 9000 - 600*ammo.super_missile - 100*ammo.missile,
            use_pb = ammo.power_bomb > 0 && beam < 100;
        return template(
            'Use {pb:Power Bombs and }charge shots.' +
            '---RED RIDLEY---' +
            '{charges:{charges} shots.\n\n}' +
            'Then, use missiles.\n\n' +
            '{table}', {
                pb: use_pb,
                charges: { _: hp > 0,
                    charges: Math.ceil(hp/beam)
                },
                table: ridley_miss_table()
            });
    }

    function ridley_miss_table() {
        return template(
            'Shots per miss:\n' +
            'super = {super_charges}\n' +
            'missile = {missile_charges}', {
                super_charges: Math.round(6000/beam)/10,
                missile_charges: Math.round(1000/beam)/10
            });
    }

    window.start = function() {
        toggle_panel(1);
        ridley_calc();
    };
}(window));
