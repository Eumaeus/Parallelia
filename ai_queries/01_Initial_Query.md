You have helped me with a number of complex project aimed at helping my college students learn Ancient Greek. Some of these were re-writes of earlier versions that I had done without Grok's help. In each of those, I have seen the huge value of the concise, documented code, and the understanding of the project's goals, that you can bring. So here's another one!

## Parallēlia: Alignment of Texts and Translations.

This is to be a new version of this project, which I wrote in Scala-JS a few years ago: <https://github.com/Eumaeus/ducat>.

It allows users to load two or more versions of a text—editions, translations—side-by-side, and by clicking create alignments of word-tokens from one to the others.

I would like to re-do it in a better way, with your help.

I have created a repository for this work at <https://github.com/Eumaeus/Parallelia>. In that repository, I will keep copies of our conversations in the directory `ai_queries` so we will always have the context.

What follows is a big overview of my ideas for this app. At the end, I will suggest a concrete first step for us to work on.

### Key Features

I made the earlier project having seen other "translation-alignment" projects and having decided that this is a valuable exercise for students, with the potential to produce a valuable dataset. All other projects had some limitations. I wanted to rectify those in the following ways:

- Alignment of tokens from editions to translations *cannot* be one-to-one. They must be one-to-many, or many-to-many.
- Alignment cannot require that one contiguous series of tokens in an edition will align with another contiguous string of tokens in a translation.
- Alignment cannot assume that each token will participate in only one "act of alignment".
- The work of alignment should be serialized into a plain-text format.
- The work of alignment should be able to proceed piecemeal, treating pieces of a text here and there.
- The results of alignment-work should never, ever, lose their connection to the coplete texts, even of only a small section of a text has been aligned.
- Rigorous separation of concerns. Alignments exist entirely as "stand-off markup", indexes to the texts. While we might serialize a library of texts with a collection of alignment-objects, CEX lets us keep them discrete.
- There should not have to be an elaborate database back-end.

### Aligment of *Tokens*

For this tool, alignment will be among *tokens* in a text, and these are defined as "leaf-node citation units". Tokens are cited by CTS-URNs. For example:

- In this CEX file, <https://github.com/Eumaeus/Dramaturg.jl/blob/main/source-data/texts/Homer/hymn-2-demeter.cex>, each leaf-node citation unit is a poetic line.
	- `urn:cts:greekLit:tlg0013.tlg002.fucex:1` identifies a passage of text, "Δήμητρ' ἠύκομον, σεμνὴν θεόν, ἄρχομ' ἀείδειν,".
	- It would be a valid exercise to do an alignment of poetic-lines in the Greek to lines of poetry in an English translation, especially if the alignments could be one-to-many or many-to-many. 
	- So we might want to treat each poetic line of the Homeric Hymn to Demeter as a "token" to be aligned.
- In this CEX file, <https://github.com/Eumaeus/Dramaturg.jl/blob/main/data/tokenized/Homer/2_Demeter/2_Demeter_tokenized.cex>, we have taken the text above and tokenized it by word-and-punctuation, so the leaf-node citation units are either Greek words or marks of punctuation:
	- `urn:cts:greekLit:tlg0013.tlg002.fucex:1.token.1` identifies "Δήμητρ’"
	- `urn:cts:greekLit:tlg0013.tlg002.fucex:1.token.2` identifies "ἠύκομον"
	- With this, we could do a translation-alignment at a more fine-grained level.	
- As an extreme example, the file <frog_haiku.cex> in this repository gives twelve different citable texts of the famous haiku by Bashō, "Furu ike ya", in Japanese and English, each tokenized separately. (This is my demo for "citation-based alignment".)
- **Creating texts for alignment is not part of this project**. I will handle that elsewhere.

So henceforth, when I say "token", I may mean "syllable" or "word" or "poetic line" or something else, but it will always be a passage citable by CTS-URN, at the leaf-node level (containing no smaller citable passages).

### Notes on CTS texts in CEX

- CTS defines a "text" as "an ordered hierarchy of citation-objecs."
- In a `#!ctsdata` block of a CEX file, the list of tuples, `urn # text`, captures this.
	- The structure of the CTS-URN capture the hierarchy of bibliography + passage: "Homer . *Iliad* . some-edition : book . line" or "New Testament . Luke . Greek . tokenized : chapter . verse . token".
	- The sequence of those tuples captures the "order" of those citation-objects.
- The `#!ctscatalog` gives human-readable metadata for interpreting the CTS-URNs in the data.

We can and should capitalize on the structure of the CTS-URN when working with texts in CTS.

Take this notional CTS text (assume this is the whole text).:

~~~
#!ctsdata
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.1.1#Forasmuch
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.1.2#as
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.1.3#many
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.1.4#have
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.1.5#…
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.2.1#Even
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.2.2#as
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.2.3#they
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.2.4#delivered
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.2.5#…
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.3.1#It
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.3.2#seemed
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.3.3#good
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.3.4#to
urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.3.5#me
~~~

