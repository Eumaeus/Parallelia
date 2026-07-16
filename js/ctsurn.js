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
    this.workid = match[4];
    this.version = match[6];
    this.exemplar = match[8];
    this.passage = match[9];
    let biblioarray = [this.textgroup, this.workid];
    if (this.version) biblioarray.push(this.version);
    if (this.exemplar) biblioarray.push(this.exemplar);
    this.bibliocomponent = biblioarray;

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

	// Two CtsUrns are "congruent" if both can be said to identify *the same thing*.
	// Either of the two might identify *other things as well*.
	// Two CTS URNs are congruent if: 
	// 1.  They have the same namespace. 
	// 2.  For their work components, each period-separated part that is present in both is equal. If one URN has fewer work parts, it's congruent if its parts match the corresponding initial parts of the other. 
	// 3.  For their passage components (if not ranges), the same logic as for work components applies to their period-separated parts. 
	// 4.  They must both be ranges or both not be ranges.
	// 5.  If both are ranges, their start passage parts must be congruent, and their end passage parts must be congruent. 
	//@param {CtsUrn} - other
	//@returns {Boolean}

	isCongruentWith(other) {
		// 1.  They have the same namespace. 
		if (this.nid != other.nid) return false;
		// 2.  For their work components, each period-separated part that is present in both is equal. If one URN has fewer work parts, it's congruent if its parts match the corresponding initial parts of the other. 
		let thisBib = this.bibliocomponent;
		let otherBib = other.bibliocomponent;
		let minBib = Math.min(thisBib.length, otherBib.length);
		let sb = thisBib.slice(0, minBib);
		let so = otherBib.slice(0, minBib);
		if (sb.join(".") != so.join(".")) return false;

		// 4.  They must both be ranges or both not be ranges.
		if ( this.isRange() != other.isRange() ) return false;
		if ( !(this.isRange() ) ) {
			// 3.  For their passage components (if not ranges), the same logic as for work components applies to their period-separated parts. 
			let thisPass = this.passage.split(".");
			let otherPass = other.passage.split(".");
			let minPass = Math.min(thisPass.length, otherPass.length);
			let tps = thisPass.slice(0, minPass);
			let ops = otherPass.slice(0, minPass);
			if (tps.join(".") != ops.join(".")) return false;
		} else { 
			// 5.  If both are ranges, their start passage parts must be congruent, and their end passage parts must be congruent. 
			let tra = this.splitRange();
			let ora = other.splitRange();
			if ( !(tra[0].isCongruentWith(ora[0]) && tra[1].isCongruentWith(ora[1])) ) return false;
		}

		return true;
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

















