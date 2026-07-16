// --------------------------
// --- CtsUrn Class ---------
//
//   CTS URNs have 5 components:
//   urn:cts:<namespace>:<bibliography-component>:<passage-component>
//
//   <bibliography-component> captures the *bibliographic hierarchy*
//   in period-separated fields.
//
//   <passage-component> captures the *passage-hierarchy*
//   in period-separated fields. It may express a *range*
//   from passage to another with two period-separated passeges
//   separated by a hyphen.
//
//   NOTE: The values in the <passage-component> are *labels* not
//   *integers*, although integers are often used as labels. E.g.
//   "Iliad 1.1", but also "Euclid, Elements, 1 Postulate 1" 
//   or "Aristpohanes Frogs 1153a".
//
// --------------------------


// --- Define CtsUrnError ---

class CtsUrnError extends Error {
  constructor(message) {
    super(message);
    this.name = "CtsUrnError";
  }
}

class CtsUrn {
  constructor(urnString) {

  	// -----------------------
		// --- Generate CtsUrn ---

  	const match = urnString.match(/^urn:([a-z0-9-]{1,31}):([A-Za-z]+):([A-Za-z0-9]+)\.([A-Za-z0-9]+)(\.([A-Za-z0-9]+))?(\.([A-Za-z0-9]+))?:(([A-Za-z0-9]+)(\.[A-Za-z0-9]+)*(-([A-Za-z0-9]+)(\.[A-Za-z0-9]+)*)?)?$/i);
    if (!match) {
      throw new CtsUrnError(`Invalid URN format: "${urnString}"`);
    }

  	// -----------------------
    // --- Properties ---

    this.urnstring = match[0];
    this.nid = match[1].toLowerCase();
    this.nss = match[2];
    this.textgroup = match[3];
    this.work = match[4];
    this.version = match[6];
    this.exemplar = match[8];
    this.passage = match[9];
  }

	// -----------------------
  // --- URN Classification ---

	// Returns true if a CtsUrn has a passage-component
	// @returns {Boolean} 
	hasPassage(urn) {
		if (this.passage) return true;
		return false;
	}		

	// Does the URN identify a range of passages?
	// @returns {Boolean} 
	isRange() {
		return this.passage.includes('-');
	}

	// Does the URN cite a text at the work-level (only!)
	// @returns {Boolean} Description
	isWorkUrn() {
		if (!this.version) {
			return true;
		} else {
			return false;
		}
	}

	// Does the URN cite a text at the version-level (only!)
	// @returns {Boolean} Description
	isVersionUrn() {
		if (this.version && !this.exemplar) {
			return true;
		} else {
			return false;
		}
	}

	// Does the URN cite a text at the exemplar-level (only!)
	// @returns {Boolean} Description
	isExemplarUrn(urn) {
		if (this.exemplar) {
			return true;
		} else {
			return false;
		}
	}

	// Returns the number of fields in the citation-component of the CtsUrn
	//@returns {Int}
	citationLevel() {
		return 0;
	}

	// -----------------------
  // --- URN Comparison ----

  equals(other) {
  	return this.toString() == other.toString();
  }

  // Intercepts the comparison when compared to a primitive
  [Symbol.toPrimitive](hint) {
    return this.toString(); 
  }

	// Takes another CtsUrn and returns "true" if they are equal to the version-level
	// @param {CtsUrn} other - a CtsUrn at the version- or exemplar-level
	// @returns {Boolean} 
	versionEquals(other) {
		let vu1 = this.versionLevelUrn();
		let vu2 = other.versionLevelUrn();
		return vu1.equals(vu2);
	}

	// Takes another CtsUrn and returns "true" if bibliographic hierarchy described by the `this` includes that described by the second. IGNORES PASSAGE COMPONENT.
	// @param {CtsUrn} other - a CtsUrn at the work-, version- or exemplar-level
	// @returns {CtsUrn} 
	biblIncludes(other) {
		let u1 = this.dropPassage();
		let u2 = other.dropPassage();

		if (u1.equals(u2)) return true;

		if (u2.isExemplarUrn() && u1.isVersionUrn()) {
			if (u1.equals(u2.versionLevelUrn())) return true;
		}

		if (u2.isExemplarUrn() && u1.isWorkUrn()) {
			if (u1.equals(u2.workLevelUrn())) return true;
		}

		if (u2.isVersionUrn()) {
			if (u1.equals(u2.workLevelUrn())) return true;
		}

		return false;
	}

	// Takes another CtsUrn and returns "true" if (a) the bibliographic hierarchy of the `this` "includes" that of the second, and (b) the passage-components are equal.
	// @param {CtsUrn} other - a CtsUrn 
	// @returns {CtsUrn} 
	passageEquals(other) {
		if ( !this.biblIncludes(other)) {
			return false;
		} else {
			if (this.getPassage() == other.getPassage()) return true;
		}
		return false;
	}

	// A helper-function for passageIncludes(), below. Takes two string-representations of a passage-hierarchy and returns 'true' if the first includes, or "contains" the second
	// @param {String} s1
	// @param {String} s2 
	// @returns {Boolean} 
	passageStrIncludes(s1, s2) {
		// get components
		let cc1 = s1.split(".");
		let cc2 = s2.split(".");

		// Easy one…
		if (cc1.length > cc2.length) return false;

		// Get them to the same number of fields
		cc2 = cc2.slice(0, cc1.length);

		if (cc1.toString() == cc2.toString()) return true;

		return false;
	}

