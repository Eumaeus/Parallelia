

class CtsUrnError extends Error {
  constructor(message) {
    super(message);
    this.name = "CtsUrnError";
  }
}

class CtsUrn {
  constructor(urnString) {
    //const match = urnString.match(/^urn:([a-z0-9-]{1,31}):([A-Za-z]+):([A-Za-z0-9]+)\.([A-Za-z0-9]+)(\.([A-Za-z0-9]+))?(\.([A-Za-z0-9]+))?:(([A-Za-z0-9]+)(\.[A-Za-z0-9]+)*)?$/i);
  	const match = urnString.match(/^urn:([a-z0-9-]{1,31}):([A-Za-z]+):([A-Za-z0-9]+)\.([A-Za-z0-9]+)(\.([A-Za-z0-9]+))?(\.([A-Za-z0-9]+))?:(([A-Za-z0-9]+)(\.[A-Za-z0-9]+)*(-([A-Za-z0-9]+)(\.[A-Za-z0-9]+)*)?)?$/i);
    if (!match) {
      throw new CtsUrnError(`Invalid URN format: "${urnString}"`);
    }
    this.urnstring = match[0];
    this.nid = match[1].toLowerCase();
    this.nss = match[2];
    this.textgroup = match[3];
    this.work = match[4];
    this.version = match[6];
    this.exemplar = match[8];
    this.passage = match[9];
  }

  toString() {
    return `${this.urnstring}`;
  }

  equals(other) {
  	return this.toString() == other.toString();
  }

  // URN-Manipulations

	/**
	* Removes the passage-component from a URN and returns a new URN
	* 
	* @returns {CtsUrn} 
	* @throws CtsUrnError
	*/
  dropPassage() {
		let components = this.urnstring.split(":").slice(0,4);
		let newUrnString = components.join(':') + ':';
		let newUrn = new CtsUrn(newUrnString)
		return newUrn;
  }

	/**
	* Replaces the passage-component of a CtsUrn with another
	* 
	* @param {String} newPassage - a string representing the new passage (may be a range)
	* @returns {CtsUrn} 
	* @throws CtsUrnError
	*/
	replacePassage(newPassage) {
		let newUrnStr = this.dropPassage().toString();
		let newUrn = new CtsUrn(newUrnStr + newPassage);
		return newUrn;
	}

	/**
	* Returns true if a CtsUrn has a passage-component
	* 
	* @returns {Boolean} 
	* @throws CtsUrnError
	*/
	hasPassage(urn) {
		if (this.passage) return true;
		return false;
	}

	/**
	* Returns the {String} of a passage-component
	* 
	* @returns {String} 
	* @throws CtsUrnError
	*/
	getPassage() {
		if (this.passage) return this.passage;
		return "";
	}

	/**
	* Does the URN identify a range of passages?
	* 
	* @returns {Boolean} 
	* @throws CtsUrnError
	*/
	isRange() {
		return this.passage.includes('-');
	}

