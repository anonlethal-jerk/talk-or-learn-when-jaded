//
// PHOTOSHOP SCRIPT (File / Scripts / Browse...)
// ONLY USE THIS AS PART OF AN ACTION FOR BATCH WEB PROCESSING
// (well unless your a masochist and want to select this script by hand all the time.
//
// append image dimensions, units, resoultion, & area to a text file: key => value pseudo array
//

// change the units to suit your needs - units.INCHES, units.MM, units.PIXELS
app.preferences.rulerUnits = Units.INCHES;
var docUnits = "in";
var decimals = 1;

function round(value, precision) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}

var docRef = app.activeDocument;
var docWidth = round(docRef.width, decimals);
var docHeight = round(docRef.height, decimals);
var docRez = docRef.resolution;

var listText = "'filename' => "+docRef.name+" , 'width' => "+docWidth+" , 'height' => "+docHeight+" , 'units' => "+docUnits+" , 'resolution' => "+docRez+" , 'area' => "+(docHeight*docWidth);

// you can change the naming scheme here
var textFile = File('~/Desktop/new_images-'+docUnits+'.txt');
textFile.lineFeed = "Unix";

// add line to end of file
textFile.open('a');
textFile.writeln(listText);
textFile.close();

// alert("Yay! Check your desktop.");
