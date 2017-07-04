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

        var combo = 1; // charge
        if (items.ice) combo += 2;
        if (items.wave) combo += 4;
        if (items.spazer && !items.plasma) combo += 8;
        if (items.plasma) combo += 16;

        switch(combo) {
            case 1: return 60; //charge
            case 3: return 90; //charge + ice
            case 5: return 150; //charge + wave
            case 7: return 180; //charge + ice + wave
            case 9: return 120; //charge + spazer
            case 11: return 180; //charge + ice + spazer
            case 13: return 210; //charge + wave + spazer
            case 15: return 300; //charge + ice + wave + spazer

            case 17: return 450; //charge + plasma
            case 19: return 600; //charge + ice + plasma
            case 21: return 750; //charge + wave + plasma
            case 23: return 900; //charge + ice + wave + plasma

            default: return 0; // No Charge
        }
    };

    // Solve for Ridley! Writes inside the ridley-strategy <div> with best boss fight strategy!
    window.ridley_calc = function() {
        var strategy = '';

        // No ammo?
        if (ammo.missile === 0 && ammo.super_missile === 0 && ammo.power_bomb === 0) {
            if (beam === 0) {
                document.getElementById('ridley-strategy').innerHTML = 'FIND SOME AMMO or CHARGE BEAM, N00B!';
                return;
            }

            var charges = Math.ceil(18000/beam);
            strategy += charges + ' charge shots.<br><br>'
            // Red phase
            strategy += ' (' + (charges - 9000/beam - 1) + ' shots after Ridley turns red)';
            document.getElementById('ridley-strategy').innerHTML = strategy;
            return;
        }

        // No charge beam = Ammo only
        if (beam === 0) {
            strategy = 'NO CHARGE BEAM!<hr>Maxiumum damage: ';
            var max_damage = 100*ammo.missile + 600*ammo.super_missile + 400*ammo.power_bomb;
            strategy += max_damage + '<br><br>';
            if (max_damage < 18000)
                strategy += 'Not enough ammo to kill Ridley!';
            else if (max_damage === 18000)
                strategy += 'Just enough... DON\'T BLOW IT!';
            else
                strategy += 'Extra damage: ' + (max_damage-18000) + '<br>(That\'s '+Math.floor((max_damage-18000)/600)+' supers)<br><br>You got this!!';

            document.getElementById('ridley-strategy').innerHTML = strategy;
            return;
        }

        // Charge+Ice+Wave+Plasma = Beam or Supers
        if (beam === 900) {
            if (ammo.super_missile === 0) {
                document.getElementById('ridley-strategy').innerHTML = '20 charge shots.<br><br>(9 shots after Ridley turns red.)';
                return;
            }

            strategy = '20 charge shots<br><br>>> OR << <br><br>';
            var beyond = '';

            if (ammo.super_missile >= 30) {
                if (ammo.super_missile > 30) {
                    beyond = ' (beyond '+(ammo.super_missile-30)+')';
                }
                strategy += '30 supers. ';
            } else {
                var theOddOne = 0;
                if (ammo.super_missile % 3 === 1) {
                    theOddOne = 1;
                    beyond = ' (beyond 1)';
                }
                var supes = ammo.super_missile - theOddOne;
                strategy += supes + ' supers, then ' + (Math.ceil((18000-600*supes)/900)) + ' charge shots.<br>';
            }
            strategy += 'For every 3 misses' + beyond + ', add 2 charge shots.';
            document.getElementById('ridley-strategy').innerHTML = strategy;
            return;
        }

        // Other plasma combo (or the 4 other beams) = Supers, then beam
        if (beam >= 300) {
            if (ammo.super_missile === 0) {
                document.getElementById('ridley-strategy').innerHTML = (18000/beam) + ' charge shots.<br><br>('+(9000/beam-1)+' shots after Ridley turns red.)';
                return;
            }

            var beyond = '';

            if (ammo.super_missile >= 30) {
                if (ammo.super_missile > 30) {
                    beyond = ' (beyond '+(ammo.super_missile-30)+')';
                }
                strategy += '30 supers.<br><br>';
            } else {
                var supes = ammo.super_missile;
                var charges = Math.ceil((18000-600*supes)/beam);
                strategy += charges + ' charge shots'
                // Red phase
                if (ammo.super_missile < 15) {
                    strategy += ' (' + (charges - 9000/beam - 1) + ' shots after Ridley turns red)';
                }
                strategy += ', then ' + supes + ' supers.<br><br>';
            }

            strategy += 'For each miss' + beyond + ', add '+(Math.round(6000/beam)/10)+' charge shot';
            if (beam !== 600)
                strategy += 's';
            strategy += '.';

            document.getElementById('ridley-strategy').innerHTML = strategy;
            return;
        }

        // any beam combo less than 300 damage
        if (ammo.super_missile >= 30) {
            var beyond = '';
            if (ammo.super_missile > 30) {
                beyond = ' (beyond '+(ammo.super_missile-30)+')';
            }
            strategy += '30 supers.<br><br>';
            strategy += 'For each miss' + beyond + ', add 6 missiles or '+(Math.round(6000/beam)/10)+' charge shots.';
            document.getElementById('ridley-strategy').innerHTML = strategy;
            return;
        }

        // Enough missiles + supers?
        if (ammo.missile + 6*ammo.super_missile >= 180) {
            strategy += (180 - 6*ammo.super_missile) + ' missiles, then ' + ammo.super_missile + ' supers.<br><br>';
            strategy += '1 super<br>=<br>6 missiles<br>=<br>' +(Math.round(6000/beam)/10)+ ' charge shots';
            document.getElementById('ridley-strategy').innerHTML = strategy;
            return;
        }

        // using missiles before Red Phase...
        if (ammo.missile + 6*ammo.super_missile > 90) {
            var hp = 18000 - 600*ammo.super_missile - 100*ammo.missile;
            // Use Power Bombs?
            if (ammo.power_bomb > 0 && beam < 100) {
                var pbdam = Math.min(hp, 400*ammo.power_bomb);
                hp -= pbdam;
                pbdam = Math.ceil(pbdam/200);
                strategy += 'PB for ' + pbdam + ' hits. ('+(Math.round(2000/beam)/10)+' shots per miss)<br><br>Then, ';
            }
            if (hp > 0) {
                strategy += Math.ceil(hp/beam) + ' shots.<br><br>Then, ';
            }
            strategy += 'use missiles.<br><br>'

            strategy += 'Shots per miss:<br>super = ' +(Math.round(6000/beam)/10);
            strategy += '<br>missile = ' +(Math.round(1000/beam)/10);
            document.getElementById('ridley-strategy').innerHTML = strategy;
            return;
        }

        // Start Missiles after Red Phase
        strategy += 'Use ';
        if (ammo.power_bomb > 0 && beam < 100) {
            strategy += 'Power Bombs and ';
        }
        strategy += 'charge shots.<hr>RED RIDLEY<hr>';

        hp = 9000 - 600*ammo.super_missile - 100*ammo.missile;
        if (hp > 0) {
            strategy += Math.ceil(hp/beam) + ' shots.<br><br>';
        }

        strategy += 'Then, use missiles.<br><br>'

        strategy += 'Shots per miss:<br>super = ' +(Math.round(6000/beam)/10);
        strategy += '<br>missile = ' +(Math.round(1000/beam)/10);
        document.getElementById('ridley-strategy').innerHTML = strategy;
    };

    window.start = function() {
        toggle_panel(1);
        ridley_calc();
    };
}(window));