	/**
	 * Does the URN cite a text at the work-level (only!)
	 * 
	 * @returns {Boolean} Description
	 * @throws CtsUrnError
	 */
	 isWorkUrn() {
		if (!this.version) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Takes a range-urn and returns a Vector{CtsUrn}
	* identifying the first- and last-citations of the range
	* 
	* @returns Vector{CtsUrn} 
	* @throws CtsUrnError
	*/
	splitRange() {
		if (!this.isRange()) {
	    throw new CtsUrnError(`Not a range-urn: "${this}"`);
	  } else {
	  	var wholeRange = this.passage;
	  	var startPassage = wholeRange.split('-')[0];
	  	var endPassage = wholeRange.split('-')[1];
	  	let urn1 = this.replacePassage(startPassage);
	  	let urn2 = this.replacePassage(endPassage);
	  	return [urn1, urn2];
	  }
	}


	/**
	* Does the URN cite a text at the version-level (only!)
	* 
	* @returns {Boolean} Description
	* @throws CtsUrnError
	*/
	isVersionUrn() {
		if (this.version && !this.exemplar) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Does the URN cite a text at the exemplar-level (only!)
	* 
	* @returns {Boolean} Description
	* @throws CtsUrnError
	*/
	isExemplarUrn(urn) {
		if (this.exemplar) {
			return true;
		} else {
			return false;
		}
	}

  // Intercepts the comparison when compared to a primitive
  [Symbol.toPrimitive](hint) {
    return this.toString(); 
  }

}








/**
 * Takes a range-urn and returns a CtsUrn pointing to the start of the range
 * 
 * @param {CtsUrn} urn - a CtsUrn
 * @returns {CtsUrn} 
 * @throws CtsUrnError
 */
function rangeFrom(urn) {
	return urn.splitRange()[0];
}

/**
 * Takes a range-urn and returns a CtsUrn pointing to the end of the range
 * 
 * @param {CtsUrn} urn - a CtsUrn
 * @returns {CtsUrn} 
 * @throws CtsUrnError
 */
function rangeTo(urn) {
	return urn.splitRange()[1];
}

/**
 * Takes a CtsUrn and returns a CtsUrn identifying only the version-level. Retains citation.
 * 
 * @param {CtsUrn} urn - a CtsUrn at the version- or exemplar-level
 * @returns {CtsUrn} 
 * @throws CtsUrnError
 */
function versionLevelUrn(urn) {
	parts = urn.toString().split(':');		
	bib = parts[3];
	bibParts = bib.split('.');
	if (bibParts.length < 3) {
		throw new CtsUrnError(`URN is only at the work level. No version: "${urn}"`);
	} else {
		newBib = bibParts.slice(0, 3).join('.');
		parts[3] = newBib;
		newParts = parts.slice(0, 4).join(":") + ":";
		return new CtsUrn(newParts);
	}
}

/**
 * Takes a CtsUrn and returns a CtsUrn identifying only the work-level. Retains citation.
 * 
 * @param {CtsUrn} urn - a CtsUrn at the work, version- or exemplar-level
 * @returns {CtsUrn} 
 * @throws CtsUrnError
 */
function workLevelUrn(urn) {
	parts = urn.toString().split(':');		
	bib = parts[3];
	bibParts = bib.split('.');
	if (bibParts.length < 2) {
		throw new CtsUrnError(`URN is only at the group level. No work, version, or exemplar: "${urn}"`);
	} else {
		newBib = bibParts.slice(0, 2).join('.');
		parts[3] = newBib;
		newParts = parts.slice(0, 4).join(":") + ":";
		return new CtsUrn(newParts);
	}
}

/**
 * Takes two CtsUrns and returns "true" if they are equal to the version-level
 * 
 * @param {CtsUrn} urn1 - a CtsUrn at the version- or exemplar-level
 * @param {CtsUrn} urn2 - a CtsUrn at the version- or exemplar-level
 * @returns {Boolean} 
 * @throws CtsUrnError
 */
function versionEquals(urn1, urn2) {
	vu1 = versionLevelUrn(urn1);
	vu2 = versionLevelUrn(urn2);
	return vu1.equals(vu2);
}

/**
 * Takes two CtsUrns and returns "true" if bibliographic hierarchy described by the first includes that described by the second. IGNORES PASSAGE COMPONENT.
 * 
 * @param {CtsUrn} urn1 - a CtsUrn at the work-, version- or exemplar-level
 * @param {CtsUrn} urn2 - a CtsUrn at the work-, version- or exemplar-level
 * @returns {CtsUrn} 
 * @throws CtsUrnError
 */
function biblIncludes(urn1, urn2) {
	u1 = urn1.dropPassage();
	u2 = urn2.dropPassage();

	if (u1.equals(u2)) return true;

	if (u2.isExemplarUrn() && u1.isVersionUrn()) {
		if (u1.equals(versionLevelUrn(u2))) return true;
	}

	if (u2.isExemplarUrn() && u1.isWorkUrn()) {
		if (u1.equals(workLevelUrn(u2))) return true;
	}

	if (u2.isVersionUrn()) {
		if (u1.equals(workLevelUrn(u2))) return true;
	}

	return false;
}


/**
 * Takes two CtsUrns and returns "true" if (a) the bibliographic hierarchy of the first "includes" that of the second, and (b) the passage-components are equal.
 * 
 * @param {CtsUrn} urn1 - a CtsUrn 
 * @param {CtsUrn} urn2 - a CtsUrn 
 * @returns {CtsUrn} 
 * @throws CtsUrnError
 */
function passageEquals(urn1, urn2) {
	if ( !biblIncludes(urn1, urn2)) {
		return false;
	} else {
		if (urn1.getPassage() == urn2.getPassage()) return true;
	}
	return false;
}



/**
 * A helper-function for passageIncludes(), below. Takes two string-representations of a passage-hierarchy and returns 'true' if the first includes, or "contains" the second
 * 
 * @param {String} s1
 * @param {String} s2 
 * @returns {Boolean} 
 * @throws CtsUrnError
 */
function passageStrIncludes(s1, s2) {
	// get components
	let cc1 = s1.split(".");
	let cc2 = s2.split(".");

	// Easy ones…
	if (cc1.length > cc2.length) return false;

	// Get them to the same number of fields
	cc2 = cc2.slice(0, cc1.length);

	if (cc1.toString() == cc2.toString()) return true;

	return false;
}



/**
 * Looks ONLY at the passage-components of two URNs. Returns true if the hierarchy expressed by the first contains that of the second. Does some careful consideration of ranges.
 * 
 * @param {CtsUrn} urn1 - a CtsUrn 
 * @param {CtsUrn} urn2 - a CtsUrn 
 * @returns {Boolean} 
 * @throws CtsUrnError
 */
function passageIncludes(urn1, urn2) {
	p1 = getPassage(urn1);
	p2 = getPassage(urn2);
	// easy one…
	if (p1 == p2) return true;
	// non-ranges
	// A point cannot contain a range
	if (!p1.isRange() && p2.isRange()) return false;
	// A range can contain a point


	return false;


}


/**
 * Looks at the passage-components of two URNs. Returns true if the hierarchy expressed by the first contains that of the second. Does some careful consideration of ranges. Returns false if the bibliographic hierarchy of the first does not "include" that of the second
 * 
 * @param {CtsUrn} urn1 - a CtsUrn 
 * @param {CtsUrn} urn2 - a CtsUrn 
 * @returns {Boolean} 
 * @throws CtsUrnError
 */
function textIncludes(urn1, urn2) {
	return false;
}


function versionFromExemplar(urn) {
	return "";
}

function addExemplar(urn) {

}

function chopPassage(urn) {
	return "";
}

function sameText(urn1, urn2) {
	return false;
}

function citationLevel(urn) {
	return 0;
}

function citationToLevel(urn, level) {
	return "";
}

function equalizeCitationLevels(urn1, urn2){
	return ["", ""];
}


/* SETUP TESTS */

const targetElement = document.getElementById("test-output");

function urnReport(testUrn) {
	targetElement.innerHTML += `
		<div style="background-color: #ddd;">
		<p>Test URN constructed: <strong>${testUrn}</strong></p>
		<ul style="background-color: #eee;">
		<li>textgroup: ${testUrn.textgroup}</li>
		<li>work: ${testUrn.work}</li>
		<li>version: ${testUrn.version}</li>
		<li>exemplar: ${testUrn.exemplar}</li>
		<li>passage: ${testUrn.passage}</li>
		</ul>
		</div>`;
}

function testMethod(urn, message, testpassed) {
	var color = "red";
	if (testpassed) {
		color = "green";
	}
	targetElement.innerHTML += `<div><p style="color: ${color}"><strong>${message}</strong>: ${urn}</p></div>`;
}

// TEST URNs

workUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:");
versionUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
exemplarUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.token:");
passageUrn  = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1");
passageUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1");
rangeUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-3.3");

workPassage = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:10.12")
versionPassage = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:24.111")
exemplarPassage = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tokenized:12.380")

level1Urn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:1")
level2Urn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:2.3")
level3Urn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:4.5")

level1Range = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:1-2")
level2Range = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:3.4-4.5")
level3Range = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:6.7.8-9.10.11")

identifies1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:24.111")
identifies2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:24.111")
identifies3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:24.111")
identifies3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:24.111.2")

contains1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:24")
contains2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:24.1")
contains3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:24.1.3")
contains4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:25.1.3")

// *******************
//       TESTS
// *******************

// passageIncludes()

var pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2");
var pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.1");

pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.a.tok:2.1");
pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.a.tok:2.1");

pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.a.tok:2.1");
pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.a.tok:2.1.3");

pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.a.tok:2");
pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.a.tok:2");

pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.a.tok:2");
pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.a.tok:3");


// passageStrIncludes

var ps1 = "1.2.3";
var ps2 = "1.2.3.3"

testMethod(
	passageUrn,
	`passageStrIncludes(${ps1}, ${ps2})`, 
	passageStrIncludes(ps1, ps2)
);

testMethod(
	passageUrn,
	`SHOULD FAIL: passageStrIncludes(${ps2}, ${ps1})`,
	passageStrIncludes(ps2, ps1)
);

var ps1 = "1";
var ps2 = "1.2"

testMethod(
	passageUrn,
	`passageStrIncludes(${ps1}, ${ps2})`, 
	passageStrIncludes(ps1, ps2)
);

testMethod(
	passageUrn,
	`SHOULD FAIL: passageStrIncludes(${ps2}, ${ps1})`,
	passageStrIncludes(ps2, ps1)
);

var ps1 = "1.1"
var ps2 = "1.2"


testMethod(
	passageUrn,
	`SHOULD FAIL: passageStrIncludes(${ps2}, ${ps1})`,
	passageStrIncludes(ps2, ps1)
);

// equals() and equality

testMethod(
	passageUrn,
	"equals(CtsUrn, CtsUrn)",
	passageUrn.equals(passageUrn2)
);

testMethod(
	passageUrn,
	"equals(CtsUrn, String)",
	passageUrn.equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1")
);

testMethod(
	passageUrn,
	"SHOULD FAIL: CtsUrn == CtsUrn (WILL NOT WORK!)",
	passageUrn == passageUrn2
);

testMethod(
	passageUrn,
	"CtsUrn == String",
	passageUrn == "urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1"
);

// isVersionUrn(), &c.

testMethod(
	workUrn,
	"SHOULD FAIL: this.isVersionUrn()",
	workUrn.isVersionUrn()	
);

testMethod(
	versionUrn,
	"this.isVersionUrn()",
	versionUrn.isVersionUrn()	
);

testMethod(
	versionUrn,
	"SHOULD FAIL: this.isExemplarUrn()",
	versionUrn.isExemplarUrn()	
);

testMethod(
	exemplarUrn,
	"this.isExemplarUrn()",
	exemplarUrn.isExemplarUrn()	
);

// isRange()

testMethod(
	passageUrn,
	"SHOULD FAIL: this.isRange()",
	passageUrn.isRange()	
);

testMethod(
	rangeUrn,
	"this.isRange()",
	rangeUrn.isRange()	
);

// getPassage() & hasPassage()

testMethod(
	passageUrn,
	"this.getPassage()",
	passageUrn.getPassage() == "1.1"
);

testMethod(
	workUrn,
	"this.getPassage()",
	  workUrn.getPassage() == ""
);

testMethod(
	workUrn,
	"SHOULD FAIL: this.hasPassage()",
	  workUrn.hasPassage()
);

testMethod(
	passageUrn,
	"this.hasPassage()",
	  passageUrn.hasPassage()
);

testMethod(
	rangeUrn,
	"this.getPassage()",
	rangeUrn.getPassage() == "1.1-3.3"
);

// dropPassage(), replacePassage()

testMethod(
	passageUrn,
	"this.dropPassage()",

	passageUrn.dropPassage().equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:")
);

testMethod(
	passageUrn,
	"this.replacePassage({String})",
	passageUrn.replacePassage("2.2").equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:2.2") 
);

// splitRange(), rangeFrom(), rangeTo()

testMethod(
	rangeUrn,
	"splitRange()",
	((rangeUrn.splitRange()[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") &&
	(rangeUrn.splitRange()[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3"))
);

try {
	testMethod(
		passageUrn,
		"splitRange()",
		((passageUrn.splitRange()[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") &&
		(passageUrn.splitRange()[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3"))
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>this.splitRange()</code> errored correctly with non-range URN: <strong><code>${error}</code></strong></p></div>`;
}


testMethod(
	rangeUrn,
	"rangeFrom()",
	rangeFrom(rangeUrn).toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1" 
);

testMethod(
	rangeUrn,
	"rangeTo()",
	rangeTo(rangeUrn).toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3" 
);

// versionLevelUrn(), workLevelUrn()

testMethod(
	exemplarUrn,
	"versionLevelUrn()",
	versionLevelUrn(exemplarUrn).toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:" 
);


try {
	testMethod(
		workUrn,
		"versionLevelUrn()",
		versionLevelUrn(workUrn)
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>versionLevelUrn()</code> errored correctly with work-level URN: <strong><code>${error}</code></strong></p></div>`;
}

testMethod(
	exemplarUrn,
	"workLevelUrn()",
	workLevelUrn(exemplarUrn).equals(workUrn)
);

testMethod(
	versionUrn,
	"workLevelUrn()",
	workLevelUrn(versionUrn).equals(workUrn)
);

// versionEquals(), biblIncludes()

testMethod(
	exemplarUrn,
	"versionEquals()",
	versionEquals(exemplarUrn, versionUrn)
);

testMethod(
	workUrn,
	"biblIncludes()",
	biblIncludes(workUrn, versionUrn)
);

testMethod(
	versionUrn,
	"biblIncludes()",
	biblIncludes(versionUrn, exemplarUrn)
);

testMethod(
	workUrn,
	"biblIncludes()",
	biblIncludes(workUrn, exemplarUrn)
);

testMethod(
	workUrn,
	"biblIncludes()",
	biblIncludes(workUrn, workUrn)
);

testMethod(
	versionUrn,
	"biblIncludes()",
	biblIncludes(versionUrn, versionUrn)
);

testMethod(
	exemplarUrn,
	"biblIncludes()",
	biblIncludes(exemplarUrn, exemplarUrn)
);

testMethod(
	exemplarUrn,
	"SHOULD FAIL: biblIncludes()",
	biblIncludes(exemplarUrn, versionUrn)
);

testMethod(
	exemplarUrn,
	"SHOULD FAIL: biblIncludes()",
	biblIncludes(exemplarUrn, workUrn)
);

testMethod(
	versionUrn,
	"SHOULD FAIL: biblIncludes()",
	biblIncludes(versionUrn, workUrn)
);

testMethod(
	versionUrn,
	"SHOULD FAIL: biblIncludes()",
	biblIncludes(versionUrn, workUrn)
);

// passageEquals()

testMethod(
	identifies1,
	"passageEquals()",
	passageEquals(identifies1, identifies1)
);

testMethod(
	identifies1,
	"passageEquals()",
	passageEquals(identifies1, identifies2)
);

testMethod(
	contains1,
	"SHOULD FAIL: passageEquals()",
	passageEquals(contains1, contains2)
);

urnReport(workUrn);
urnReport(versionUrn);
urnReport(exemplarUrn);
urnReport(passageUrn);
urnReport(rangeUrn);


// Bad URNs

try {
  // Testing "try" with a good URN
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
	targetElement.innerHTML += `<h2 style="color: red;">SHOULD FAIL: Good URN: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // No work-component
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012:");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // No final colon
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // Trailing period
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1.");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // Trailing hyhen
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1-");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // Inappropriate final colon
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1:");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // Bad Range
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1-2.2-3.3");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // Bad citation
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1,3");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}