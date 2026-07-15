

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

}



/**
 * Does the URN cite a text at the version-level (only!)
 * 
 * @param {CtsUrn} urn - a CtsUrn
 * @returns {Boolean} Description
 * @throws CtsUrnError
 */
function isVersionUrn(urn) {
	if (urn.version && !urn.exemplar) {
		return true;
	} else {
		return false;
	}
}

/**
 * Does the URN cite a text at the exemplar-level (only!)
 * 
 * @param {CtsUrn} urn - a CtsUrn
 * @returns {Boolean} Description
 * @throws CtsUrnError
 */
function isExemplarUrn(urn) {
	if (urn.exemplar) {
		return true;
	} else {
		return false;
	}
}

/**
 * Does the URN identify a range of passages?
 * 
 * @param {CtsUrn} urn - a CtsUrn
 * @returns {Boolean} 
 * @throws CtsUrnError
 */
function isRange(urn) {
	return urn.passage.includes('-');
}

/**
 * Removes the passage-component from a URN and returns a new URN
 * 
 * @param {CtsUrn} urn - a CtsUrn
 * @returns {CtsUrn} 
 * @throws CtsUrnError
 */
function dropPassage(urn) {
	components = urn.toString().split(":").slice(0,4);
	newUrnString = components.join(':') + ':';
	newUrn = new CtsUrn(newUrnString)
	return newUrn;
}

/**
 * Returns the passage-component of a CtsUrn
 * 
 * @param {CtsUrn} urn - a CtsUrn
 * @returns {String} 
 * @throws CtsUrnError
 */
function getPassage(urn) {
	return urn.passage;
}

/**
 * Replaces the passage-component of a CtsUrn with another
 * 
 * @param {CtsUrn} urn - a CtsUrn
 * @param {String} newPassage - a string representing the new passage (may be a range)
 * @returns {CtsUrn} 
 * @throws CtsUrnError
 */
function replacePassage(urn, newPassage) {
	newUrnStr = dropPassage(urn).toString();
	newUrn = new CtsUrn(newUrnStr + newPassage);
	return newUrn;
}

/**
 * Takes a range-urn and returns a Vector{CtsUrn}
 * identifying the first- and last-citations of the range
 * 
 * @param {CtsUrn} urn - a CtsUrn
 * @returns Vector{CtsUrn} 
 * @throws CtsUrnError
 */
function splitRange(urn) {
		if (!isRange(urn)) {
      throw new CtsUrnError(`Not a range-urn: "${urn}"`);
    } else {
    	var wholeRange = urn.passage;
    	var startPassage = wholeRange.split('-')[0];
    	var endPassage = wholeRange.split('-')[1];
    	urn1 = replacePassage(urn, startPassage);
    	urn2 = replacePassage(urn, endPassage);
    	return [urn1, urn2];
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
	return splitRange(urn)[0];
}

/**
 * Takes a range-urn and returns a CtsUrn pointing to the end of the range
 * 
 * @param {CtsUrn} urn - a CtsUrn
 * @returns {CtsUrn} 
 * @throws CtsUrnError
 */
function rangeTo(urn) {
	return splitRange(urn)[1];
}

/**
 * Takes a CtsUrn and returns a CtsUrn identifying only the version-level.
 * (No passage.)
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

function versionEquals(urn1, urn2) {
	return false;
}

function urnIncludes(urn1, urn2) {
	return false;
}

function passageEquals(urn1, urn2) {
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

function urnIdentifies(urn1, urn2) {
	return false;
}

function passageContains(urn1, urn2) {
	return false;
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

// TESTS

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
	workUrn,
	"isVersionUrn()",
	isVersionUrn(workUrn)	
);

testMethod(
	versionUrn,
	"isVersionUrn()",
	isVersionUrn(versionUrn)	
);

testMethod(
	versionUrn,
	"isExemplarUrn()",
	isExemplarUrn(versionUrn)	
);

testMethod(
	exemplarUrn,
	"isExemplarUrn()",
	isExemplarUrn(exemplarUrn)	
);

testMethod(
	passageUrn,
	"isRange()",
	isRange(passageUrn)	
);

testMethod(
	rangeUrn,
	"isRange()",
	isRange(rangeUrn)	
);

testMethod(
	passageUrn,
	"getPassage()",
	getPassage(passageUrn) == "1.1"
);

testMethod(
	rangeUrn,
	"getPassage()",
	getPassage(rangeUrn) == "1.1-3.3"
);

testMethod(
	passageUrn,
	"dropPassage()",

	dropPassage(passageUrn).equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:")
);

testMethod(
	passageUrn,
	"replacePassage()",
	replacePassage(passageUrn, "2.2").equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:2.2") 
);

testMethod(
	rangeUrn,
	"splitRange()",
	((splitRange(rangeUrn)[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") &&
	(splitRange(rangeUrn)[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3"))
);

try {
	testMethod(
		passageUrn,
		"splitRange()",
		((splitRange(passageUrn)[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") &&
		(splitRange(passageUrn)[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3"))
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>splitRange()</code> errored correctly with non-range URN: <strong><code>${error}</code></strong></p></div>`;
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

console.log(`versionLevelUrn: ${versionLevelUrn(exemplarUrn)}`);

urnReport(workUrn);
urnReport(versionUrn);
urnReport(exemplarUrn);
urnReport(passageUrn);
urnReport(rangeUrn);


// Bad URNs

try {
  // Testing "try" with a good URN
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
	targetElement.innerHTML += `<h2 style="color: red;">Good URN, this would be bad if it were an invalid URN: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // No work-component
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012:");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // No final colon
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // Trailing period
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1.");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // Trailing hyhen
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1-");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // Inappropriate final colon
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1:");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // Bad Range
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1-2.2-3.3");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}

try {
  // Bad citation
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1,3");
	targetElement.innerHTML += `<h2 style="color: red;">Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch (error) {
  // Code to handle the error
  console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2>Bad urn rejected! ${error.message}</h2>`;
}