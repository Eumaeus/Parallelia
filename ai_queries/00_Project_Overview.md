You have helped me with a number of complex project aimed at helping my college students learn Ancient Greek. Some of these were re-writes of earlier versions that I had done without Grok's help. In each of those, I have seen the huge value of the concise, documented code, and the understanding of the project's goals, that you can bring. So here's another one!

## Parallēlia: Alignment of Texts and Translations.

This is to be a new version of this project, which I wrote in Scala-JS a few years ago: <https://github.com/Eumaeus/ducat>.

It allows users to load two or more versions of a text—editions, translations—side-by-side, and by clicking create alignments of word-tokens from one to the others.

I would like to re-do it in a better way, with your help.

I have created a repository for this work at <https://github.com/Eumaeus/Parallelia>. In that repository, I will keep copies of our conversations in the directory `ai_queries` so we will always have the context.

### Key Features

I made the earlier project having seen other "translation-alignment" projects and having decided that this is a valuable exercise for students, with the potential to produce a valuable dataset. All other projects had some limitations. I wanted to rectify those in the following ways:

- Alignment of tokens from editions to translations *cannot* be one-to-one. They must be one-to-many, or many-to-many.
- Alignment cannot require that one contiguous series of tokens in an edition will align with another contiguous string of tokens in a translation.
- Alignment cannot assume that each token will participate in only one "act of alignment".
- The work of alignment should be serialized into a plain-text format.
- The work of alignment should be able to proceed piecemeal, treating pieces of a text here and there.
- The results of alignment-work should never, ever, lose their connection to the coplete texts, even of only a small section of a text has been aligned.
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

### Architectural Overview

- A pure HTML/JS/CSS project.
- No huge and complicated JS libraries.
- All offline-capable, with no external dependencies (including CSS frameworks, if possible).
	- An exception for an option to load libraries of texts and alignment files from GitHub. See below.
- Text import from CEX files.
- Alignment export to, and reimport from, CEX files.

### UI Overview

I was happy with the overall UI and CSS in the original version: <https://raw.githubusercontent.com/Eumaeus/ducat/refs/heads/master/downloads/reader-1.1.0.html>.

The Javascript was compiled from ScalaJS, from code here: <https://github.com/Eumaeus/ducat/tree/master/src>.

#### Loading Texts

- Local CEX-files.
- CEX files on Github. A default library address.
- Add texts by CTS-URN.
- Pre-defined "text-sets": `.tsv` files with alignment-sets of `urn \t urn \t urn`. The CEX files of the texts offering those urn-cited passages may be in the local CEX library.
- Or pre-dfiend "text-sets" on GitHub, pointing to texts also on GitHub.

#### Alignment

- User sees a field called "Saved Alignments".
- Below it, a field called "New Alignment."
- The user sees two texts in parallel columns.
- User begins an alignment by clicking on tokens in one text. They are highlighted with a distictive background color. This makes them ready to be added to an Alignment.
- As the user clicks, those tokens, with the same highlighting, appear in the "New Alignment" field.
- User clicks on tokens in the other text. They are highlighted with a distinctive but different color.
- They are added to "New Aligment", *after* those from the first column, with their coloring making them distinct.
- When a user is satisfied with the alignment, he can click an icon to "save" that alignment.
- Upon saving an alignment, a colored oval with an enumeration (0, 1, 2), appears in "Saved Alignments". As more saved alignments appear, their markers will line up, colored distinctively. 
- Also, in the aligned texts, a colored circle appears after each token corresponding to saved alignment that it is a part of.
- Because a token can be part of more than one saved alignment, it may have more than one colored circle after it.
- The colors of the Saved Alignments do not need to have any relationship with the colors shown when creating a new alignment. I used basic primaries and secondaries in the old app for alignments in progress (read, green, blue, etc., according to how many texts were being aligned).
- For the Saved alignments, I used a color-palette like the ones at <https://carto.com/carto-colors/> that offered a long-list of vivid contrasting colors. There may end up being 20 or more saved alignments.
- When a user hovers over one of the Saved Alignement ovals, all the tokens in the texts show background highlighting matching the color of that saved alignment.
- Also, hoving over a saved-alignment expands the oval to reveal an "x", which allows the user to delete that saved alignment and unassigning any tokens assigned to it.

### Features

- Should load texts using CTS-URNs. 
- There are niftly color-palettes for coloring lists so that adjacent items contrast.