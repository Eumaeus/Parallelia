using Revise

Revise.revise()

const PUNCTUATION_REGEX = r"([-“”\"·'‘’.,;:!?{}…†()–—[\]])"

function get_version_urn(ctsurn::AbstractString)::String
	parts = split(ctsurn, ":")
	bibparts = join(parts[1:4], ":") * ":"
end

function version_to_token_urn(ctsurn::AbstractString)::String
	biburn = get_version_urn(ctsurn)
	nsparts = split(biburn, ":")[1:3]
	textpart = split(biburn, ":")[4]

	textparts = split(textpart, '.')
	if length(textparts) != 3 
		println("$(ctsurn) must be a version-level urn.")
		return ""
	else
		exemplarparts = join(textparts, ".") * ".token:"
		newurn = join(nsparts, ":") * ":" * exemplarparts
		return newurn
	end
end

function new_token_urn(ctsurn::AbstractString, tokNum::Int)
	parts = split(ctsurn, ":")
	bibpart = version_to_token_urn(ctsurn)
	citepart = parts[5] * "." * string(tokNum)
	return bibpart * citepart
end

function tokenize_line(text::AbstractString)::Vector{String}
    # Insert space before common Greek punctuation so they become their own tokens
    text = replace(text, PUNCTUATION_REGEX => s" \1 ")
    # Split on whitespace, drop empty tokens
    tokens = split(text, r"\s+"; keepempty=false)
    return tokens
end


"""
    load_cex(cex_path::String)
Return only the data lines (urn#text) from *all* `#!ctsdata` blocks.
Ignores every header block. Preserves order of appearance.
"""
function tokenize_cex(cex_path::String)
    lines = readlines(cex_path)
    version_entry = ""
    lib_entries = String[]
    cat_entries = String[]
    ctsdata = String[]
    in_data_block = false
    in_catalog_block = false
    in_library_block = false
    in_version_block = false
    data = String[]

    for line in lines
        line = strip(line)
        isempty(line) && continue
        contains(line, "//") && continue

        # Start of a new block
        if startswith(line, "#!")
        	 if line == "#!cexversion"
				in_version_block = true
				in_library_block = false
				in_catalog_block = false
				in_data_block = false
        	 end

        	 if line == "#!citelibrary"
				in_version_block = false
				in_library_block = true
				in_catalog_block = false
				in_data_block = false
        	 end

        	 if line == "#!ctscatalog"
				in_version_block = false
				in_library_block = false
				in_catalog_block = true
				in_data_block = false
        	 end

        	 if line == "#!ctsdata"
				in_version_block = false
				in_library_block = false
				in_catalog_block = false
				in_data_block = true
        	 end

          continue
        end

        # Get version info
        if in_version_block
        		version_entry = strip(line)
        end

        # Get library
        if in_library_block
        		if startswith(line, "name#")
					push!(lib_entries, line * " (Tokenization)")        				
        		elseif startswith(line, "urn#")
					push!(lib_entries, line * "_tokenized")        				
				else
					push!(lib_entries, line)
				end
        end

        # Get catalog
        if in_catalog_block
        	 # skip header
        	 startswith(line, "urn#citationScheme") && continue

        	 split_cat = split(line, "#")

        	 # exemplarLabel
        	 split_cat[6] = "tokenized"

        	 # urn
        	 oldUrn = split_cat[1]
        	 newUrn = version_to_token_urn(oldUrn)
        	 split_cat[1] = newUrn

        	 # citationScheme
        	 oldCS = split_cat[2]
        	 newCS = oldCS * "/token"
        	 split_cat[2] = newCS

        	 # join and keep
        	 newLine = join(split_cat, "#")
        	 push!(cat_entries, newLine)
        end

        # Get CTS Data
        if in_data_block && occursin('#', line)
        	 urn, text = split(line, '#'; limit=2)
        	 newText = text
        	 tokenVec = tokenize_line(text)

        	 for (idx, val) in pairs(tokenVec)
			    tokUrn = new_token_urn(urn, idx) 
			    tokText = val
        	    newLine = tokUrn * "#" * tokText
        	    push!(ctsdata, newLine)
			 end


        end

        # Only collect lines when we are inside a ctsdata block
        #=
        if in_data_block && occursin('#', line)
            urn, text = split(line, '#'; limit=2)
            push!(data, (strip(urn), strip(text)))
        end
        =#
    end

    # -----------------------
    # Assemble the new CEX file
    # -----------------------

    # Version
    push!(data, "#!cexversion")
    push!(data, version_entry) 
    push!(data, "")

    # Library
    push!(data, "#!citelibrary")
    append!(data, lib_entries)
    push!(data, "")

    # Catalog
    push!(data, "#!ctscatalog")
    push!(data, "urn#citationScheme#groupName#workTitle#versionLabel#exemplarLabel#online#lang ")
    append!(data, cat_entries)
    push!(data, "")

     # CTS Data
    push!(data, "#!ctsdata")
    append!(data, ctsdata)
    push!(data, "")
    push!(data, "// end")

    return data
end


input_path = "cex/luke_web.cex"
output_path = "cex/luke_web_tokenized.cex"
newcex = tokenize_cex(input_path)

open(output_path, "w") do io
	for line in newcex
		println(io, line)
	end
end

