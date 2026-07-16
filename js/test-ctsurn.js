
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