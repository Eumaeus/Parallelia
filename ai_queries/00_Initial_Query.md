You have helped me with a number of complex project aimed at helping my college students learn Ancient Greek. Some of these were re-writes of earlier versions that I had done without Grok's help. In each of those, I have seen the huge value of the concise, documented code, and the understanding of the project's goals, that you can bring. So here's another one!

## Parallēlia: Alignment of Texts and Translations.

This is to be a new version of an earlier project, which I wrote in Scala-JS a few years ago: <https://github.com/Eumaeus/ducat>.

It allows users to load two or more versions of a text—editions or translations—side-by-side, and by clicking create alignments of word-tokens from one to the others.

I would like to re-do it in a better way, with your help. I'm calling this new version *Parallēlia*, or *Parallelia* (to avoid laboriously typing the macron.)

I have created a repository for this work at <https://github.com/Eumaeus/Parallelia>. In that repository, I will keep copies of our conversations in the directory `ai_queries` so we will always have the context.

What follows is a big overview of my ideas for this app. At the end, I will suggest a concrete first step for us to work on.

## Things to Look At Before Step 0

- Original DUCAT app. Working one-page HTML app in this repo at `ducat.html`. Source code at the original repo: <https://github.com/Eumaeus/ducat>.
- Sample output from the original app serialized as CEX files, in the repo at: `alignments/`.
- Libraries of texts serialized as CEX files (the basis for the alignments, above), in the repo at: `cex/`
- (Since manipulation of texts under aligment will depend on the semantics of CtsUrns…) My new Javascript library for creating, manipulating, and comparing CtsUrn objects, in the repo at `js/ctsurn.js`, with a test-suite at `js/test-ctsurn.js` and an accompanying html page, `test-cts.html`. I would happily accept suggested changes or improvements.

## Step 0:

**This is what I want to start with, but it will help to describe Step 1 first.** I return to Step 0 at the end.

## Step 1:

- Load into the one-page webapp, from CEX files, two or more texts to be aligned.
- Display the texts in parallel on the screen.
- Make it easy for users to change the context of each text displayed, either by scrolling or by requesting passage by citation.

### Things to Consider for Step 1:

- Texts for comparison: size versus flexibility.
	- In the ideal world, a user could load a text and one or more translations, and choose to work on any part of them. They could scroll or jump around to any part of the text in each column.
	- But memory-space in a Javascript Webapp might become an issue.
	- Three versions of the *Iliad*, for example, might represent 4.5mb of textual data. Five versions of *The Gospel of Luke* (Greek, Latin, Spanish, and two English versions) add up to 7.9mb.
	- The extreme case would be a Greek text and English translation of Herodotus, which together are close to 30mb of text.
- Picking and Showing Texts for Alignment:
	- To get some texts on the screen for alignment work, a user needs to load one or more CEX files containing the texts…
	- …then identify the passages from each texts to display in the UI.
	- The user might (won't) know all the details of the citation-scheme or the vald citation-values for a text.
	- For example, a user working on the end of Book 1 of the *Iliad* can't ask for `1.600-1.700`, since *Iliad* Book 1 has only 611 lines.

## Step 0: Where I want to Start

All of the above is context. Here's where I want to start.

I think I need dedicated Javascript libraries for working with CEX files and CITE Collections cited by CITE2-URNs, to go along with the `js/ctsurn.js` library I have started, described above.

When I made the ScalaJS app, my colleague Neel Smith and I had very well tested Scala libraries for working with CTS-URNs, Corpora of CTS texts, CITE2-URNs, and collections of objects cited by CITE2-URNs.

We do not have such libraries in Javascript.

I would like `cite2urn.js`, and `cite-cex.js`.

### `cite-cex.js`

(A concise, but rich, example of a CEX file is in the repo at `alignments/Frog-Haiku.cex`.)

- Reading and parsing a CEX file, capturing structured data from these CEX blocks:
	- `citelibrary`: Describes the current CEX file
	- `ctscatalog`: Metadata for texts represented in #!ctsdata corpora. There may be more than one in a CEX file.
	- `ctsdata`: A corpus of passages of text, in text order (important!), cited by CtsUrn. There may be more than one #!ctsdata block in a CEX file.
	- `citecollections`: metadata for the collection of objects in the CEX file. There may be more than one #!citecollections block.
	- `citeproperties`: a list of properties, each cited by a Cite2Urn that is an extension of a collection's URN.
	- `citedata`: a list of objects and their property-values, cited by Cite2Urn
	- `datamodels`: We should capture any `#!datamodels` blocks, but probably won't use them for this project.
	- `relations`: Triplets relating one URN (CtsUrn or Cite2Urn) to another, with a relation defined by a Cite2Urn.
- Merging two CEX files, in all their complexity.
- (Perhaps) Exerpting a shorter CEX file from a larger one, by grabbing all the metadata blocks (`ctscatalog`, `citecollections`, `citeproperties`, `datamodels`), but only a subset of the contents of the data blocks (`ctsdata`, `citedata`, `relations`).
- Writing CEX files.
- **Querying `citecollections` and `ctsdata` by URN.**
- **Querying `relations` by URN.**

I would like to develop `cite2urn.js` and `cite-cex.js` alongside `ctsurn.js`, in this repository, so I can refine them with experience building an app that will use all three. Later I will move them to their own repository.

If this makes sense, I can follow up with an overview