If we want to retrieve the text, "Forasmuch as many have … Even as they delivered … It seemed good to me", we could do it in four ways using CTS-URNs.

- Range-urn at the leaf-node: `urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.1.1-1.3.5` (from leaf-node to leaf-node)
- Range-urn at a containing-level: `urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.1-1.3` (from 1.1 and all of its contents, to 1.3 and all of its contents)
- Containing-urn: `urn:cts:greekLit:tlg0031.tlg003.kjv.token:1` (all contents of 1)
- Text-level: ``urn:cts:greekLit:tlg0031.tlg003.kjv.token:` (all text contents identified by this CTS-URN)

If we want "Even as they delivered … It seemed good to me" we have two choices:

- `urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.2.1-1.3.5`
- `urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.2-1.3`

If we want "many have … Even as", we have only one choice:

- `urn:cts:greekLit:tlg0031.tlg003.kjv.token:1.1.3-1.2.2`

We have developed this approach to texts to allow us to cite passages in the traditional way—"Luke 2.1"—while working flexibly and precisely with contents that do not align with the canonical citation.

### Notes on Alignment with CTS-URNs and CITE2-URNs

CTS-URNs identify passages of text in an "ordered hiearchy of citation objects." CITE2-URNs identify objects with defined properties in a collection. So… CTS-URNs are for texts, and CITE2-URNs are for everything else.

For textual alignment, we need three things:

- An "aligment object", identified by a CITE2-URN, in a collection of alignment objects. 
- Some citation-objects that "belong to" that alignment object. These are passages from two or more texts. There may be many.
- An index explicitly associationg the aligned citation-objects with the alignment-object.

So…

- Texts with "tokens" (verses, word, syllables, characters… it doesn't matter as long a each is citable with a CTS-URN).
- A collection of alignment-objects cited by CITE2-URN, with some kind of label, editor-attribution, etc.
- An index of Passages to Alignment Objects, CTS-URNs to CITE2-URNs. In my implementation, the relationship between them is made explicit with another CITE2-URN, which simply says "the relationship here is that this Alignment object 'aligns' this Passage."

What this gives us:

- Many-to-many alignments.
- A passage can be part of many alignments.
- Aligned passages do not need to be contiguous.
- The Alignment Objects and the index are unordered, since the only order that matters is that of the original texts, and that order is captured by their CEX serialization.
- The citation-schemes of the texts under alignment do not even need to be synchronized in any particular way (although they usually will be). Any CTS-URN can be "aligned" to any other(s).

**Examples**

In the directory `/alignments` in the repository <https://github.com/Eumaeus/Parallelia> there are some sample CEX file.

These contain `#!ctscatalog` blocks with bibliography for some texts, `#!ctsdata` blocks containing the contents of some texts, and examples of what alignment-data looks like:

- `alignments/Catullus1-aligned.cex` An alignment of Catullus Poem 1, between a Latin edition and an English translation.
- `alignments/Luke_1.5-1.6.cex` An alignment of Luke, Chapter 1, verses 5-6, among the Greek edition, the Latin translation, and an English translation.
- `alignments/Luke_1.5-1.6_blank.cex` A CEX file set up as a blank-template for doing the alignment above.
- `alignments/Frog-Haiku.cex` An alignment of three different tokenizations of the famouse haiku from Bashō, "Furu Ike Ya".



### Steps

- Javascript CTS-CEX functions
	- Extract Text(s): Given a large CEX library, extract specific texts identified by URNs, with `#!ctscatalog` data, and each text in its own `#!ctsdata` block.
	- Merge CEX: Given a list of CEX files, merge them into one, with one `#!ctscatalog` adn each text in its own `#!ctsdata` block.
	- Add Alignments to CEX: Given a CEX file with some alignments, and another, presumably more inclusive library of texts, create a CEX that has all the contents of the larger CEX file, plus the alignment data from the first file.
	- `function getpassage(ctsurn)`: Given a CEX file, or an in-data representation of a CEX file, get the citable passages defined by a range-level CTS-URN, *e.g.* `urn:cts:greekLit:tlg0031.tlg003.wh:1.1.token.1-1.2.token.3` (leaf-node to leaf-node) **or** `urn:cts:greekLit:tlg0031.tlg003.wh:1.1-1.2` (containing node, with all its contents, to containing node, including all its contents).
	- Extract Passages to CEX: Given one or more range-urns, from one or more texts, generate a CEX file, with proper `#!ctscatalog` block, containing `#!ctsdata` blocks with the passages defined by the range-urns. **If more than one range is given from the same text, the passages should be in separate `#!ctsdata` blocks, one for each range-urn, but the sequence of the blocks should follow the sequence of the passages in the original CEX file.**