	// Looks ONLY at the passage-components of two URNs. Returns true if the hierarchy expressed by the first contains that of the second. Does some careful consideration of ranges.
	// @param {CtsUrn} other
	// @returns {Boolean} 
	passageIncludes(other) {
		p1 = getPassage(this);
		p2 = getPassage(other);
		// easy one…
		if (p1 == p2) return true;

		// non-ranges

		// A point cannot contain a range

		if (!p1.isRange() && p2.isRange()) return false;

		// A range can contain a point

		return false;
	}

	// Looks at the passage-components of two URNs, `this` and `other`. Returns true if the hierarchy expressed by the first contains that of the second. Does some careful consideration of ranges. Returns false if the bibliographic hierarchy of the first does not "include" that of the second
	// @param {CtsUrn} urn2 - a CtsUrn 
	// @returns {Boolean} 
	textIncludes(urn2) {
		return false;
	}

	//Shorthand function. Ignoring citation-components, are the URNs' bibliography-components equal.
	//@param {CtsUrn} - other
	//@returns {Boolean}
	sameText(other) {
		return false;
	}


	// ---------------------
	// --- URN Retrieval ---

	toString() {
		return `${this.urnstring}`;
	}

	// Returns the {String} of a passage-component
	// @returns {String} 
	getPassage() {
		if (this.passage) return this.passage;
		return "";
	}

	// -------------------------
  // --- URN-Manipulations ---

	// Removes the passage-component from a URN and returns a new URN
	// @returns {CtsUrn} 
  dropPassage() {
		let components = this.urnstring.split(":").slice(0,4);
		let newUrnString = components.join(':') + ':';
		let newUrn = new CtsUrn(newUrnString)
		return newUrn;
  }

	// Replaces the passage-component of a CtsUrn with another
	// @param {String} newPassage - a string representing the new passage (may be a range)
	// @returns {CtsUrn} 
	replacePassage(newPassage) {
		let newUrnStr = this.dropPassage().toString();
		let newUrn = new CtsUrn(newUrnStr + newPassage);
		return newUrn;
	}

	// Takes a range-urn and returns a Vector{CtsUrn}
	// identifying the first- and last-citations of the range
	// @returns Vector{CtsUrn} 
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

	// Takes a range-urn and returns a CtsUrn pointing to the start of the range
	// @returns {CtsUrn} 
	rangeFrom() {
		return this.splitRange()[0];
	}

	// Takes a range-urn and returns a CtsUrn pointing to the end of the range
	// @returns {CtsUrn} 
	rangeTo() {
		return this.splitRange()[1];
	}

	// Takes a CtsUrn and returns a CtsUrn identifying only the version-level. 
	// (Drops passage!)
	// @param {CtsUrn} urn - a CtsUrn at the version- or exemplar-level
	// @returns {CtsUrn} 
	versionLevelUrn() {
		let parts = this.toString().split(':');		
		let bib = parts[3];
		let bibParts = bib.split('.');
		if (bibParts.length < 3) {
			throw new CtsUrnError(`URN is only at the work level. No version: "${urn}"`);
		} else {
			let newBib = bibParts.slice(0, 3).join('.');
			parts[3] = newBib;
			let newParts = parts.slice(0, 4).join(":") + ":";
			return new CtsUrn(newParts);
		}
	}

	// Takes a CtsUrn and returns a CtsUrn identifying only the work-level.
	// (Drops passage!)
	// @param {CtsUrn} urn - a CtsUrn at the work, version- or exemplar-level
	// @returns {CtsUrn} 
	workLevelUrn() {
		let parts = this.toString().split(':');		
		let bib = parts[3];
		let bibParts = bib.split('.');
		if (bibParts.length < 2) {
			throw new CtsUrnError(`URN is only at the group level. No work, version, or exemplar: "${urn}"`);
		} else {
			let newBib = bibParts.slice(0, 2).join('.');
			parts[3] = newBib;
			let newParts = parts.slice(0, 4).join(":") + ":";
			return new CtsUrn(newParts);
		}
	}

	// Given an exemplar-level CtsUrn, remove the exemplar-component of the URN, leaving everything else the same.
	// @returns {CtsUrn}
	versionFromExemplar() {
		return null;
	}

	// Adds the String `exemplarId` to a version-level URN, leaving everything else unchanged.
	// @param {String} - exemplarId
	// @returns {CtsUrn}
	addExemplar(exemplarId) {
		return null;
	}

	//Reduce the passage-hierarchy of the CtsUrn by one level.
	//@returns {CtsUrn}
	chopPassage() {
		return null;
	}

	//Extend the passage-hierarchy of the CtsUrn by one level, adding `citeString` as the value for the new level
	//@param {String} - citeString
	//@returns CtsUrn
	extendPassage(citeString) {
		return null;
	}

	//Chops the citation-hierarchy until it is `level`-levels deep.
	//Error if `level` is greater than the current citation-level.
	//@param {Int} - level
	//@returns {CtsUrn}
	citationToLevel(level) {
		return null;
	}

	// Chop the citation-level of whichever URN has a deeper citation-hiearchy so that both are at the same level
	//@param {CtsUrn} - other
	//@returns [{CtsUrn}, {CtsUrn}]
	equalizeCitationLevels(other){
		return [null, null];
	}

} // end `class CtsUrn`

















