
/* SETUP TESTS */

const targetElement = document.getElementById("test-output");

function urnReport(testUrn) {
	targetElement.innerHTML += `
		<div style="background-color: #ddd;">
		<p>Test URN constructed: <strong>${testUrn}</strong></p>
		<ul style="background-color: #eee;">
		<li>textgroup: ${testUrn.textgroup}</li>
		<li>work: ${testUrn.workid}</li>
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

// ====================
// TEST URNs
// ====================

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

// -------------------
// passageIncludes()
// -------------------

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


// -------------------
// isCongruentWith()
// -------------------

//		… start with incongruities
var incongU1a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.3");
var incongU1b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.dog:1.1.3");

var incongU2a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.3");
var incongU2b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.butle.tok:1.1.3");

var incongU3a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.3");
var incongU3b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.4");

var incongU4a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.4");
var incongU4b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.4.4");

testMethod(
	incongU1a,
	`SHOULD FAIL: this.isCongruentWith(CtsUrn) != "${incongU1b}"`,
	incongU1a.isCongruentWith(incongU1b)
);

testMethod(
	incongU2a,
	`SHOULD FAIL: this.isCongruentWith(CtsUrn) != "${incongU2b}"`,
	incongU2a.isCongruentWith(incongU2b)
);

testMethod(
	incongU3a,
	`SHOULD FAIL: this.isCongruentWith(CtsUrn) != "${incongU3b}"`,
	incongU3a.isCongruentWith(incongU3b)
);

testMethod(
	incongU4a,
	`SHOULD FAIL: this.isCongruentWith(CtsUrn) != "${incongU4b}"`,
	incongU4a.isCongruentWith(incongU4b)
);

//     …now test congruities

var congU1a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.2.3");
var congU1b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3");
var congU1c = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2.3");
var congU2a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a.b.c");
var congU2b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a.b");
var congU2c = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a");

testMethod(
	congU1a,
	`this.isCongruentWith(CtsUrn) ~= "${congU1b}"`,
	congU1a.isCongruentWith(congU1b)
);

testMethod(
	congU1a,
	`this.isCongruentWith(CtsUrn) ~= "${congU1c}"`,
	congU1a.isCongruentWith(congU1c)
);

testMethod(
	congU1b,
	`this.isCongruentWith(CtsUrn) ~= "${congU1c}"`,
	congU1b.isCongruentWith(congU1c)
);

testMethod(
	congU2a,
	`this.isCongruentWith(CtsUrn) ~= "${congU2b}"`,
	congU2a.isCongruentWith(congU2b)
);

testMethod(
	congU2a,
	`this.isCongruentWith(CtsUrn) ~= "${congU2c}"`,
	congU2a.isCongruentWith(congU2c)
);

testMethod(
	congU2b,
	`this.isCongruentWith(CtsUrn) ~= "${congU2c}"`,
	congU2b.isCongruentWith(congU2c)
);

//		… and incongruent ranges

var incongR1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.2");
var incongR2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.3");
var incongR3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-2.2");
var incongR4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2.1");
var incongR5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2");
var incongR6 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-3");

testMethod(
	incongR1,
	`SHOULD FAIL: this.isCongruentWith(CtsUrn) != "${incongR2}"`,
	incongR1.isCongruentWith(incongR2)
);

testMethod(
	incongR1,
	`SHOULD FAIL: this.isCongruentWith(CtsUrn) != "${incongR3}"`,
	incongR1.isCongruentWith(incongR3)
);

testMethod(
	incongR3,
	`SHOULD FAIL: this.isCongruentWith(CtsUrn) != "${incongR4}"`,
	incongR3.isCongruentWith(incongR4)
);

testMethod(
	incongR5,
	`SHOULD FAIL: this.isCongruentWith(CtsUrn) != "${incongR6}"`,
	incongR5.isCongruentWith(incongR6)
);

//		… and congruent ranges

var congR1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-3");
var congR2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4");
var congR3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3-3.4");

var congR3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4");
var congR4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2-3.4");
var congR5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2-3");

testMethod(
	congR1,
	`this.isCongruentWith(CtsUrn) ~= "${congR2}"`,
	congR1.isCongruentWith(congR2)
);

testMethod(
	congR1,
	`this.isCongruentWith(CtsUrn) ~= "${congR3}"`,
	congR1.isCongruentWith(congR3)
);

testMethod(
	congR3,
	`this.isCongruentWith(CtsUrn) ~= "${congR4}"`,
	congR3.isCongruentWith(congR4)
);

testMethod(
	congR3,
	`this.isCongruentWith(CtsUrn) ~= "${congR5}"`,
	congR3.isCongruentWith(congR5)
);

// -------------------
// versionFromExemplar()
// -------------------

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");

testMethod(
	testUrn1,
	`this.versionFromExemplar() == ${testUrn2.toString()} `,
	testUrn1.versionFromExemplar().toString() == testUrn2.toString() 
);

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");

testMethod(
	testUrn1,
	`this.versionFromExemplar() == ${testUrn2.toString()} `,
	testUrn1.versionFromExemplar().toString() == testUrn2.toString() 
);

// -------------------
// addExemplar()
// -------------------

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");

testMethod(
	testUrn2,
	`this.versionFromExemplar() == ${testUrn1.toString()} `,
	testUrn2.addExemplar("tok").toString() == testUrn1.toString() 
);

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");

testMethod(
	testUrn2,
	`this.versionFromExemplar() == ${testUrn1.toString()} `,
	testUrn2.addExemplar("tok").toString() == testUrn1.toString() 
);

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:2.2");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.dog:2.2");

testMethod(
	testUrn2,
	`this.versionFromExemplar() == ${testUrn1.toString()} `,
	testUrn2.addExemplar("tok").toString() == testUrn1.toString() 
);


// -------------------
// addPassage()
// -------------------

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");

var invalidPass1 = "3-4-5";
var invalidPass2 = "3:4";

var validPass1 = "3.4.5";
var validPass2 = "1.definition.3";
var validPass3 = "1.1-2.2";

// Test valid examples
testMethod(
	testUrn1,
	`this.addPassage(${validPass1}) == ${testUrn1.toString() + validPass1} `,
	testUrn1.addPassage(validPass1).toString() == `${testUrn1.toString() + validPass1}` 
);

// Test valid examples
testMethod(
	testUrn1,
	`this.addPassage(${validPass2}) == ${testUrn1.toString() + validPass2} `,
	testUrn1.addPassage(validPass2).toString() == `${testUrn1.toString() + validPass2}` 
);

// Test valid examples
testMethod(
	testUrn2,
	`this.addPassage(${validPass2}) == ${testUrn1.toString() + validPass2} `,
	testUrn2.addPassage(validPass2).toString() == `${testUrn1.toString() + validPass2}` 
);

// Test passage-string validation
try {
	testMethod(
		testUrn1,
		`this.addPassage(${invalidPass1})`,
		testUrn1.addPassage(invalidPass1)
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>this.addPassage(${invalidPass1})</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`;
}

