function displayAmmo(type){
	var amount = ammo[type].value;

	// only missiles go over 100
	if(type === "missile"){
		var hundreds = Math.floor(amount/100);
		document.getElementById("ammo-missile-100").style.backgroundImage = "url(numbers/"+hundreds+".png)";
		amount -= 100*hundreds;		
	}

	var tens = Math.floor(amount/10);
	document.getElementById("ammo-"+type+"-10").style.backgroundImage = "url(numbers/"+tens+".png)";
	amount -= 10*tens;		
	
	document.getElementById("ammo-"+type+"-1").style.backgroundImage = "url(numbers/"+amount+".png)";
}

// increments Missile, Super, or Power Bomb count
function incAmmo(type, amount){
		ammo[type].value += amount;
		if(ammo[type].value < 0)
			ammo[type].value = 0;
		if(type==="missile" && ammo[type].value > 995)
			ammo[type].value = 995;
		if(type!="missile" && ammo[type].value > 95)
			ammo[type].value = 95;
		displayAmmo(type);	
		ridleyCalc();
}

// Toggles items on the tracker (besides ammo)
function toggle(x){
	items[x].value = !items[x].value;
	document.getElementById(x).className = "item " + items[x].value;	

	// put IF statement for beams later...
	beam = getBeamDamage();
	var amount = beam;
	var hundreds = Math.floor(amount/100);
	document.getElementById("ridley-beam-100").style.backgroundImage = "url(numbers/"+hundreds+".png)";
	amount -= 100*hundreds;		
	// (beam damage always ends in 0.
	var tens = amount/10;
	document.getElementById("ridley-beam-10").style.backgroundImage = "url(numbers/"+tens+".png)";
	
	ridleyCalc();
}

// Toggles the Golden Statues
function toggleBoss(x){
	bosses[x] = !bosses[x];
	if(bosses[x])
		document.getElementById(x).className = "true";
	else
		document.getElementById(x).className = "falseBoss";
}

// Procedure for clicking the panel buttons in the middle
function togglePanel(x){
	document.getElementById("button-"+panels[activePanel]).className = "panel-button falseBoss";
	document.getElementById("panel-"+panels[activePanel]).className = "panel inactive";

	document.getElementById("button-"+panels[x]).className = "panel-button true";
	document.getElementById("panel-"+panels[x]).className = "panel active";
	activePanel = x;
}

function getBeamDamage(){
	if(!items.charge.value)
		return 0;

	var combo = 1; //charge
	if(items.ice.value)
		combo += 2; //ice
	if(items.wave.value)
		combo += 4; //wave
	if(items.spazer.value && !items.plasma.value)
		combo += 8; //spazer
	if(items.plasma.value)
		combo += 16; //plasma

	switch(combo){
		case 1:
			return 60;	//charge
		case 3:
			return 90;	//charge + ice
		case 5:
			return 150;	//charge + wave
		case 7:
			return 180;	//charge + ice + wave
		case 9:
			return 120;	//charge + spazer
		case 11:
			return 180;	//charge + ice + spazer
		case 13:
			return 210;	//charge + wave + spazer
		case 15:
			return 300;	//charge + ice + wave + spazer

		case 17:
			return 450;	//charge + plasma
		case 19:
			return 600;	//charge + ice + plasma
		case 21:
			return 750;	//charge + wave + plasma
		case 23:
			return 900;	//charge + ice + wave + plasma
			
		default:
			return 0; 	// No Charge
	}
}

