// v1 - 2006 03 26 11:22

function doLetter(aLetter, whichArr, aColorArr) {
	// declare and initialize variables
	var jkDoc = app.documents.add(DocumentColorSpace.RGB);
	var jkFonts = new Array();
	var jkFontNames = new Array();

	// cycle through all the fonts
	if (textFonts.length > 0) {
		for (var k=0; k<whichArr.length; k++) {

			var i = whichArr[k];

			// place the letter in the document
			var jkText = jkDoc.textFrames.add();
			jkText.contents = aLetter;
			jkText.textRange.characterAttributes.size = 300;
			jkText.textRange.characterAttributes.textFont = textFonts[i];

			// check for fonts that don't produce an outlineable letter
			try {
				// jkObj automatically is a group
				var jkObj = jkText.createOutline();
			} catch (e) {
				jkText.remove();
			}
			if (jkObj != undefined) {
				jkObj.name = i;
				jkObj.left = 306 - (jkObj.width/2.0);
				// error check: make sure there is actually a shape in jkObj
				if (jkObj.compoundPathItems.length <= 0) {
					jkObj.remove();
				} else {
					jkFonts.push(Array(jkObj, jkObj.width, aColorArr[k]));
					jkFontNames.push(textFonts[i].name);
					//alert(textFonts[i].name);
				};
				};
		}
		// sort the list of widths from largest [0] to smallest [length]
		// from outer to inner
		jkFonts.sort(sortWidths);

		// declare and initialize variables used for overlay shapes
		var jkBaseIndex = 0;
		var jkBaseSliceWidth = (jkFonts[0][1]/2.0) / jkFonts.length;
		var jkRunningLeft = 306 - (jkFonts[0][1]/2.0);
		var jkRunningRight= 306 + (jkFonts[0][1]/2.0);


		for (var j=0; j<jkFonts.length; j++) {
			// go through all the letters except the last one - why'd I do this again?
			if (jkFonts.length > 1) {
				if (j != 0) {
					jkRunningLeft += jkBaseSliceWidth;
					jkRunningRight -= jkBaseSliceWidth;
					jkBaseSliceWidth = jkFonts[jkBaseIndex][1] / 2.0 / (jkFonts.length - jkBaseIndex);
				}
				// check if the difference between letters is bigger than slice
				if (j < jkFonts.length - 1) {
					if (jkRunningLeft + jkBaseSliceWidth < jkFonts[j+1][0].left) {
						jkBaseSliceWidth = jkFonts[j+1][0].left - jkRunningLeft;
						jkBaseIndex = j+1;
					}
				}
			}

			// add the shape to use the pathfinder with
			var jkPath = jkFonts[j][0].pathItems.add();
			var jkPathTop = jkFonts[j][0].top;
			var jkPathBottom = jkFonts[j][0].top - jkFonts[j][0].height;
			var jkPathLeft = jkFonts[j][0].left;
			var jkPathRight = jkFonts[j][0].left + jkFonts[j][0].width;
			jkPath.setEntirePath(Array(Array(jkRunningLeft, jkDoc.height), Array(jkRunningLeft + jkBaseSliceWidth, jkDoc.height), Array(jkRunningLeft + jkBaseSliceWidth, -500), Array(jkRunningRight - jkBaseSliceWidth, -500), Array(jkRunningRight - jkBaseSliceWidth, jkDoc.height), Array(jkRunningRight, jkDoc.height), Array(jkRunningRight, -600), Array(jkRunningLeft, -600)));
			jkPath.stroked = false;
			jkPath.filled = true;
			jkPath.closed = true;
			var jkFillColor = new RGBColor;
			jkFillColor.red = jkFonts[j][2][0];
			jkFillColor.green = jkFonts[j][2][1];
			jkFillColor.blue = jkFonts[j][2][2];
			jkPath.fillColor = jkFillColor;
		};
	};
	var jkFile = new File("~/_projects/Cranbrook/Second-Year Presentations/Type/"+aLetter+"-"+whichArr.length+".ai");
	jkDoc.saveAs(jkFile);
//	jkDoc.close();
	jkDoc = null;
};

function sortWidths(a,b) {
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

//var jkFakeDoc = documents.add();

function letters(aLetter) {
	var fontArr = new Array ();
	var colorArr = new Array ();
	fontArr.push(500);
	colorArr.push([255,25,125]);
	for (i=0; i<501; i++) {
		fontArr.push(Math.ceil(Math.random()*textFonts.length-1));
		if (fontArr[i+1] == 681) {
			fontArr[i+1] = 682;
		}
		colorArr.push([Math.ceil(Math.random()*254),Math.ceil(Math.random()*254),Math.ceil(Math.random()*254)]);
	}
	doLetter(aLetter, fontArr, colorArr);
}
letters("1");
/*
letters("C");
letters("D");
letters("E");
letters("F");
letters("G");
letters("H");
letters("I");
letters("L");
letters("M");
letters("N");
letters("O");
letters("P");
letters("Q");
letters("R");
letters("S");
letters("T");
letters("U");
letters("V");
letters("W");
letters("X");
letters("Y");
letters("Z");
*/

//alert("Thank You! According to Illustrator, you have "+textFonts.length+" fonts. Have a nice day!");