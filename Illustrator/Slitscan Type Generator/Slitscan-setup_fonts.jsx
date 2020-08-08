// Slitscan Type Generator [setup fonts]
// created by A Nonlethal Jerk
// https://anonlethal-jerk.github.io/
//
// This Script will:
// setup the fonts for use with the Slitscan Generator
// piles letterforms on top of each other, aligned only by width
// also groups the name of the font with paths, so you can manually delete letterforms
//
// v1.0 - 2008-10-19 - for PostTypography request
//      - cut original slitscan script into working part
//
// TO DO - ITALIC VERSION, HORIZONTAL VERSION

// What letters does the user what to do?
var jkLetters = prompt("What letter(s) would you like to do? 'basic' will do all letters and numbers and will take forever.", "L&T");
if (jkLetters == "basic") {
	var jkBasics = new Array("`","1","2","3","4","5","6","7","8","9","0","-","=","q","w","e","r","t","y","u","i","o","p","[","]","\\","a","s","d","f","g","h","j","k","l",";","'","z","x","c","v","b","n","m",",",".","/","~","!","@","#","$","%","^","&","*","(",")","_","+","Q","W","E","R","T","Y","U","I","O","P","{","}","|","A","S","D","F","G","H","J","K","L",":","\"","Z","X","C","V","B","N","M","<",">","?");
} else {
	// TO DO - check for duplicate letters
	var jkBasics = jkLetters.split("");
}

// Cycle through the letters
for (i=0; i<jkBasics.length; i++) {
	jkSlitscan(jkBasics[i] );
}

// Finished text
alert("Thank You! According to Illustrator, you have "+textFonts.length+" fonts installed. Have a nice day!");

// Piles all the fonts, creates outlines, and adds font names
function jkSlitscan(aLetter) {
	// declare and initialize variables
	// TO DO - PC VS. MAC HOME FOLDER LOCATION?
	// TO DO - before making new file... check that the script will do something
	// TO DO - CAN I GET A FILE BROWSER TO SHOW UP?
	// TO DO - SPECIAL CHARACTER ESCAPING
	var jkFile = new File("~/Slitscan-"+aLetter+"-"+textFonts.length+".ai");
	var jkDoc = app.documents.add(DocumentColorSpace.RGB);
//	var jkFonts = new Array();
//	var jkFontNames = new Array();

	// cycle through all the fonts
	if (textFonts.length > 0) {
		for (var k=0; k<textFonts.length; k++) {
			// place the letter in the document
			var jkText = jkDoc.textFrames.add();
			jkText.contents = aLetter;
			jkText.textRange.characterAttributes.size = 300;
			jkText.textRange.characterAttributes.textFont = textFonts[k];

			// check for fonts that don't produce an outlineable letter
			try {
				var jkObj = jkText.createOutline(); // jkObj automatically is a group
			} catch (e) {
				jkText.remove();
			}; // end try create outline

			if (jkObj != undefined) {
				jkObj.name = k;
				// TO DO - 100 NEEDS TO BE A VARIABLE THAT I CAN TRUST BETWEEN SCRIPTS (LET'S SAY SOMEONE MOVES THE PATHS)
				// TO DO - VERSION WHERE LETTERS ARE NOT CENTERED, BUT ALIGNED "LEFT"
				jkObj.left = 100 - (jkObj.width/2.0);
				// error check: make sure there is actually a shape in jkObj
				if (jkObj.compoundPathItems.length <= 0) {
					jkObj.remove();
				} else {
					// jkFonts.push(Array(jkObj, jkObj.width));
					// jkFontNames.push(textFonts[k].name);
					var jkFontName = jkObj.textFrames.add();
					jkFontName.contents = textFonts[k].name;
					jkFontName.left = 500 + (150*(Math.ceil((k+1)/100)));
					jkFontName.top = 900+(((k+1)%100)*-10);
					jkFontName.textRange.characterAttributes.size = 9;
					// TO DO - GET HELVETICA OR OTHER SPECIFIC FONT
					//jkFontName.textRange.characterAttributes.textFont = "Helvetica";
				}; // end if there is a path in the object
			}; // end if object is undefned
		}; // end loop through all fonts
	}; // end if there are fonts

	jkDoc.saveAs(jkFile);
	if (jkLetters == "basic") {
		jkDoc.close();
	};
	jkDoc = null;
};