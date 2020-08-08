﻿// Slitscan Type Generator
// created by A Nonlethal Jerk
// https://anonlethal-jerk.github.io/
//
// This version:
// does not align the letterforms by the paths' bottom
// randomly colors each letterform
// asks what letters you want to do
//
// v1.1 - 2008-10-19 - Update for PostTypography request
//    Added prompt for letters
// v1.0 - 2006-03-26
//
// TO DO - A VERSION THAT ONLY COMPILES THE LETTERS TOGETHER WITH A LIST OF THE FONT NAMES SO YOU CAN SELECT THE ONES TO THEN
//         APPLY ANOTHER SCRIPT THAT SLICES THEM


// COMMENT NEXT THREE LINES
alert("Thanks for helping! Be patient...");
var jkBasics = new Array("b");
var jkLetters = "JK"

/* UNCOMMENT TO INPUT YOUR OWN LETTERS
var jkLetters = prompt("What letter(s) would you like to do? 'basic' will do all letters and numbers and will take forever.", "L&T");

if (jkLetters == "basic") {
	var jkBasics = new Array("`","1","2","3","4","5","6","7","8","9","0","-","=","q","w","e","r","t","y","u","i","o","p","[","]","\\","a","s","d","f","g","h","j","k","l",";","'","z","x","c","v","b","n","m",",",".","/","~","!","@","#","$","%","^","&","*","(",")","_","+","Q","W","E","R","T","Y","U","I","O","P","{","}","|","A","S","D","F","G","H","J","K","L",":","\"","Z","X","C","V","B","N","M","<",">","?");
} else {
	// TO DO - check for duplicate letters
	var jkBasics = jkLetters.split("");
}
*/
for (i=0; i<jkBasics.length; i++) {
	jkSlitscan(jkBasics[i] );
}

alert("Thank You! According to Illustrator, you have "+textFonts.length+" fonts installed. Have a nice day!");

function jkSlitscan(aLetter) {
	// declare and initialize variables
	// TO DO - PC VS. MAC HOME FOLDER LOCATION?
	// TO DO - before making new file... check that the script will do something
	// TO DO - CAN I GET A FILE BROWSER TO SHOW UP?
	// TO DO - SPECIAL CHARACTER ESCAPING
	var jkFile = new File("~/Slitscan-"+aLetter+"-"+textFonts.length+".ai");
	var jkDoc = app.documents.add(DocumentColorSpace.RGB);
	var jkFonts = new Array();
	var jkFontNames = new Array(); // is this for error-checking????

	// cycle through all the fonts
	if (textFonts.length > 0) {
//		for (var k=0; k<textFonts.length; k++) {
		for (var k=400; k<410; k++) {
			// place the letter in the document
			var jkText = jkDoc.textFrames.add();
			jkText.contents = aLetter;
			jkText.textRange.characterAttributes.size = 300;
			jkText.textRange.characterAttributes.textFont = textFonts[k];

			// check for fonts that don't produce an outlineable letter
			try {
				// jkObj automatically is a group
				var jkObj = jkText.createOutline();
			} catch (e) {
				jkText.remove();
			};
			if (jkObj != undefined) {
				jkObj.name = k;
				jkObj.left = 106 - (jkObj.width/2.0);
// keetra can uncomment next line for vertical alignment
//				jkObj.top = 506 + (jkObj.height/2.0);
				// error check: make sure there is actually a shape in jkObj
				if (jkObj.compoundPathItems.length <= 0) {
					jkObj.remove();
				} else {
					jkFonts.push(Array(jkObj, jkObj.height));
					jkFontNames.push(textFonts[k].name);
					//alert(textFonts[i].name);
				};
			};
		};
		// sort the list of widths from largest [0] to smallest [length]
		// from outer to inner
		jkFonts.sort(sortHeights);

		// declare and initialize variables used for overlay shapes
		var jkBaseIndex = 0;
		var jkBaseSliceHeight = (jkFonts[0][1]/2.0) / jkFonts.length;
		var jkRunningTop = jkFonts[0][0].top;
		var jkRunningBottom= jkRunningTop - jkFonts[0][1];
//                        alert (jkRunningTop+" : "+jkRunningBottom);


		for (var j=0; j<jkFonts.length; j++) {
			if (jkFonts.length > 1) {  // make sure there is more than one font
				if (j != 0) { // skip the first one???
					jkRunningTop -= jkBaseSliceHeight;
					jkRunningBottom += jkBaseSliceHeight;
					jkBaseSliceHeight = jkFonts[jkBaseIndex][1] / 2.0 / (jkFonts.length - jkBaseIndex);
				}
				// check if the difference between letters is bigger than slice
				if (j < jkFonts.length - 1) {
					if (jkRunningTop - jkBaseSliceHeight > jkFonts[j+1][0].top) {
						jkBaseSliceHeight = jkRunningTop - jkFonts[j+1][0].top;
						jkBaseIndex = j+1;
					}
				}
			}

			// add the shape to use the pathfinder with
			var jkPath = jkFonts[j][0].pathItems.add();
//			var jkPathTop = jkFonts[j][0].top;
//			var jkPathBottom = jkFonts[j][0].top - jkFonts[j][0].height;
//			var jkPathLeft = jkFonts[j][0].left;
//			var jkPathRight = jkFonts[j][0].left + jkFonts[j][0].width;
			jkPath.setEntirePath(Array(Array(jkDoc.height, jkRunningTop), Array(jkDoc.height, jkRunningTop - jkBaseSliceHeight), Array(-500, jkRunningTop - jkBaseSliceHeight), Array(-500, jkRunningBottom + jkBaseSliceHeight), Array(jkDoc.height, jkRunningBottom + jkBaseSliceHeight), Array(jkDoc.height, jkRunningBottom), Array(-600, jkRunningBottom), Array(-600, jkRunningTop)));
			jkPath.stroked = false;
			jkPath.filled = true;
			jkPath.closed = true;
			var jkFillColor = new RGBColor;
			// TO DO - COLOR CHOICES PROMPT
			jkFillColor.red = Math.ceil(Math.random()*254);
			jkFillColor.green = Math.ceil(Math.random()*254);
			jkFillColor.blue = Math.ceil(Math.random()*254);
			jkPath.fillColor = jkFillColor;
		};
	};
	jkDoc.saveAs(jkFile);
	if (jkLetters == "basic") {
		jkDoc.close();
	};
	jkDoc = null;
};


function sortHeights(a,b) {
	// Note that each thing we are passed is an array, so we don't compare the things
	// we're passed; instead, we compare their second column
	if (a[1]>b[1]) {
		return -1;
	}
	if (a[1]<b[1]) {
		return 1;
	}
	return 0;
}