// Solve for Ridley! Writes inside the ridley-strat <div> with best boss fight strategy!
function ridleyCalc(){
	var strategy = "";

	// No ammo?
	if(ammo.missile.value===0 && ammo.supermissile.value===0 && ammo.powerbomb.value===0){
		if(beam===0){
			document.getElementById("ridley-strat").innerHTML = "FIND SOME AMMO or CHARGE BEAM, N00B!";
			return;
		}
		
		var charges = Math.ceil(18000/beam);
		strategy += charges + " charge shots.<br><br>"
		// Red phase
		strategy += " (" + (charges - 9000/beam - 1) + " shots after Ridley turns red)";
		document.getElementById("ridley-strat").innerHTML = strategy;
		return;
	}
	
	// No charge beam = Ammo only
	if(beam===0){
		strategy = "NO CHARGE BEAM!<hr>Maxiumum damage: ";
		var maxDamage = 100*ammo.missile.value + 600*ammo.supermissile.value + 400*ammo.powerbomb.value;
		strategy += maxDamage + "<br><br>";
		if(maxDamage < 18000)
			strategy += "Not enough ammo to kill Ridley!";
		else
			if(maxDamage === 18000)
				strategy += "Just enough... DON'T BLOW IT!";
			else
				strategy += "Extra damage: " + (maxDamage-18000) + "<br>(That's "+Math.floor((maxDamage-18000)/600)+" supers)<br><br>You got this!!";
		
		document.getElementById("ridley-strat").innerHTML = strategy;
		return;
	}

	// Charge+Ice+Wave+Plasma = Beam or Supers
	if(beam===900){
		if(ammo.supermissile.value === 0){
			document.getElementById("ridley-strat").innerHTML = "20 charge shots.<br><br>(9 shots after Ridley turns red.)";
			return;
		}
	
		strategy = "20 charge shots<br><br>>> OR << <br><br>";
		var beyond = "";

		if(ammo.supermissile.value>=30){
			if (ammo.supermissile.value>30)
				beyond = " (beyond "+(ammo.supermissile.value-30)+")";
			strategy += "30 supers. ";
		} else {
			var theOddOne = 0;
			if(ammo.supermissile.value % 3 === 1){
				theOddOne = 1;
				beyond = " (beyond 1)";
			}
			var supes = ammo.supermissile.value - theOddOne;
			strategy += supes + " supers, then " + (Math.ceil((18000-600*supes)/900)) + " charge shots.<br>";
		}
		strategy += "For every 3 misses" + beyond + ", add 2 charge shots.";		
		document.getElementById("ridley-strat").innerHTML = strategy;
		return;
	}

	// Other plasma combo (or the 4 other beams) = Supers, then beam
	if(beam>=300){
		if(ammo.supermissile.value === 0){
			document.getElementById("ridley-strat").innerHTML = (18000/beam) + " charge shots.<br><br>("+(9000/beam-1)+" shots after Ridley turns red.)";
			return;
		}

		var beyond = "";

		if(ammo.supermissile.value>=30){
			if (ammo.supermissile.value>30)
				beyond = " (beyond "+(ammo.supermissile.value-30)+")";
			strategy += "30 supers.<br><br>";
		} else {
			var supes = ammo.supermissile.value;
			var charges = Math.ceil((18000-600*supes)/beam);
			strategy += charges + " charge shots"
		// Red phase
		if(ammo.supermissile.value<15)
			strategy += " (" + (charges - 9000/beam - 1) + " shots after Ridley turns red)";
		strategy += ", then " + supes + " supers.<br><br>";
		}
		
		strategy += "For each miss" + beyond + ", add "+(Math.round(6000/beam)/10)+" charge shot";
		if(beam != 600)
			strategy += "s";
		strategy += ".";
		
		
		document.getElementById("ridley-strat").innerHTML = strategy;
		return;
	}

	// any beam combo less than 300 damage
	if(ammo.supermissile.value>=30){
		var beyond = "";
		if (ammo.supermissile.value>30)
			beyond = " (beyond "+(ammo.supermissile.value-30)+")";
		strategy += "30 supers.<br><br>";
		strategy += "For each miss" + beyond + ", add 6 missiles or "+(Math.round(6000/beam)/10)+" charge shots.";
		document.getElementById("ridley-strat").innerHTML = strategy;
		return;
	}
	
	// Enough missiles + supers?
	if(ammo.missile.value + 6*ammo.supermissile.value >= 180){
		strategy += (180 - 6*ammo.supermissile.value) + " missiles, then " + ammo.supermissile.value + " supers.<br><br>";
		strategy += "1 super<br>=<br>6 missiles<br>=<br>" +(Math.round(6000/beam)/10)+ " charge shots";
		document.getElementById("ridley-strat").innerHTML = strategy;
		return;
	}
	
	// using missiles before Red Phase...
	if(ammo.missile.value + 6*ammo.supermissile.value > 90){
		var hp = 18000 - 600*ammo.supermissile.value - 100*ammo.missile.value;
		// Use Power Bombs?
		if(ammo.powerbomb.value > 0 && beam < 100){
			var pbdam = Math.min(hp, 400*ammo.powerbomb.value);
			hp -= pbdam;
			pbdam = Math.ceil(pbdam/200);
			strategy += "PB for " + pbdam + " hits. ("+(Math.round(2000/beam)/10)+" shots per miss)<br><br>Then, ";
		}
		if(hp > 0){
			strategy += Math.ceil(hp/beam) + " shots.<br><br>Then, ";
		}
		strategy += "use missiles.<br><br>"
		
		strategy += "Shots per miss:<br>super = " +(Math.round(6000/beam)/10);
		strategy += "<br>missile = " +(Math.round(1000/beam)/10);
		document.getElementById("ridley-strat").innerHTML = strategy;
		return;
	}

	// Start Missiles after Red Phase
	strategy += "Use ";
	if(ammo.powerbomb.value > 0 && beam < 100){
		strategy += "Power Bombs and ";
	}
	strategy += "charge shots.<hr>RED RIDLEY<hr>";

	
	hp = 9000 - 600*ammo.supermissile.value - 100*ammo.missile.value;
	if(hp > 0){
		strategy += Math.ceil(hp/beam) + " shots.<br><br>";
	}

	strategy += "Then, use missiles.<br><br>"
	
	strategy += "Shots per miss:<br>super = " +(Math.round(6000/beam)/10);
	strategy += "<br>missile = " +(Math.round(1000/beam)/10);
	document.getElementById("ridley-strat").innerHTML = strategy;
}