try {
	testMethod(
		testUrn1,
		`this.addPassage(${invalidPass2})`,
		testUrn1.addPassage(invalidPass2)
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>this.addPassage(${invalidPass2})</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`;
}

// -------------------
// .passageDepth() and .rangeDepth()
// -------------------

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var testUrn3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3");

var testRange1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2");
var testRange2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4");
var testRange3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2.3.4");

testMethod(
	testUrn1,
	`this.passageDepth() == 1 `,
	testUrn1.passageDepth() == 1 
);

testMethod(
	testUrn2,
	`this.passageDepth() == 2 `,
	testUrn2.passageDepth() == 2 
);

testMethod(
	testUrn3,
	`this.passageDepth() == 3 `,
	testUrn3.passageDepth() == 3 
);

testMethod(
	testRange1,
	`this.rangeDepth() == [1,1] `,
	(testRange1.rangeDepth()[0] == 1 && testRange1.rangeDepth()[1] == 1)
);

testMethod(
	testRange2,
	`this.rangeDepth() == [2,2] `,
	(testRange2.rangeDepth()[0] == 2 && testRange2.rangeDepth()[1] == 2)
);

testMethod(
	testRange3,
	`this.rangeDepth() == [1,3] `,
	(testRange3.rangeDepth()[0] == 1 && testRange3.rangeDepth()[1] == 3)
);


try {
	testMethod(
		testRange1,
		`this.passageDepth()`,
		testRange1.passageDepth() == 1
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>this.passageDepth()</code> errored correctly trying to deal with a range URN: <strong><code>${error}</code></strong></p></div>`;
}

try {
	testMethod(
		testUrn1,
		`this.rangeDepth()`,
		testUrn1.rangeDepth() == 1
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>this.rangeDepth()</code> errored correctly trying to deal with a passage URN: <strong><code>${error}</code></strong></p></div>`;
}

// -------------------
// this.chopPassage()
// -------------------

var testUrn0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var testUrn3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3");

var testRange2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4");

testMethod(
	testUrn0,
	"this.chopPassage()",
	testUrn0.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:"
);

testMethod(
	testUrn1,
	"this.chopPassage()",
	testUrn1.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:"
);

testMethod(
	testUrn2,
	"this.chopPassage()",
	testUrn2.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:1"
);

testMethod(
	testUrn3,
	"this.chopPassage()",
	testUrn3.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2"
);

try {
	testMethod(
		testRange2,
		`this.chopPassage()`,
		testRange2.chopPassage().equals(testUrn0)
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>this.chopPassage()</code> errored correctly trying to deal with a range URN: <strong><code>${error}</code></strong></p></div>`;
}

// -------------------
// .extendPassage()
// -------------------

var testUrn0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var testUrn3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");

var testRange1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-2.2");

testMethod(
	testUrn0,
	"this.extendPassage()",
	testUrn0.extendPassage("x") == "urn:cts:greekLit:tlg0012.tlg001.allen:x"
);

testMethod(
	testUrn1,
	"this.extendPassage()",
	testUrn1.extendPassage("x") == "urn:cts:greekLit:tlg0012.tlg001.allen:1.x"
);

testMethod(
	testUrn3,
	"this.extendPassage()",
	testUrn3.extendPassage("x") == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2.x"
);

try {
	testMethod(
		testRange1,
		`this.extendPassage()`,
		testRange1.extendPassage("x").equals(testUrn0)
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>this.extendPassage()</code> errored correctly trying to deal with a range URN: <strong><code>${error}</code></strong></p></div>`;
}

// -------------------
// .makeRange()
// -------------------

var testUrn0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2");
var testUrn3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var testUrn4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:3.4");

var testRange1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-2.2");
var testRange2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:3.3-4.4");

testMethod(
	testUrn1,
	"this.makeRange()",
	testUrn1.makeRange(testUrn2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1-2"
);

testMethod(
	testUrn3,
	"this.makeRange()",
	testUrn3.makeRange(testUrn4) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4"
);

testMethod(
	testRange1,
	"this.makeRange()",
	testRange1.makeRange(testRange2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1-4.4"
);

try {
	testMethod(
		testUrn0,
		`this.makeRange()`,
		testUrn0.makeRange(testUrn3).equals(testUrn3)
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>this.makeRange()</code> errored correctly trying to deal with no-passage URN: <strong><code>${error}</code></strong></p></div>`;
}

try {
	testMethod(
		testUrn3,
		`this.makeRange()`,
		testUrn3.makeRange(testUrn0).equals(testUrn3)
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>this.makeRange()</code> errored correctly trying to deal with no-passage URN: <strong><code>${error}</code></strong></p></div>`;
}

// -------------------
// equals() and equality
// -------------------

testMethod(
	passageUrn,
	"this.equals(CtsUrn, CtsUrn)",
	passageUrn.equals(passageUrn2)
);

testMethod(
	passageUrn,
	"this.equals(CtsUrn, String)",
	passageUrn.equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1")
);

testMethod(
	passageUrn,
	"SHOULD FAIL: CtsUrn == CtsUrn [WILL NOT WORK! Use urn.equals()]",
	passageUrn == passageUrn2
);

testMethod(
	passageUrn,
	"CtsUrn == String",
	passageUrn == "urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1"
);

// -------------------
// isVersionUrn(), &c.
// -------------------

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

// -------------------
// isRange()
// -------------------

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

// -------------------
// getPassage() & hasPassage()
// -------------------

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

// -------------------
// dropPassage(), replacePassage()
// -------------------

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

// -------------------
// splitRange(), rangeFrom(), rangeTo()
// -------------------

testMethod(
	rangeUrn,
	"this.splitRange()",
	((rangeUrn.splitRange()[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") &&
	(rangeUrn.splitRange()[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3"))
);

try {
	testMethod(
		passageUrn,
		"this.splitRange()",
		((passageUrn.splitRange()[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") &&
		(passageUrn.splitRange()[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3"))
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>this.splitRange()</code> errored correctly with non-range URN: <strong><code>${error}</code></strong></p></div>`;
}

testMethod(
	rangeUrn,
	"this.rangeFrom()",
	rangeUrn.rangeFrom().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1" 
);

testMethod(
	rangeUrn,
	"this.rangeTo()",
	rangeUrn.rangeTo().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3" 
);

// -------------------
// versionLevelUrn(), workLevelUrn()
// -------------------

testMethod(
	exemplarUrn,
	"this.versionLevelUrn()",
	exemplarUrn.versionLevelUrn().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:" 
);


try {
	testMethod(
		workUrn,
		"this.versionLevelUrn()",
		workUrn.versionLevelUrn()
	);
} catch(error){
	targetElement.innerHTML += `<div><p style="color: navy"><code>this.versionLevelUrn()</code> errored correctly with work-level URN: <strong><code>${error}</code></strong></p></div>`;
}

testMethod(
	exemplarUrn,
	"this.workLevelUrn()",
	exemplarUrn.workLevelUrn().equals(workUrn)
);

testMethod(
	versionUrn,
	"this.workLevelUrn()",
	versionUrn.workLevelUrn().equals(workUrn)
);

// -------------------
// Testing and reporting constructors
// -------------------

urnReport(workUrn);
urnReport(versionUrn);
urnReport(exemplarUrn);
urnReport(passageUrn);
urnReport(rangeUrn);


// -------------------
// Bad URNs
// -------------------

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