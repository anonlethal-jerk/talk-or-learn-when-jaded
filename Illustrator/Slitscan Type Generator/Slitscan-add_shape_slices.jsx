// Slitscan Type Generator [slice fonts]
// created by A Nonlethal Jerk
// https://anonlethal-jerk.github.io/
//
// This Script will:
// go through all group items and delete textframes
// sort the widths
// add the intersecting path for slicing
//
// v1.0 - 2008-10-19 - for PostTypography request
//      - cut original slitscan script into working part


// declare and initialize variables
	var jkDoc = activeDocument;
	var jkFonts = new Array();

	// cycle through all the group items
	if (jkDoc.groupItems.length > 0) {
		for (var k=0; k<jkDoc.groupItems.length; k++) {
			var jkObj = jkDoc.groupItems[k]
			// get rid of any text frames
			jkObj.textFrames.removeAll();
			// get widths for sorting
			jkFonts.push(Array(jkObj, jkObj.width));
		};

		// sort the list of widths from largest [0] to smallest [length]
		// from outer to inner
		jkFonts.sort(sortWidths);

		// declare and initialize variables used for overlay shapes
		var jkBaseIndex = 0;
		var jkBaseSliceWidth = (jkFonts[0][1]/2.0) / jkFonts.length;
		// TO DO - 100 NEEDS TO BE A VARIABLE THAT I CAN TRUST BETWEEN SCRIPTS (LET'S SAY SOMEONE MOVES THE PATHS)
		var jkRunningLeft = 100 - (jkFonts[0][1]/2.0);
		var jkRunningRight= 100 + (jkFonts[0][1]/2.0);


		for (var j=0; j<jkFonts.length; j++) {
			if (jkFonts.length > 1) {  // make sure there is more than one font
				if (j != 0) { // skip the first one???
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
			// TO DO - COLOR CHOICES PROMPT
			jkFillColor.red = Math.ceil(Math.random()*254);
			jkFillColor.green = Math.ceil(Math.random()*254);
			jkFillColor.blue = Math.ceil(Math.random()*254);
			jkPath.fillColor = jkFillColor;
		};
	};
	jkDoc.save();
	jkDoc = null;


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