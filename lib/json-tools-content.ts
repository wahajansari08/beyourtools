/**
 * Per-tool content for all 31 JSON tools.
 * Provides: how-to steps, FAQs, tagline, and keywords used by ToolLayout
 * to render the "How to use" section, FAQ section, and JSON-LD schemas.
 */

export interface HowToStep {
  title: string;
  text: string;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface JsonPairGuide {
  /** What the conversion is for, in the user's terms */
  intro: string;
  /** How the source structure maps onto the target structure */
  structureNote: string;
  /** Good reasons to convert */
  whenTo: string[];
  /** Cases where converting is the wrong move */
  whenNotTo: string[];
  /** The single gotcha most likely to surprise users */
  gotcha: string;
}

export interface JsonToolContent {
  /** Short descriptive tagline used in OG and schema description */
  tagline: string;
  /** SEO keywords */
  keywords: string;
  /** Numbered how-to steps shown below the tool UI */
  howTo: HowToStep[];
  /** 4-6 unique FAQs specific to this tool */
  faqs: ToolFAQ[];
  /** Pair-specific conversion guide, rendered by ToolLayout instead of the generic standards box */
  pairGuide?: JsonPairGuide;
}

const content: Record<string, JsonToolContent> = {

  // ─── Format & Validate ────────────────────────────────────────────────────

  "json-formatter": {
    tagline: "Paste minified or messy JSON and get a clean, indented version instantly with 2-space, 4-space, or tab indentation. Switch to Tree view to explore nested structures, upload .json files, and pick up where you left off - your input is autosaved in this browser.",
    keywords: "JSON formatter, JSON pretty print, format JSON online, JSON beautifier, JSON indentation, pretty JSON, JSON tree viewer",
    howTo: [
      { title: "Paste or upload your JSON", text: "Paste raw, minified, or messy JSON into the input panel, or upload a .json file from your device." },
      { title: "Choose indent style", text: "Select 2 spaces, 4 spaces, or tab from the toolbar - or leave the default. Toggle key sorting to order keys A-Z." },
      { title: "View the result", text: "The formatted JSON appears instantly in the output panel on the right." },
      { title: "Explore the tree", text: "Switch to Tree view to collapse and expand nested objects and arrays when the document is too large to scan." },
      { title: "Copy or download", text: "Click Copy to copy to clipboard, or Download to save as a .json file. Your input is autosaved locally, so a refresh never loses it." },
    ],
    faqs: [
      { question: "What is JSON formatting?", answer: "JSON formatting (pretty-printing) adds consistent indentation and newlines to make JSON human-readable. Minified JSON is identical in data content but has all whitespace removed to reduce file size." },
      { question: "Does this formatter change my data?", answer: "No. Formatting only adds whitespace characters. All keys, values, order, and structure are preserved exactly. You can safely format and re-minify without any data loss." },
      { question: "Can I format invalid JSON?", answer: "No. JSON must be syntactically valid before it can be formatted. If your JSON is broken, use the JSON Repair tool first, then format the fixed output." },
      { question: "What is the maximum JSON size I can format?", answer: "The formatter runs entirely in your browser. In practice it handles JSON up to tens of megabytes on modern devices. Very large files may cause a brief delay while the browser processes the text." },
      { question: "Is there a difference between JSON Formatter and JSON Beautifier?", answer: "They do the same thing: add indentation to make JSON readable. The Beautifier tool on this site provides the same core functionality with a slightly different interface layout." },
      { question: "Is the JSON formatter free? Do I need an account?", answer: "Yes, it's completely free with no account, no sign-up, and no usage limits. Your JSON is processed entirely in your browser, so nothing is ever uploaded or stored." },
      { question: "Does formatting change the order of my keys?", answer: "No, not by default. Keys stay in their original order. If you want alphabetical order, turn on the key-sorting toggle in the toolbar, which reorders keys A to Z before formatting." },
      { question: "Can I format JSON with tabs instead of spaces?", answer: "Yes. The toolbar offers 2 spaces, 4 spaces, or tab indentation, so you can match the style of the codebase the JSON came from. Changing indentation only changes whitespace, never the data." },
      { question: "Why use Tree view on a large JSON file?", answer: "Tree view collapses nested objects and arrays, so you can scan the top-level structure of a large document without scrolling through thousands of lines. Expand only the branch you need, then switch back to the formatted view to copy or download." },
    ],
  },

  "json-beautifier": {
    tagline: "Clean up compact or poorly structured JSON into a neatly indented, easy-to-read format.",
    keywords: "JSON beautifier, beautify JSON, JSON pretty printer, format JSON, readable JSON",
    howTo: [
      { title: "Paste or type JSON", text: "Enter your JSON in the input area - minified, partially formatted, or completely raw." },
      { title: "Select indent size", text: "Indentation is fixed at 2 spaces, the most common convention and the output of JSON.stringify with an indent of 2. If you need 4 spaces or tabs, use the JSON Formatter, which offers the choice." },
      { title: "Read the output", text: "The beautified JSON appears immediately with every key and value on its own line." },
      { title: "Copy the result", text: "Use the Copy button to copy the output to your clipboard." },
    ],
    faqs: [
      { question: "What does 'beautify' mean for JSON?", answer: "Beautifying JSON means adding consistent indentation, line breaks, and spacing so the structure is easy to read at a glance. It is the opposite of minification, which removes all such whitespace." },
      { question: "Does beautifying affect JSON parsing?", answer: "No. A JSON parser treats whitespace as insignificant. A beautified and a minified version of the same JSON are semantically identical and parse to the same data structure." },
      { question: "Can I paste JSON from a browser network tab?", answer: "Yes. JSON copied directly from browser DevTools network responses is often compact or partially formatted. Paste it here and it becomes fully readable immediately." },
      { question: "Does it work with JSON arrays?", answer: "Yes. Both JSON objects (curly braces) and JSON arrays (square brackets) are formatted correctly, including deeply nested combinations of both." },
      { question: "What does the Sort keys toggle do?", answer: "It reorders every object's keys from A to Z before beautifying, so two versions of the same data come out in the same order and are easy to diff. It is off by default, so your keys stay in their original order unless you turn it on. Sorting never changes values, only the order keys are written in." },
      { question: "Can I download the beautified JSON?", answer: "Yes. The Download button saves the output as beautified.json, ready to paste into a config file, a test fixture, or a code editor. The file contains the same 2-space indented JSON shown in the output panel." },
      { question: "What is the difference between the Beautifier and the JSON Formatter?", answer: "They do the same core job: re-indent JSON so it is readable. The Beautifier is the simpler tool, with a fixed 2-space indent and a Sort keys toggle. The Formatter adds the indent choice (2 spaces, 4 spaces, or tab), a Tree view for exploring large documents, .json file upload, and autosave, so your input survives a refresh. Use the Beautifier for a quick cleanup and the Formatter when you are working with a large file." },
    ],
  },

  "json-validator": {
    tagline: "Check whether your JSON is syntactically valid with the exact line and column of any error pinpointed.",
    keywords: "JSON validator, validate JSON online, JSON syntax checker, JSON error checker, invalid JSON, JSON lint",
    howTo: [
      { title: "Paste your JSON", text: "Paste the JSON you want to check into the input area." },
      { title: "Validation runs instantly", text: "The validator checks your JSON as you type or paste - no button press needed." },
      { title: "Read the result", text: "If valid, you see a green confirmation. If invalid, the exact line, column, and error message are shown." },
      { title: "Fix the errors", text: "Use the reported line and column to find the issue, or paste into JSON Repair for automated fixing." },
    ],
    faqs: [
      { question: "What makes JSON invalid?", answer: "Common causes include: trailing commas after the last item in an object or array, single-quoted strings instead of double-quoted, unquoted keys, missing commas between items, incorrect nesting of brackets or braces, and unescaped control characters in strings." },
      { question: "Does this validator support JSON5 or JSONC?", answer: "No. This tool validates strict JSON per RFC 8259. JSON5 (which allows comments and trailing commas) and JSONC (JSON with Comments) are not valid JSON. Use JSON Repair to strip those extensions and produce valid JSON." },
      { question: "Can I validate a JSON Schema file?", answer: "A JSON Schema file is just a JSON document. The JSON Validator checks that it is syntactically valid JSON. To validate the schema itself against the JSON Schema specification, use the JSON Schema Validator tool." },
      { question: "Is there a size limit?", answer: "The validator runs in your browser with no upload. You can validate JSON files of any size, though very large files may take a moment to process." },
      { question: "Why does my JSON show as invalid when it looks correct?", answer: "Check for: a trailing comma after the last property in an object or array, a key without quotes, a value using undefined or a JavaScript function, or a BOM (byte order mark) at the start of the text. Copy the error line number to find the exact issue." },
      { question: "How do I read the line and column in the error message?", answer: "When the browser's parser reports a character position, the error is shown with the matching line and column, for example (line 42, column 17). That is where the parser first noticed something it could not understand, which is not always where the mistake is: a missing closing quote or bracket is often reported a line or two later, at the first character that no longer makes sense. If the flagged line looks fine, check the line immediately above it." },
      { question: "Can I validate a JSON file instead of pasting text?", answer: "Yes. Use the file upload button above the input to load a .json file from your device. The file is read in your browser and never uploaded, and validation runs on its contents exactly as if you had pasted them." },
      { question: "What does the valid confirmation tell me about my document?", answer: "As well as confirming the JSON is valid, the banner describes what it found: an object with its key count, an array with its item count, or the type of a bare value. That is a quick sanity check that the file you pasted is the document you expected, and not, for example, a single string or an empty object." },
    ],
  },

  "json-minifier": {
    tagline: "Strip all whitespace from JSON to produce the smallest possible file for API responses and data transfer.",
    keywords: "JSON minifier, minify JSON, compress JSON, JSON whitespace remover, JSON compact, shrink JSON",
    howTo: [
      { title: "Paste formatted JSON", text: "Paste your indented or pretty-printed JSON into the input area." },
      { title: "Minified output appears instantly", text: "The output panel shows the compact single-line version with all whitespace removed." },
      { title: "Copy or download", text: "Copy the minified JSON to use in your code, config file, or API request payload." },
    ],
    faqs: [
      { question: "What does JSON minification do?", answer: "Minification removes all whitespace characters (spaces, tabs, newlines) that are not inside string values. The resulting JSON is identical in data content but takes up less space, which reduces network payload size and parse time." },
      { question: "How much smaller does minified JSON get?", answer: "Depending on how heavily indented the original is, minification typically reduces JSON size by 20-40%. For deeply nested objects with 4-space indentation, savings can reach 50%." },
      { question: "Does minification remove comments?", answer: "Standard JSON does not allow comments, so a valid JSON file will not have any. If your JSON has comments (JSONC style), they must be stripped first using JSON Repair before minifying." },
      { question: "Will minified JSON still parse correctly?", answer: "Yes. Every JSON parser correctly handles minified JSON. Whitespace outside of string values is always optional in the JSON specification." },
      { question: "How much does minifying actually save on a real file?", answer: "It depends on the indentation, but the saving is usually large. As a measured example, a 50-order payload with nested customer and line-item data was 18,784 bytes pretty-printed with 2-space indentation and 9,172 bytes minified, a saving of 51 percent. The tool reports the exact saving for your file after each run, as bytes saved and a percentage." },
      { question: "Does minifying still help if the file is gzipped afterwards?", answer: "Much less than people expect. Gzip already collapses repeated whitespace very efficiently, so on the same 50-order payload, the pretty-printed version gzipped to 718 bytes and the minified version to 595 bytes, only about 17 percent smaller. Minify for the uncompressed size, for parse speed, and for pasting into places with size limits, not because it shrinks a gzipped response much further." },
      { question: "Can minification change the text inside my strings?", answer: "No. Whitespace inside a string value is part of the data, so it is never touched. Only the whitespace between tokens, the indentation and line breaks outside strings, is removed. A string that contains spaces, newlines, or tabs comes out byte for byte identical." },
    ],
  },

  "json-viewer": {
    tagline: "Explore JSON as an interactive collapsible tree - expand and collapse nodes to navigate any structure.",
    keywords: "JSON viewer, JSON tree viewer, JSON explorer, visualise JSON, JSON tree, JSON inspector, interactive JSON",
    howTo: [
      { title: "Paste your JSON", text: "Paste any valid JSON - object, array, or primitive - into the input." },
      { title: "Explore the tree", text: "The JSON renders as a collapsible tree. Click any node with children to expand or collapse it." },
      { title: "Inspect values", text: "Leaf values (strings, numbers, booleans, null) are shown with type-coloured labels." },
      { title: "Collapse what you do not need", text: "Click any object or array to collapse it; a collapsed node shows how many items it holds. The first two levels start open, deeper nodes start collapsed." },
    ],
    faqs: [
      { question: "What is a JSON tree viewer?", answer: "A JSON tree viewer renders JSON as a hierarchical tree of expandable nodes, similar to the view you see in browser DevTools. It makes deeply nested structures much easier to navigate than reading raw text." },
      { question: "Can I edit values in the viewer?", answer: "The viewer is read-only for exploration. To edit JSON, use the JSON Editor tool which provides a side-by-side tree editor and text input." },
      { question: "Does it work with very large JSON files?", answer: "The viewer loads the entire JSON into the browser. For very large files (over a few MB), rendering all nodes at once may be slow. Collapsing top-level nodes first and then expanding what you need is the most efficient approach." },
      { question: "Are circular references supported?", answer: "Circular references are not valid JSON (JSON must be serialisable), so any valid JSON file will not contain them. The viewer handles all valid JSON structures." },
      { question: "How much of the tree is open when I paste JSON?", answer: "The first two levels start open and everything deeper starts collapsed, so a large document opens as a readable outline instead of thousands of lines. Click any object or array to expand or collapse it, and a collapsed node shows its item count so you know what is inside before you open it." },
      { question: "What do the different colours in the tree mean?", answer: "Leaf values are coloured by type so you can scan a large document at a glance: strings in the accent colour, numbers in teal, booleans in coral, and null in a muted tone. Keys and structure stay in the regular text colour, so the values stand out against the shape of the document." },
      { question: "What happens if I paste invalid JSON into the viewer?", answer: "No tree is shown. The viewer reports the parse error with its line and column, the same error the JSON Validator produces, so you can fix the problem first. Paste the broken text into JSON Repair if you want it fixed automatically, then bring the repaired output back here to explore it." },
    ],
  },

  "json-editor": {
    tagline: "Edit JSON with a live side-by-side tree preview - changes in the text sync instantly to the tree view.",
    keywords: "JSON editor, online JSON editor, edit JSON, JSON tree editor, JSON live editor, JSON code editor",
    howTo: [
      { title: "Open or paste JSON", text: "Paste existing JSON into the text panel, or start typing a new JSON document." },
      { title: "Edit in text or tree view", text: "Edit directly in the text panel. The tree view updates as you type. Expand or collapse nodes in the tree to explore the structure." },
      { title: "Fix errors inline", text: "Syntax errors are highlighted as you type so you can fix them before saving." },
      { title: "Copy the edited JSON", text: "When done, copy the JSON from the text panel or download it as a file." },
    ],
    faqs: [
      { question: "What makes this different from a plain text editor?", answer: "The JSON Editor shows a live tree view alongside your text input. As you type, the tree updates in real time, making it easy to see the structure without manually tracing brackets. Syntax errors are also highlighted inline." },
      { question: "Can I add or delete keys in the tree view?", answer: "The tree view is primarily for navigation and inspection. For editing, use the text panel. Changes made in text are immediately reflected in the tree." },
      { question: "Does it support JSON Schema validation while editing?", answer: "For schema-based validation as you type, use the JSON Schema Validator tool and provide both the JSON and the schema separately." },
      { question: "Is my JSON saved anywhere?", answer: "No. Everything runs in your browser. Nothing is sent to any server. When you close the tab, the JSON is gone unless you copy or download it first." },
      { question: "Can I open a JSON file instead of pasting?", answer: "Yes. The upload button in the editor toolbar loads a file from your computer straight into the editor, so you can edit a saved document without copying and pasting its contents." },
      { question: "What happens when my JSON is invalid?", answer: "The tree preview disappears and an error banner shows the parser's message, including where it noticed the problem. Fix the text in the editor and the tree returns as soon as the JSON parses again." },
      { question: "How do I save the edited JSON?", answer: "Use the Download button in the Live preview panel. It saves the current text as data.json. The Copy button in the editor toolbar copies the same text to your clipboard instead." },
    ],
  },

  "json-repair": {
    tagline: "Automatically fix common JSON errors - trailing commas, single quotes, missing quotes, and more.",
    keywords: "JSON repair, fix JSON, broken JSON, JSON fixer, invalid JSON repair, JSON auto fix, correct JSON errors",
    howTo: [
      { title: "Paste broken JSON", text: "Paste the invalid JSON - it can have trailing commas, single-quoted strings, unquoted keys, or other common issues." },
      { title: "Click Repair", text: "The tool analyses the JSON and applies targeted fixes to produce valid JSON output." },
      { title: "Review the result", text: "Check the repaired JSON in the output panel. The changes applied are listed so you know what was fixed." },
      { title: "Copy the fixed JSON", text: "Copy the repaired JSON and use it in your project." },
    ],
    faqs: [
      { question: "What types of JSON errors can be repaired?", answer: "JSON Repair handles: trailing commas after the last item in objects or arrays, single-quoted strings (converted to double-quoted), unquoted object keys (double quotes added), // line comments and /* */ block comments (stripped out), and undefined, NaN, and Infinity values (replaced with null). It does not insert missing commas or rebuild truncated JSON, so a document with those problems will still fail after repair." },
      { question: "Can it repair completely garbled JSON?", answer: "The repair tool works best on JSON that has common human or tool-introduced errors. Fundamentally garbled or corrupted text (such as binary data labelled as JSON) cannot be repaired, as there is no correct structure to recover." },
      { question: "Does repair change my data values?", answer: "No, with one exception. Repair only fixes structural and syntax issues: punctuation, quote types, comments, and bracket matching. Your key names, string values, numbers, and booleans are not modified. The exception is undefined, NaN, and Infinity values, which are not valid JSON and are replaced with null." },
      { question: "Is JSON5 or JavaScript object syntax supported as input?", answer: "JSON Repair can handle several JS-style patterns (unquoted keys, single quotes, trailing commas, comments) that are common when copying from JS source files. Full JSON5 is not supported: hex numbers, multiline strings, and other JSON5-only features are not handled and will still fail." },
      { question: "What does the Fixed line tell me?", answer: "After a successful repair the tool lists each fix it applied by name, for example \"Removed trailing commas\" or \"Converted single quotes to double quotes\", so you can see exactly what changed before you trust the output." },
      { question: "What happens if my JSON was already valid?", answer: "The tool says so plainly: \"This JSON was already valid - no fixes needed.\" It returns the document pretty-printed with a 2-space indent, so you still get a clean formatted copy." },
      { question: "What happens when repair cannot fix my JSON?", answer: "You get a \"Could not fully repair\" message with the parser's error, and the output panel shows the partially fixed text, so you can see how far the repair got and finish the job by hand instead of starting over." },
    ],
  },

  "jsonl-formatter": {
    tagline: "Pretty-print each line of a JSONL (JSON Lines) file into readable indented JSON while keeping lines separate.",
    keywords: "JSONL formatter, JSON Lines formatter, NDJSON formatter, format JSONL, pretty print JSONL",
    howTo: [
      { title: "Paste your JSONL", text: "Paste a JSONL file where each line is a separate JSON value. Mixed-format files work too." },
      { title: "Indentation is fixed at 2 spaces", text: "Each line is formatted with a fixed 2-space indent. There is no indent setting on this tool; use the JSON Formatter if you need 2 spaces, 4 spaces, or tabs." },
      { title: "View formatted output", text: "Each line is formatted into its own indented JSON block, separated by blank lines for readability." },
      { title: "Copy or download", text: "Copy the formatted output or download it as a .jsonl file." },
    ],
    faqs: [
      { question: "What is JSONL (JSON Lines)?", answer: "JSONL (also called NDJSON - Newline Delimited JSON) is a format where each line of a file contains a complete, independent JSON value. It is popular for log files, data streaming, and large datasets because each line can be read and parsed independently without loading the whole file." },
      { question: "Is JSONL the same as a JSON array?", answer: "No. A JSON array is a single JSON document containing multiple values in brackets. JSONL is a sequence of completely separate JSON values, one per line, with no surrounding brackets." },
      { question: "Can I format only some lines?", answer: "No. The formatter processes every line. A line that is not valid JSON is left out of the output and reported as an error naming its line number, so you can fix it and run the file again. Valid lines are always formatted." },
      { question: "What happens with empty lines in the input?", answer: "Empty lines are skipped, not preserved: they do not appear in the output. Line numbers in error messages still match the original input, so \"Line 7\" is line 7 of what you pasted, blank lines included." },
      { question: "What indent does the formatter use?", answer: "A fixed 2-space indent for every line. There is no indent setting on this tool. If you need 4 spaces or tabs, format the document with the JSON Formatter instead, which offers the choice." },
      { question: "What happens to a line that is not valid JSON?", answer: "It is left out of the output and listed in the error area as \"Line N\" with the parser's message. The valid lines still format normally, so you can fix the broken line and run the file again without losing the rest." },
      { question: "Can I upload a JSONL file instead of pasting?", answer: "Yes. The upload button accepts .jsonl, .txt, and .json files, and the formatted output downloads as formatted.jsonl." },
    ],
  },

  "jsonl-validator": {
    tagline: "Validate every line of a JSONL file independently and get the exact line number of each error.",
    keywords: "JSONL validator, validate JSONL, JSON Lines validator, NDJSON validator, JSONL error checker, validate each JSON line",
    howTo: [
      { title: "Paste your JSONL", text: "Paste the JSONL content - each line should be a valid, complete JSON value." },
      { title: "Validation runs per line", text: "Every non-empty line is validated as independent JSON. Results appear line by line." },
      { title: "Review errors", text: "Any invalid lines are highlighted with their line number and a specific error message." },
      { title: "Fix and re-validate", text: "Results update live as you type, so fix an invalid line in the input and its row updates immediately. There is nothing to re-run." },
    ],
    faqs: [
      { question: "How is JSONL validation different from JSON validation?", answer: "A JSON validator checks one document at a time. A JSONL validator checks each line of the file as an independent JSON document. A single invalid line does not invalidate the rest of the file." },
      { question: "What counts as a valid JSONL line?", answer: "Any complete, valid JSON value on a single line: an object, array, string, number, boolean, or null. The line must be syntactically complete - partial JSON is not valid in JSONL format." },
      { question: "Are blank lines allowed in JSONL?", answer: "Blank lines are technically not part of the JSONL specification but most parsers skip them. The validator ignores blank lines and only checks non-empty lines." },
      { question: "Can I use this to validate log files?", answer: "Yes. Application logs in JSONL format can be pasted directly. The validator identifies which log lines have malformed JSON, which is useful for debugging logging pipelines." },
      { question: "Does a line have to be an object to be valid?", answer: "No. Any complete JSON value counts as a valid line: an object, an array, a string, a number, a boolean, or null. A line holding just 42, or just \"hello\", passes validation." },
      { question: "Do the line numbers match my file?", answer: "Yes. Blank lines are skipped from the results but the numbering follows the original file, so a row marked \"Line 7\" is line 7 of what you pasted, blank lines included." },
      { question: "Can I upload a JSONL file instead of pasting?", answer: "Yes. The upload button accepts .jsonl, .txt, and .json files, and the results show one row per non-empty line with a summary of how many lines passed." },
    ],
  },

  // ─── Compare & Manipulate ─────────────────────────────────────────────────

  "json-diff": {
    tagline: "Compare two JSON documents side by side and see every addition, deletion, and change highlighted.",
    keywords: "JSON diff, JSON compare, JSON difference, compare JSON files, JSON delta, JSON changes, JSON comparison tool",
    howTo: [
      { title: "Paste the original JSON", text: "Enter the original (base) JSON in the left panel." },
      { title: "Paste the modified JSON", text: "Enter the modified JSON in the right panel." },
      { title: "Click Compare", text: "The diff runs and lists every difference as its own row with its path, such as $.user.age: + for added, - for removed, and ~ for changed, with a counts header on top." },
      { title: "Review changes", text: "Scroll through the highlighted diff to find every difference between the two documents." },
    ],
    faqs: [
      { question: "Does JSON Diff care about key order?", answer: "No. JSON objects are unordered by definition. The diff compares values by key name, not position. Reordered keys with identical values show no difference." },
      { question: "Does it diff nested objects and arrays?", answer: "Yes. The diff is recursive and descends into nested objects and arrays. Changes deep in the structure are highlighted exactly where they occur." },
      { question: "What does the diff show for array changes?", answer: "Array items are compared positionally - item 0 is compared with item 0, item 1 with item 1, etc. If an item is inserted or removed, all subsequent items will show as changed. For semantic array diffs, key-based comparison on an object property may be more useful." },
      { question: "Can I diff API responses?", answer: "Yes. Copy a JSON response from your browser DevTools Network tab and paste it into each panel. This is a common use case for verifying that a code change did not unexpectedly alter an API response." },
      { question: "Is there a size limit?", answer: "The diff runs entirely in your browser. Large JSON files work but may take a few seconds for the diffing algorithm to complete. For very large files (over a few MB), consider diffing a representative sample first." },
      { question: "What does the output look like?", answer: "A flat list of differences, one row per difference, each with its JSON path, such as $.user.age or $.tags[2]. Added rows are marked +, removed rows -, and changed rows ~ with the old value and the new value shown side by side. A counts header totals the added, removed, and changed rows. If the two documents are identical, the tool says so plainly instead of showing an empty list." },
      { question: "What happens if one side is not valid JSON?", answer: "An error banner shows the parser's message and no diff is produced. Fix the JSON in that panel and the diff appears as soon as both sides parse." },
      { question: "If a whole object is added, do I see one row or many?", answer: "One row. A key that exists on only one side is reported once, with the whole value shown, rather than one row per nested key. You see the added object as a single addition at its path." },
    ],
  },

  "json-sorter": {
    tagline: "Sort all object keys alphabetically throughout an entire JSON document, including nested objects.",
    keywords: "JSON sorter, sort JSON keys, alphabetical JSON, JSON key sort, order JSON keys, JSON normaliser",
    howTo: [
      { title: "Paste your JSON", text: "Paste the JSON object or array you want to sort." },
      { title: "Choose sort direction", text: "Select ascending (A-Z) or descending (Z-A) key ordering." },
      { title: "See the sorted result", text: "The sorted JSON appears automatically as you type, with every nested object sorted too." },
      { title: "Copy the sorted JSON", text: "Copy the result to use in your project or version control." },
    ],
    faqs: [
      { question: "Why would I sort JSON keys?", answer: "Sorted keys make JSON easier to scan visually, simplify manual comparison between documents, and produce consistent output for version control diffs - two JSON objects with the same data but different key order will show as identical in a diff after sorting." },
      { question: "Does sorting change the data?", answer: "No. JSON object keys are semantically unordered, so reordering them does not change what the JSON represents. All values remain associated with their correct keys." },
      { question: "Are arrays sorted?", answer: "Array items are not sorted - their order is meaningful and preserved. Only object keys (property names) are alphabetically reordered. If you need array items sorted, that requires a more specialised tool." },
      { question: "Does it sort nested objects too?", answer: "Yes. The sort is applied recursively throughout the entire document, including objects nested inside arrays or other objects." },
      { question: "How are uppercase and lowercase keys ordered?", answer: "Letters are grouped together ignoring case, so a sorts before A, and both sort before b. In a test, {\"b\":1,\"A\":2,\"a\":3,\"Z\":4} sorted to a, A, b, Z. That is different from strict code-point order, where all capitals come first, so if you need that order, sort in code instead, for example with jq -S or Python json.dumps with sort_keys." },
      { question: "Does sorting keep my original formatting?", answer: "No. The tool parses your JSON and prints the sorted result with two-space indentation, so your original line breaks and spacing are replaced. The data itself is unchanged, only the layout. If you need your exact formatting kept, sort the keys in your editor or with a script instead." },
      { question: "What happens if my JSON is invalid?", answer: "The output stays empty and an error banner shows the parser's message, such as where the JSON broke. Fix the error in the input and the sorted result appears as soon as the JSON parses." },
    ],
  },

  "json-merge": {
    tagline: "Deep-merge two JSON objects into one - nested objects are combined, with the second taking precedence on conflicts.",
    keywords: "JSON merge, merge JSON objects, deep merge JSON, combine JSON, JSON object merge, JSON union",
    howTo: [
      { title: "Paste the base JSON", text: "Enter the first (base) JSON object in the left panel." },
      { title: "Paste the override JSON", text: "Enter the second JSON object whose values will take precedence on any key conflict." },
      { title: "See the merged result", text: "The merged JSON updates automatically as you type in either panel." },
      { title: "Copy the merged result", text: "Copy the merged JSON to use in your code or configuration." },
    ],
    faqs: [
      { question: "What is a deep merge?", answer: "A deep merge combines two objects recursively. When both objects share a key that contains another object, the nested objects are merged too rather than one replacing the other. A shallow merge would simply overwrite the nested object entirely." },
      { question: "What happens when both objects have the same key?", answer: "The second object's value wins. If both values are objects, they are recursively merged. If either value is a primitive, array, or null, the second value replaces the first." },
      { question: "How are arrays merged?", answer: "Arrays are replaced, not merged element-by-element. If both objects have the same key containing an array, the second object's array completely replaces the first. Array concatenation is not performed automatically." },
      { question: "Can I merge more than two objects?", answer: "The tool merges two objects at a time. To merge three or more objects, merge the first two, then paste the result as the base and merge with the third object." },
      { question: "What happens if one side sets a value to null?", answer: "Null is treated as a real value, not as an instruction to delete the key. If the override sets a key to null, the merged result has null there, even if the base had an object. If the base has null and the override has an object, the object wins. To remove a key, delete it from the base before merging." },
      { question: "Can I merge two JSON arrays?", answer: "No. Arrays are replaced, never joined: merging [1,2] with [3] gives [3], and the same applies to arrays under a shared key. If you need the items combined, join the arrays yourself first, or use jq -s add on the command line." },
      { question: "Does merging with an empty object change anything?", answer: "No. Merging {\"a\":{\"x\":1}} with {\"a\":{}} leaves the base exactly as it was, because there is nothing new to add and no conflict to resolve. That makes it safe to merge a config that may be empty, for example a defaults file with no overrides yet." },
    ],
  },

  "json-flatten": {
    tagline: "Flatten nested JSON to dot-path key-value pairs, or rebuild flat JSON back into nested structure.",
    keywords: "JSON flatten, flatten JSON, JSON to flat, dot notation JSON, JSON unflatten, nested JSON to flat, JSON path flatten",
    howTo: [
      { title: "Paste nested JSON", text: "Paste a JSON object with any level of nesting." },
      { title: "Choose Flatten or Unflatten", text: "Select Flatten to collapse to dot-path pairs, or Unflatten to rebuild nested structure from flat keys." },
      { title: "View the result", text: "The output shows the transformed JSON." },
      { title: "Copy the result", text: "Copy the flattened or unflattened JSON for use in your project." },
    ],
    faqs: [
      { question: "What does flattening JSON mean?", answer: 'Flattening converts nested JSON like {"a":{"b":{"c":1}}} into a flat object with dot-path keys like {"a.b.c":1}. Every value in the original, no matter how deeply nested, becomes a key at the top level with its full path as the key name.' },
      { question: "What is unflattening?", answer: "Unflattening is the reverse: it takes a flat object with dot-path keys and rebuilds the nested structure. It is the inverse operation of flattening." },
      { question: "What separator is used in the flattened keys?", answer: "The tool always uses a dot (.) as the separator, producing keys like user.address.city. There is no separator setting in this tool. If you need slashes or underscores, use the flat npm package, which lets you pick the separator, or rename the keys after flattening." },
      { question: "How are arrays handled during flattening?", answer: "Array indices become part of the path. For example, {\"items\":[{\"id\":1}]} flattens to {\"items.0.id\":1}. Unflattening correctly reconstructs arrays from numeric indices in the path." },
      { question: "What happens to empty objects and arrays when flattening?", answer: "They are kept, but they have no leaf values to turn into paths. A nested empty object keeps its own path, so {\"a\":{}} flattens to {\"a\":{}}. An empty object or array at the top level becomes a single \"$\" key, so {} flattens to {\"$\":{}}." },
      { question: "What happens to null values when flattening?", answer: "Null is kept as a leaf value, so {\"a\":null} flattens to {\"a\":null}. It is not dropped, and the tool does not try to look inside it. Unflattening restores it as null." },
      { question: "Can I flatten JSON and get the exact original back?", answer: "Usually yes for ordinary data: flattening then unflattening restores nested objects and arrays, including array order. The exception is keys that already contain dots. {\"a.b\":1} and {\"a\":{\"b\":1}} flatten to the same thing, so unflattening turns both into the nested form. Keep your original JSON if your keys contain dots." },
    ],
  },

  "jsonpath-tester": {
    tagline: "Run JSONPath expressions against any JSON document and see every match with its path, live as you type.",
    keywords: "JSONPath tester, JSONPath online, test JSONPath, JSONPath query, JSONPath expression, JSON query tool, JSONPath evaluator",
    howTo: [
      { title: "Paste your JSON", text: "Enter the JSON document you want to query in the input panel." },
      { title: "Type a JSONPath expression", text: "Enter a JSONPath expression in the query field, for example $.users[*].email or $.store.book[?(@.price < 10)]." },
      { title: "See the results", text: "Each match is listed in the results panel with its full path, such as $.store.books[0], above the matched value." },
      { title: "Refine your query", text: "Adjust the expression and results update instantly until you get the data you need." },
    ],
    faqs: [
      { question: "What is JSONPath?", answer: "JSONPath is a query language for JSON, analogous to XPath for XML. It lets you navigate and extract values from JSON using path expressions. It is widely used in APIs, testing tools, and configuration systems." },
      { question: "What JSONPath syntax is supported?", answer: "This tool uses its own small JSONPath engine, not a library such as jsonpath-plus, and it supports a subset: $ (root), . (child), .. (recursive descent), * (wildcard), [n] (array index, where a negative index counts from the end), ['key'] (quoted key), [start:end] (slice), [a,b] (union of indexes or keys), and filters [?(@.key == \"value\")], !=, > and <, plus an existence check [?(@.key)]. It does not support >=, <=, &&, ||, regular expressions, or function calls such as length()." },
      { question: "What does $..price return?", answer: "The .. operator is the recursive descent operator. $..price returns all values with the key 'price' anywhere in the document, regardless of depth." },
      { question: "Can I use filter expressions?", answer: 'Yes. Filter expressions use the [?(@.property operator value)] syntax. For example, $.books[?(@.price < 20)] returns all book objects where price is less than 20.' },
      { question: "Are results shown as a JSON array?", answer: "Not exactly. A single match is shown as the bare value, while two or more matches are shown as a JSON array of the matched values. Below the output, every match is also listed on its own with its full path, such as $.store.books[1]. If nothing matches, the panel says no matches were found." },
      { question: "Why does my filter return no matches?", answer: "The usual causes are an operator this tool does not support, such as >=, <= or &&, which quietly match nothing instead of showing an error, or a filter on a single object instead of an array, since filters only run over array items. String values in filters also need double quotes: [?(@.title == \"B\")] works, single quotes do not. Check the filter against one of the built-in examples to narrow it down." },
      { question: "How do I get the last item of an array?", answer: "Use a negative index: $.store.books[-1] returns the last book, and $.store.books[-1].title returns its title. Positive indexes count from the start, so [0] is the first item. Slices work the same way, for example $.store.books[0:2] returns the first two items." },
      { question: "What happens if my expression is wrong?", answer: "Expressions must start with $, and anything else shows an error message instead of results. Invalid JSON shows the parser's error the same way. A valid expression that matches nothing is not an error: the panel simply says no matches were found." },
    ],
  },

  // ─── Convert ──────────────────────────────────────────────────────────────

  "json-to-csv": {
    tagline: "Convert a JSON array of objects to a CSV file with auto-detected column headers.",
    keywords: "JSON to CSV, convert JSON to CSV, JSON array to CSV, JSON export CSV, JSON to spreadsheet, JSON to Excel CSV, nested JSON to CSV, JSON to CSV for Excel",
    howTo: [
      { title: "Paste a JSON array", text: "Paste a JSON array of objects - each object becomes a row in the CSV." },
      { title: "Review column headers", text: "Column headers are auto-detected from the union of object keys across all rows." },
      { title: "Click Convert", text: "The CSV output appears instantly with headers in the first row." },
      { title: "Copy or download", text: "Copy the CSV to paste into a spreadsheet, or download as a .csv file." },
    ],
    faqs: [
      { question: "What JSON structure is needed for CSV conversion?", answer: "The input should be a JSON array of objects, where each object has the same set of keys. For example: [{\"name\":\"Alice\",\"age\":30},{\"name\":\"Bob\",\"age\":25}]. Each object becomes one CSV row." },
      { question: "What happens with nested objects in the JSON?", answer: "A nested object or array is written as a JSON string inside a single cell, so {\"address\":{\"city\":\"London\"}} becomes the text {\"city\":\"London\"} in the address column, not a separate address.city column. To get real dotted columns, flatten the JSON first with the JSON Flatten tool, which turns the key into address.city before you convert." },
      { question: "Are different delimiters supported?", answer: "The tool outputs standard comma-separated values (CSV). If you need tab-separated (TSV) or semicolon-separated output for European locales, a delimiter option is available in the tool settings." },
      { question: "Can I convert a single JSON object instead of an array?", answer: "Yes. A single object becomes one data row under headers taken from its keys, so {\"name\":\"Ada\",\"age\":30} becomes the header row name,age followed by the row Ada,30. For a multi-row table, pass an array of objects instead." },
      { question: "What happens to rows that are missing a key?", answer: "CSV is a flat table, so every row needs the same columns. When one record has a key that another lacks, the missing cell is left empty in that row, and the column still appears because another record has it. If your data is ragged, normalise the keys first or accept empty cells in the output." },
      { question: "How do I stop Excel garbling special characters in my CSV?", answer: "Save or open the CSV as UTF-8. Excel on Windows sometimes reads a plain CSV as a legacy encoding, which mangles accented characters and symbols. Opening the file through the Text Import wizard and choosing UTF-8, or pasting into Google Sheets, avoids the problem." },
      { question: "Why do some of my values need quotes in the CSV?", answer: "Under RFC 4180, any value containing a comma, a double quote or a line break must be wrapped in double quotes, with inner quotes doubled. That is how a spreadsheet knows the comma inside \"Smith, John\" is part of the value and not a column separator." },
      { question: "Which delimiter should I choose: comma, semicolon, or tab?", answer: "Comma is the default and the safest choice for most tools. Choose semicolon if your data uses commas as decimal separators, which is common in European locales, or if the receiving program expects it. Choose tab for TSV output. The delimiter control sits in the toolbar above the converter, and quoted values are escaped the same way for all three." },
      { question: "Why does 59.0 show as 59 in my CSV?", answer: "Because JSON numbers carry no fixed decimal places: 59.0 and 59 are the same JSON number, so the CSV writes 59. The value is unchanged, only the trailing zero is gone. If a spreadsheet must display two decimals, format the column there rather than expecting the CSV to carry the formatting." },
      { question: "What happens to null values in my JSON?", answer: "A null value becomes an empty cell, and so does a key missing from a row. There is no way to tell the two apart in the CSV afterwards, so if the distinction matters, replace nulls with an explicit placeholder such as n/a before converting, or keep the data in JSON." },
    ],
    pairGuide: {
      intro: "JSON to CSV is the step that turns API data into something a spreadsheet can open. APIs hand you nested objects and arrays; spreadsheets want flat rows and columns. This conversion flattens each object into one row, so a list of users, orders or products becomes a table you can sort, filter and chart without writing a script.",
      structureNote: "Each object in the JSON array becomes one CSV row, and each key becomes a column header. Nested objects and arrays are kept as a JSON string inside a single cell rather than split into columns, so flatten the JSON first if you need dotted columns such as address.city. A single JSON object converts to one data row under headers taken from its keys.",
      whenTo: [
        "Opening API data in Excel or Google Sheets for analysis",
        "Handing a data export to someone who does not code",
        "Preparing rows for import into a CRM, email tool or database",
        "Comparing or charting a list of records quickly",
      ],
      whenNotTo: [
        "When the nesting itself matters: CSV cannot represent deep trees faithfully",
        "For data with wildly different keys per record, where most cells end up empty",
        "When you need to round-trip back to identical JSON later",
      ],
      gotcha: "Watch for ragged records and quoted values. Rows missing a key get empty cells, and values containing commas must be quoted or the columns shift. Always spot-check the first few rows in a spreadsheet before trusting the whole file.",
    },
  },

  "csv-to-json": {
    tagline: "Convert a CSV file to a JSON array of objects. Every value stays a string, so codes such as 007 survive the trip unchanged.",
    keywords: "CSV to JSON, convert CSV to JSON, CSV to JSON array, CSV parser, spreadsheet to JSON, CSV converter, Excel to JSON, CSV quoted fields to JSON",
    howTo: [
      { title: "Paste your CSV", text: "Paste the CSV content - the first row should contain column headers." },
      { title: "Choose the delimiter", text: "Pick the delimiter your file uses: comma, tab, or semicolon, from the toolbar. Comma is the default." },
      { title: "Click Convert", text: "Each CSV row becomes a JSON object with property names from the header row." },
      { title: "Copy the JSON array", text: "Copy or download the resulting JSON array." },
    ],
    faqs: [
      { question: "What happens if my CSV has no headers?", answer: "The first row is always treated as the header row, so a file without headers would lose its first data row to the keys. Add a header row first, even a simple one such as col1,col2,col3, before pasting. There is no no-headers mode on this tool." },
      { question: "Are numbers and booleans auto-converted?", answer: "No. Every value in the output is a string, so 30 becomes \"30\" and true becomes \"true\". That is deliberate: it protects codes and identifiers from being rewritten. Parse numbers and booleans in whatever consumes the JSON next, or keep the data in CSV if the spreadsheet is the final destination." },
      { question: "Can I handle CSV with commas inside quoted fields?", answer: "Yes. The parser correctly handles RFC 4180 quoting - values containing commas, newlines, or double quotes are wrapped in double quotes in valid CSV and parsed correctly here." },
      { question: "What encoding does the converter support?", answer: "The converter handles UTF-8 encoded CSV, which covers most spreadsheet exports. For CSV with special characters, ensure your file is saved as UTF-8 before pasting." },
      { question: "Do codes like 007 or 01234 survive the conversion?", answer: "Yes, on this converter. Because every value stays a string, 007 arrives as \"007\" with its zeros intact. The danger is downstream: if the next program parses the JSON and infers types, it may turn \"007\" into the number 7. Keep code columns as strings all the way to their destination, and check them after any further conversion." },
      { question: "Why does splitting on commas break my CSV?", answer: "Because valid CSV allows commas inside quoted values, doubled quotes inside quoted values, and even line breaks inside a quoted cell. A naive split on every comma cuts those values in half. A real CSV parser respects the quoting rules in RFC 4180, which is why this converter parses rather than splits." },
      { question: "Should empty cells become empty strings or null?", answer: "It depends on what consumes the JSON. An empty string means the field was present but blank; null means it was absent or unknown. APIs that distinguish the two will behave differently, so check the target schema before deciding, and be consistent across rows." },
      { question: "Can I upload a .csv file instead of pasting?", answer: "Yes. The converter accepts .csv and .txt file uploads, so a large export does not need to be pasted by hand. The file is read in your browser and never uploaded anywhere." },
      { question: "What happens to empty cells?", answer: "An empty cell becomes an empty string in the JSON, and a row shorter than the header row gets empty strings for the missing columns. An empty string means the field was present but blank; if the target system needs null for missing values, replace the empty strings after converting." },
      { question: "What happens to commas and line breaks inside a quoted cell?", answer: "They are handled correctly. The parser follows RFC 4180 quoting, so a value wrapped in double quotes keeps its commas, doubled quotes, and even line breaks intact, and the surrounding quotes are removed. That is why a naive split on commas breaks real CSV files, and why this converter parses instead of splitting." },
    ],
    pairGuide: {
      intro: "CSV to JSON is the step that turns spreadsheet rows back into structured data an API or script can use. Each row becomes one JSON object, the header row becomes the property names, and the whole sheet becomes an array you can paste into code, a test fixture or an API payload.",
      structureNote: "The first row supplies the keys and every later row supplies the values, one object per row. Numbers, booleans and null are detected automatically, quoted fields are unwrapped according to RFC 4180, and the delimiter is detected from commas, tabs or semicolons. A CSV with no headers uses col1, col2 and so on as fallback keys.",
      whenTo: [
        "Feeding spreadsheet data into an API, script or test suite",
        "Turning an exported report into JSON for a web app",
        "Converting a data table into a config or seed file",
        "Cleaning up rows before importing them elsewhere",
      ],
      whenNotTo: [
        "When the CSV has merged cells, formulas or multiple tables: export a clean single table first",
        "For data where leading-zero codes matter and type detection is left unchecked",
        "When the sheet is really a document, not a table, with free-form notes mixed into rows",
      ],
      gotcha: "Type detection is the trap. Values like 007, 01234 and large numbers can be silently rewritten as numbers, and the word true can become a boolean. Scan the output for code-like columns before using it, and quote or retype any value that must stay a string.",
    },
  },

  "json-to-yaml": {
    tagline: "Convert JSON to clean, readable YAML with correct type handling and proper indentation.",
    keywords: "JSON to YAML, convert JSON to YAML, JSON YAML converter, JSON to YAML online, JSON2YAML, JSON to YAML for Kubernetes, JSON to Docker Compose YAML",
    howTo: [
      { title: "Paste your JSON", text: "Enter the JSON object or array you want to convert." },
      { title: "Click Convert", text: "The YAML output appears with proper indentation and human-friendly syntax." },
      { title: "Review types", text: "Numbers, booleans, and nulls are written without quotes in YAML. Strings that could be mistaken for other types are quoted automatically." },
      { title: "Copy the YAML", text: "Copy the YAML output to use in configuration files, CI/CD pipelines, or Kubernetes manifests." },
    ],
    faqs: [
      { question: "Does JSON to YAML preserve all data types?", answer: "Yes. Strings, numbers, booleans, null, objects, and arrays all round-trip correctly. Strings that look like numbers or booleans (e.g. \"true\" or \"1.0\") are quoted in the YAML output to prevent ambiguity." },
      { question: "Can I convert YAML back to JSON?", answer: "Yes. Use the YAML to JSON converter on this site to convert in the other direction." },
      { question: "What YAML version does the output use?", answer: "The output follows YAML 1.2, which is the most common version and is compatible with tools like Kubernetes, Docker Compose, and Ansible." },
      { question: "Why are some strings quoted in the YAML output?", answer: "YAML has many reserved keywords (yes, no, true, false, on, off, null, ~). Strings that match these keywords are quoted to ensure they are treated as strings and not YAML booleans or null values." },
      { question: "What does a real config look like in YAML versus JSON?", answer: "Take a small service definition: in JSON it is braces, brackets and quoted keys on every line. In YAML the same data is indented keys with no braces, which is why Docker Compose files, GitHub Actions workflows and Kubernetes manifests are written in YAML: humans edit them far more often than machines do." },
      { question: "Why does indentation matter so much in YAML?", answer: "Indentation is the structure. Two spaces per level is the convention, and tabs are not allowed as indentation in YAML at all. A single misaligned line either changes which object a key belongs to or breaks the file, so check the nesting after converting before committing a config." },
      { question: "What happens to a version string like 1.10 in YAML?", answer: "Left unquoted, a value like 1.10 can be read as the number 1.1, losing the trailing zero, and a value like 2026-01-05 can be read as a date. Strings that look like numbers, booleans or dates are quoted in the output for exactly this reason." },
      { question: "What happens to empty objects, arrays, and null values?", answer: "An empty object becomes {}, an empty array becomes [], and null becomes null, all written inline on their own lines. So {\"a\":{},\"b\":[],\"c\":null} converts to a: {}, b: [], and c: null. Empty containers carry no further structure, so a tool reading the YAML cannot infer what they would have held." },
      { question: "How do I use the YAML output in Docker Compose or Kubernetes?", answer: "Paste it into the compose file or manifest and check the indentation before applying it: two spaces per level, no tabs. Strings that look like numbers, booleans, or dates arrive quoted so they stay strings, which matters for values such as version 1.10. Validate the file with the target tool, for example docker compose config, before deploying it." },
      { question: "Does the converter keep my key order?", answer: "Yes. Keys stay in the order they appear in the JSON, so a sample written zebra, apple, mango comes out in that same order. JSON objects are unordered by specification, so do not rely on key order for meaning, but the output will not shuffle your keys." },
    ],
    pairGuide: {
      intro: "JSON to YAML is the step that turns machine-friendly data into human-friendly configuration. JSON is what APIs speak; YAML is what people edit. Converting a JSON payload into YAML makes it readable enough to use as a Kubernetes manifest, a Docker Compose file or a CI pipeline definition.",
      structureNote: "Objects become indented mappings, arrays become dash-prefixed sequences, and types carry over with one important change: strings that could be misread as numbers, booleans or dates are quoted so they survive as strings. Output follows YAML 1.2 with two-space indentation, and null is written as null rather than the YAML 1.1 tilde.",
      whenTo: [
        "Writing a Kubernetes, Docker Compose or Ansible config from API data",
        "Making a long JSON payload readable for review or editing",
        "Preparing example configuration for documentation",
        "Moving data into a tool that only accepts YAML",
      ],
      whenNotTo: [
        "For data exchanged between programs: JSON is safer, since YAML parsing varies by version",
        "When exact round-tripping matters and comments or key order must be preserved",
        "For large datasets, where YAML files become slow to parse and hard to scan",
      ],
      gotcha: "Quoting is not decoration. An unquoted yes, 1.10 or 2026-01-05 can be parsed as a boolean, a number or a date by the next tool in the chain. If a value must stay a string, keep the quotes the converter adds and do not strip them by hand.",
    },
  },

  "yaml-to-json": {
    tagline: "Convert YAML configuration or data files to valid JSON with correct type handling.",
    keywords: "YAML to JSON, convert YAML to JSON, YAML JSON converter, YAML to JSON online, YAML2JSON, parse YAML, Docker Compose YAML to JSON, GitHub Actions YAML to JSON",
    howTo: [
      { title: "Paste your YAML", text: "Paste a single YAML document. Multi-document files with --- separators are not supported: split them into separate documents first." },
      { title: "Click Convert", text: "The tool parses the YAML and outputs the equivalent JSON." },
      { title: "Review the result", text: "Check that types (especially booleans and nulls) converted as expected." },
      { title: "Copy the JSON", text: "Copy the JSON output to use in your code or tools." },
    ],
    faqs: [
      { question: "What YAML features are supported?", answer: "The converter handles the most common YAML features: nested mappings and sequences, multiline strings (block scalars), anchors and aliases, explicit type tags (!str, !int), and comments (which are stripped in the JSON output)." },
      { question: "What happens to YAML comments?", answer: "JSON does not support comments, so all YAML comments are stripped from the output. The data content is not affected." },
      { question: "Are YAML anchors and aliases supported?", answer: "Yes. YAML anchors (&name) and aliases (*name) are resolved before conversion. The resulting JSON contains the full expanded values, not references." },
      { question: "What happens with YAML's yes/no/on/off booleans?", answer: "In YAML 1.1, yes, no, on, off are booleans. In YAML 1.2 only true and false are booleans. The converter uses YAML 1.2 by default, treating yes and no as strings unless quoted." },
      { question: "What does not survive a YAML to JSON conversion?", answer: "Comments are stripped, because JSON has no comments. Anchors and aliases are expanded into full copies, not preserved as references. Custom tags such as !Ref are not carried over as tags. A multi-document file separated by --- is rejected outright with a single-document error, so split the documents and convert each one separately." },
      { question: "Why does the same YAML file parse differently in older tools?", answer: "YAML 1.1 treated yes, no, on and off as booleans; YAML 1.2 treats only true and false as booleans. A config written for one version can therefore change meaning in a parser built for the other, which is why checking boolean-like values after conversion matters." },
      { question: "Can I convert a GitHub Actions workflow to JSON?", answer: "Yes, for inspection or processing. Paste the workflow YAML and the output is the equivalent JSON structure, with jobs, steps and keys preserved. Comments and anchor shortcuts in the workflow are expanded or dropped as described above, so the JSON is for reading and tooling, not a drop-in replacement for the original file." },
      { question: "What happens if my YAML has duplicate keys?", answer: "The conversion fails with a duplicated mapping key error naming the line. YAML forbids the same key twice in one mapping, so a file with a: 1 followed by a: 2 is invalid, not a merge. Remove or rename one of the duplicates and convert again." },
      { question: "Why does my YAML fail with a tab error?", answer: "Because tabs are not allowed as indentation in YAML at all. Replace the tabs with spaces, two per level, and the file will parse. Most editors can convert tabs to spaces automatically, and a single tab at the start of any line is enough to fail the whole document." },
      { question: "Why did 1.10 become 1.1 in the JSON?", answer: "Because an unquoted 1.10 is a number, and the number 1.1 is the same value with the trailing zero dropped. Quote version strings and other number-like strings in the YAML, such as \"1.10\", so they stay strings and keep their exact text." },
    ],
    pairGuide: {
      intro: "YAML to JSON is the step that turns a config file into data a program can process. YAML is written for humans, but most APIs, validators and scripts want JSON. Converting a Docker Compose file, a GitHub Actions workflow or an application config to JSON lets you validate it, query it and feed it into tooling that never learned YAML.",
      structureNote: "Mappings become JSON objects, sequences become arrays, and scalar types follow YAML 1.2 rules: true and false are booleans, numbers stay numbers, and yes or no stay strings. Anchors and aliases resolve into full expanded values, comments disappear, and a multi-document file with --- separators is rejected with an error rather than converted, so split it first.",
      whenTo: [
        "Validating or querying a YAML config with JSON tooling",
        "Feeding a Compose file or workflow into a script or API",
        "Comparing two configs as structured JSON",
        "Debugging a config whose YAML parsing you suspect",
      ],
      whenNotTo: [
        "When you plan to edit the result and save it back as YAML: comments and anchors are lost",
        "For configs that rely on custom tags, which JSON cannot represent",
        "When the file uses YAML 1.1 boolean words and the consumer expects the old meaning",
      ],
      gotcha: "The YAML version trap bites silently. A value like on can be a boolean in a YAML 1.1 parser and a string in a YAML 1.2 parser, so the same file converts differently depending on the tool. Always re-check boolean-like and date-like values in the JSON output.",
    },
  },

  "json-to-xml": {
    tagline: "Convert JSON objects and arrays to well-formed XML markup with configurable root element names.",
    keywords: "JSON to XML, convert JSON to XML, JSON XML converter, JSON to XML online, JSON2XML, JSON array to XML, JSON to XML root element",
    howTo: [
      { title: "Paste your JSON", text: "Enter the JSON object you want to convert to XML." },
      { title: "Set the root element name", text: "Choose a name for the XML root element (defaults to 'root')." },
      { title: "Click Convert", text: "The XML output appears with each JSON key as an XML element." },
      { title: "Copy the XML", text: "Copy the XML output for use in your system." },
    ],
    faqs: [
      { question: "How are JSON keys converted to XML elements?", answer: "Each JSON key becomes an XML element name. For example, {\"name\":\"Alice\"} becomes <name>Alice</name>. Nested objects become nested elements. JSON arrays become repeated elements with the same tag name." },
      { question: "What happens with JSON keys that are not valid XML element names?", answer: "They are written out as-is, which produces invalid XML: a key such as 123abc becomes the element <123abc> and a key with a space becomes <my key>, and a strict XML parser will reject the document. Rename such keys before converting, for example to item123 and my_key. Only the root element name is sanitised: the toolbar strips characters that are not letters, digits, underscore, or hyphen as you type." },
      { question: "Are JSON arrays converted to XML properly?", answer: "JSON arrays are expanded into repeated XML elements with the same tag. For example, {\"item\":[\"a\",\"b\"]} becomes <item>a</item><item>b</item>." },
      { question: "Can I convert XML back to JSON?", answer: "Yes. Use the XML to JSON converter on this site." },
      { question: "How do I convert a top-level JSON array to XML?", answer: "XML needs a single root element, but a JSON array has no name. The converter wraps the array in the root element you choose, and each item becomes a repeated element inside it, so [\"a\",\"b\"] under root items becomes repeated item elements. Without that wrapper there would be no valid XML document at all." },
      { question: "What is the difference between an XML attribute and an element?", answer: "JSON has no attributes, so the distinction has to be invented when converting. An element holds content or children, while an attribute holds metadata about its element. Systems such as SOAP services, RSS feeds and sitemaps often require a specific field to be an attribute, so check the target schema before converting rather than assuming elements will do." },
      { question: "How are special characters handled in XML output?", answer: "Characters that XML reserves, such as & and <, are escaped in text content. Null values have no natural XML form, so they become an empty element rather than a missing one: {\"a\":null} produces <a/> inside the root." },
      { question: "What XML declaration does the output start with?", answer: "Every output starts with <?xml version=\"1.0\" encoding=\"UTF-8\"?> on its own line, followed by the root element. The declaration is added automatically, so do not include one in the JSON input." },
      { question: "How are JSON null values handled?", answer: "A null value becomes an empty element, so {\"a\":null} produces <a/> inside the root. There is no way to distinguish an explicit null from an empty element in the XML afterwards, so if the distinction matters to the receiving system, replace nulls with an explicit marker before converting." },
      { question: "What happens if my JSON is a single value, not an object?", answer: "It is wrapped in a repeated item element under the root. A top-level array such as [\"a\",\"b\"] becomes <item>a</item><item>b</item> inside the root element you set, and a single string or number becomes one item element. XML must have exactly one root, so a bare value needs that wrapper to be a valid document." },
    ],
    pairGuide: {
      intro: "JSON to XML is the step that turns modern API data into the older markup format that SOAP services, RSS feeds, sitemaps and many enterprise systems still require. JSON is compact and easy for JavaScript; XML is verbose, self-describing and strict, and some systems will accept nothing else.",
      structureNote: "Each JSON key becomes an XML element, nested objects become nested elements, and arrays become repeated elements with the same tag name. A top-level array needs the root element you set, since an XML document must have exactly one root. JSON has no attributes, so everything becomes an element unless the target system defines an attribute convention separately.",
      whenTo: [
        "Calling a SOAP service or legacy API that only accepts XML",
        "Generating an RSS feed, sitemap or config file in XML",
        "Exchanging data with an enterprise system that validates against an XML schema",
        "Producing a document where element order and markup matter",
      ],
      whenNotTo: [
        "For a JavaScript or web API consumer: JSON is smaller and native there",
        "When the JSON keys are arbitrary user input, since not every key is a valid element name",
        "For round-tripping: JSON to XML to JSON can change shapes, especially for arrays",
      ],
      gotcha: "Arrays and attributes are where conversions break. A single-item array and a lone object can produce identical XML, so the way back is ambiguous, and a field the target expects as an attribute will be rejected if it arrives as an element. Validate the XML against the target schema, not just for well-formedness.",
    },
  },

  "xml-to-json": {
    tagline: "Parse XML documents and convert them to clean JSON objects. Attributes become @_ prefixed properties.",
    keywords: "XML to JSON, convert XML to JSON, XML JSON converter, XML parser, XML to JSON online, parse XML, SOAP XML to JSON, RSS XML to JSON",
    howTo: [
      { title: "Paste your XML", text: "Enter the XML document in the input panel." },
      { title: "Read the attributes", text: "XML attributes appear in the JSON prefixed with @_, so id becomes @_id. There is no setting to change this: the prefix is fixed." },
      { title: "Click Convert", text: "The parsed JSON representation of the XML appears." },
      { title: "Copy the JSON", text: "Copy the resulting JSON for use in your code." },
    ],
    faqs: [
      { question: "How are XML attributes handled in the JSON output?", answer: "XML attributes become JSON properties prefixed with @_, so id becomes @_id and class becomes @_class. The prefix is fixed: there is no option to drop attributes or to use a different prefix. Namespace declarations such as xmlns:ns also appear as @_ prefixed properties." },
      { question: "What happens with text nodes and element children?", answer: "If an XML element has both text content and child elements, the text content is stored under the #text key and the child elements become their own keys. For mixed content such as hello, a child element, and world, the text pieces are joined into one #text value." },
      { question: "Are XML namespaces preserved?", answer: "Namespace prefixes (e.g. ns:element) are preserved in the JSON key names as-is. Namespace declarations (xmlns:) are included as attributes by default." },
      { question: "Can I convert complex SOAP or API XML responses?", answer: "Yes. The converter handles any well-formed XML including SOAP envelopes, RSS feeds, and API responses. The resulting JSON may be deeply nested depending on the XML structure." },
      { question: "Why do different tools give different JSON for the same XML?", answer: "Because XML attributes have no single JSON equivalent. Some converters prefix them with @, some put them in an @attributes object, and some drop them entirely. This converter prefixes attributes with @_, so an id attribute becomes @_id in the JSON. Knowing the convention matters before you write code against the output." },
      { question: "Can I convert XML to JSON and back without losing anything?", answer: "Not reliably. Comments, CDATA sections, the XML prolog and DOCTYPE, mixed content where text and elements sit side by side, and sometimes element order do not survive a round trip through JSON. Treat XML to JSON as a one-way step for processing, and keep the original XML if you need to reproduce it." },
      { question: "What happens when an element repeats three times?", answer: "Repeated sibling elements become a JSON array. Three item elements become one item key holding an array of three values, while a single item element stays a single value. That inconsistency is inherent to XML to JSON conversion, and code reading the output should handle both shapes." },
      { question: "What happens to XML comments?", answer: "Comments are dropped silently. An XML comment such as <!-- note --> leaves no trace in the JSON, so anything that mattered in a comment is lost. Keep the original XML if comments carry information." },
      { question: "What happens to CDATA sections?", answer: "CDATA content becomes an ordinary text value, with the markup inside kept as text. A section such as <![CDATA[some <text>]]> converts to the string \"some <text>\", so the angle brackets survive as characters rather than becoming elements." },
      { question: "What happens to the XML declaration at the top of the file?", answer: "It becomes a ?xml key in the JSON, holding the version and encoding as @_ prefixed properties, for example {\"?xml\":{\"@_version\":\"1.0\",\"@_encoding\":\"UTF-8\"}}. It is data in the output, not a declaration, so converting back will not reproduce the original prolog." },
    ],
    pairGuide: {
      intro: "XML to JSON is the step that turns a document format into a data format. RSS feeds, SOAP responses, sitemaps and legacy API outputs arrive as XML, but modern JavaScript, Python and validation tooling all want JSON. Converting gives you objects and arrays you can query, filter and validate with ordinary code.",
      structureNote: "Elements become object keys, text content becomes the value, and repeated elements become arrays. Attributes are prefixed with @_, so id becomes @_id, and an element that holds both text and children stores its text under the #text key while its children become their own keys. Namespace prefixes stay attached to key names.",
      whenTo: [
        "Processing an RSS feed, SOAP response or sitemap in JavaScript or Python",
        "Validating a legacy API response against a JSON schema",
        "Querying or filtering XML data with ordinary object code",
        "Storing XML-derived data in a JSON database or config",
      ],
      whenNotTo: [
        "When you must reproduce the original XML byte for byte afterwards",
        "For documents where comments, CDATA or mixed content carry meaning",
        "When the consumer expects a different attribute convention than @ prefixing",
      ],
      gotcha: "The single-versus-array trap: one item element gives a single value, three give an array, so code that assumes an array will crash on the single case and code that assumes a value will crash on the repeated case. Normalise the shape after converting, or handle both.",
    },
  },

  "json-to-typescript": {
    tagline: "Generate TypeScript interface definitions from any JSON sample with correct types inferred automatically.",
    keywords: "JSON to TypeScript, JSON to TypeScript interface, generate TypeScript from JSON, JSON types, TypeScript generator, JSON schema to TypeScript, JSON to TypeScript interface generator, API response to TypeScript",
    howTo: [
      { title: "Paste your JSON", text: "Paste a representative JSON sample - object, array of objects, or nested structure." },
      { title: "Set interface name", text: "Enter a name for the root interface (defaults to 'Root')." },
      { title: "Click Generate", text: "TypeScript interface definitions are generated with correct types for all fields." },
      { title: "Copy the interfaces", text: "Copy the TypeScript and paste directly into your project." },
    ],
    faqs: [
      { question: "How does the type inference work?", answer: "The generator inspects each value in the JSON sample to determine its TypeScript type: string, number, boolean, null, arrays (with inferred element type), and nested objects (as named interfaces). Union types are used when a value could be multiple types across different samples." },
      { question: "What happens with nullable fields?", answer: "Fields that are null in the sample are typed as the inferred type | null. If you want optional fields (property?: Type), there is an option to mark nullable or missing fields as optional." },
      { question: "Can it generate types for arrays of objects?", answer: "Yes. An array of objects generates an item interface and the parent property is typed as ItemInterface[]. Nested arrays and objects of any depth are all handled." },
      { question: "Should I use interface or type?", answer: "The tool generates interface declarations by default. You can switch to type aliases in the options. Interfaces are generally preferred for object shapes in TypeScript as they support declaration merging and produce clearer error messages." },
      { question: "Why is a sample not a contract?", answer: "Because a sample only shows the fields that happened to be present. A field missing from your sample, such as an optional discount on some orders, will not appear in the generated types at all, and a field that is null in the sample becomes string | null even if it is usually a string. Generate from the fullest, most varied sample you have, then mark genuinely optional fields by hand." },
      { question: "What happens with an empty array in the sample?", answer: "An empty array carries no information about its element type, so it becomes unknown[] rather than a guessed type. The same applies to mixed arrays, which become union types. Replace empty arrays with a representative item before generating if you want precise types." },
      { question: "Can I see a real API example?", answer: "Take a nested order response: an order with a customer object, an items array and a total. The generator produces an Order interface, a Customer interface and an OrderItem interface, with items typed as OrderItem[]. Keys present in only some array items become optional, which is the correct behaviour for real API data." },
    ],
    pairGuide: {
      intro: "JSON to TypeScript is the step that turns a sample API response into types your editor can check. Paste real JSON and you get interfaces that catch typos, missing fields and wrong types at compile time instead of at runtime, which is the main reason TypeScript projects generate types from their APIs rather than hand-writing them.",
      structureNote: "Objects become named interfaces, arrays of objects become an item interface plus a typed array, and scalar values become string, number or boolean. Null values become a union with null, fields missing from some array items become optional, and nested objects of any depth each get their own interface referenced by name from the parent.",
      whenTo: [
        "Typing a new API response in a TypeScript project",
        "Generating request and response types from example payloads",
        "Documenting an API shape for a team",
        "Replacing hand-written types that drifted from the real payload",
      ],
      whenNotTo: [
        "When the sample is tiny or unrepresentative: the types will be wrong in exactly the places the sample did not cover",
        "As a substitute for the API schema, if one exists: generate from the schema instead",
        "For runtime validation: TypeScript types disappear at compile time and check nothing at runtime",
      ],
      gotcha: "A sample is not a contract. Optional fields absent from your sample vanish from the types, null fields become unions, and empty arrays become unknown[]. Generate from the fullest sample you can find, then review optional and nullable fields before committing the result.",
    },
  },

  "json-to-python": {
    tagline: "Generate Python dataclass or TypedDict definitions from any JSON sample.",
    keywords: "JSON to Python, JSON to Python dataclass, JSON to TypedDict, generate Python from JSON, Python type hints, JSON Python types, JSON to Python class, API JSON to dataclass",
    howTo: [
      { title: "Paste your JSON", text: "Paste a JSON object or array of objects." },
      { title: "Choose output style", text: "Select Python dataclass (@dataclass) or TypedDict based on your use case." },
      { title: "Set class name", text: "Enter a name for the root class (defaults to 'Root')." },
      { title: "Copy the Python code", text: "Copy the generated class definitions and paste into your Python project." },
    ],
    faqs: [
      { question: "What is the difference between dataclass and TypedDict output?", answer: "Python dataclasses create mutable class instances with type hints, suitable for object-oriented use. TypedDicts create typed dictionary definitions, useful when working with raw dict data from APIs without converting to instances." },
      { question: "Are nested objects handled?", answer: "Yes. Each nested JSON object generates a separate named class or TypedDict. The root class references nested classes by name, and all generated definitions are included in the output." },
      { question: "What Python version is the output compatible with?", answer: "The generated code targets Python 3.7+ for dataclasses and Python 3.8+ for TypedDict. For older Python versions, you would need to add from __future__ import annotations and use typing.TypedDict instead of the built-in version." },
      { question: "Are Optional fields generated?", answer: "Fields with null values in the sample are typed as Optional[type] (or type | None in Python 3.10+ syntax). The optional style can be configured in the output settings." },
      { question: "What is the difference between parsing JSON and generating Python from JSON?", answer: "They solve different problems. Parsing with json.loads() turns a JSON string into plain dicts and lists at runtime, with no validation and no named fields. Generating dataclass or TypedDict definitions turns a JSON sample into typed Python classes at development time, so your editor and type checker can catch mistakes before the code runs." },
      { question: "Should I choose a dataclass, a TypedDict or Pydantic?", answer: "A dataclass is best when you want real objects with behaviour and defaults. A TypedDict is best when you keep working with plain dicts, such as raw API data. Pydantic, which this generator does not output, is best when you need runtime validation, as in a FastAPI app: a dict result alone validates nothing, and a bad payload will pass silently until something downstream breaks." },
      { question: "How are JSON field names handled in Python?", answer: "JSON APIs commonly use camelCase keys such as firstName, while Python convention is snake_case such as first_name. Generated class fields follow the sample keys, so convert camelCase to snake_case yourself, or use aliases if the target framework supports them, before treating the output as finished code." },
    ],
    pairGuide: {
      intro: "JSON to Python is the step that turns a sample API response into typed Python code. Instead of passing untyped dicts around and discovering a missing key at runtime, you get dataclasses or TypedDicts with named fields, so mistakes surface while you are writing code rather than while users are running it.",
      structureNote: "Objects become named classes or TypedDicts, nested objects become their own named definitions referenced from the parent, and arrays become lists of the inferred item type. Null values become Optional fields, and the root class name defaults to Root. The output is type definitions from a sample, not a parser: parsing a JSON string at runtime is a separate step done with json.loads().",
      whenTo: [
        "Modelling an API response in a Python project",
        "Turning example payloads into dataclasses for a script or service",
        "Adding type hints to code that currently passes dicts around",
        "Documenting a payload shape for a team",
      ],
      whenNotTo: [
        "When you need runtime validation: use Pydantic instead, since dataclasses and TypedDicts check nothing at runtime",
        "As a JSON parser: to load a JSON string at runtime, use json.loads()",
        "When the sample is unrepresentative: missing and null fields will mislead the generated types",
      ],
      gotcha: "A dict result has no validation. Parsing JSON with json.loads() happily returns wrong types, missing keys and unexpected values, and nothing complains until later code fails. If bad payloads must be rejected, add Pydantic validation on top of the generated types rather than trusting the parse alone.",
    },
  },

  "json-to-sql": {
    tagline: "Convert a JSON array of objects to SQL CREATE TABLE and INSERT statements you can run in your database, with column types inferred from your data.",
    keywords: "JSON to SQL, JSON to SQL converter, convert JSON to SQL, JSON to SQL insert, generate SQL from JSON, JSON to database, JSON to table, JSON array to SQL, JSON to SQL CREATE TABLE INSERT, JSON to SQL converter online",
    howTo: [
      { title: "Paste a JSON array", text: "Paste a JSON array of objects - each object becomes a table row." },
      { title: "Read the CREATE TABLE first", text: "The output always targets a table called records, using CREATE TABLE IF NOT EXISTS, followed by one INSERT per row. Check the inferred column names and types before running it." },
      { title: "Copy the SQL", text: "Copy the CREATE TABLE and INSERT statements, or download them as data.sql, then run them in your database client." },
    ],
    faqs: [
      { question: "What SQL dialects are supported?", answer: "There is no dialect switch on this tool. It emits one generic, standard SQL output: CREATE TABLE IF NOT EXISTS records plus one INSERT per row, with INTEGER, REAL, VARCHAR(255), TEXT, BOOLEAN and TIMESTAMP types. That syntax runs in most common databases, but BOOLEAN and TIMESTAMP spellings differ slightly between them, so check those two types against your database before running the script." },
      { question: "How are JSON types mapped to SQL types?", answer: "Integers become INTEGER and other numbers become REAL, booleans become BOOLEAN written as TRUE or FALSE, and strings become VARCHAR(255), or TEXT when the sample value is longer than 255 characters. A string that looks like a date, such as 2026-01-05, becomes TIMESTAMP. Null becomes NULL in INSERT values, and a column that is null in every row gets TEXT. Nested objects are serialised as JSON text in a TEXT column." },
      { question: "What about nested objects in the JSON?", answer: "Nested objects and arrays cannot be stored directly in a flat relational table. The generator serialises them as JSON text in a TEXT column. For a normalised schema, you would need to manually split nested objects into separate tables." },
      { question: "Can I import the SQL directly into my database?", answer: "Yes. The output is standard SQL that can be executed in any SQL client. For large datasets, consider chunking the INSERT statements or using a bulk import tool." },
      { question: "What does the output look like for a real example?", answer: "For [{id: 1, name: Alice, age: 30, active: true}, {id: 2, name: Bob, age: 25, active: false}] the output starts with CREATE TABLE IF NOT EXISTS records, with columns id INTEGER, name VARCHAR(255), age INTEGER and active BOOLEAN, followed by INSERT INTO records (id, name, age, active) VALUES (1, 'Alice', 30, TRUE); and the matching row for Bob ending in FALSE. The table name is always records, and the CREATE TABLE uses IF NOT EXISTS, so running it twice will not drop an existing table." },
      { question: "Why did a column get the wrong type?", answer: "Because each column type is inferred from the first non-null value found for that key, and later rows never re-type it. If the first row has age 30, the column is INTEGER even if a later row has 30.5, and if the first name is short, the column is VARCHAR(255) even if a later name is longer. Make the first row representative, or edit the CREATE TABLE types by hand before running the script." },
      { question: "Why did my column names change, and what happens to missing keys?", answer: "Keys are converted to snake_case, so firstName becomes first_name and a key with a space becomes underscored. A row that lacks a key gets NULL for that column in its INSERT. No primary key, foreign key or auto-increment id is added: if the JSON has no id, the table has no id column, so add a primary key yourself if you need one. And note that re-running the script repeats every INSERT, so it will duplicate rows even though the table itself is protected by IF NOT EXISTS." },
    ],
    pairGuide: {
      intro: "JSON to SQL is the step that turns API data into rows a relational database can hold. APIs hand you arrays of objects; databases want tables with named columns and typed values. This conversion writes the CREATE TABLE and the INSERT statements for you, so a list of users, orders or products becomes a seed script or migration you can run instead of typing by hand.",
      structureNote: "Each object in the JSON array becomes one row, and the union of all keys across rows becomes the column list, converted to snake_case. The output always targets a table called records, starts with CREATE TABLE IF NOT EXISTS, and then emits one INSERT per row. Nested objects and arrays do not become their own tables: they are serialised as JSON text in a TEXT column.",
      whenTo: [
        "Seeding a development or test database from a sample API response",
        "Migrating a NoSQL export or JSON dump into a relational database",
        "Writing a seed or migration script without hand-typing every row",
        "Sharing sample data as runnable SQL a teammate can import",
      ],
      whenNotTo: [
        "When nested data must stay queryable as columns: JSON text in a TEXT column cannot be filtered or joined like real columns, so normalise into separate tables instead",
        "When you need primary keys, foreign keys or constraints: none are generated",
        "When the target database needs its own dialect types: there is no dialect switch, so dialect-specific types must be edited by hand",
        "For very large dumps: one INSERT per row is fine for samples, but bulk-load tools suit millions of rows better",
      ],
      gotcha: "Two traps: the column type comes from the first non-null value only, so an unrepresentative first row locks in the wrong type, and re-running the script duplicates rows, because IF NOT EXISTS protects only the table, not the INSERTs. Check the CREATE TABLE against your first row and run the script once against a fresh table.",
    },
  },

  "json-to-excel": {
    tagline: "Export a JSON array of objects to a downloadable .xlsx Excel workbook with real numbers and booleans, built entirely in your browser.",
    keywords: "JSON to Excel, JSON to Excel converter, JSON to XLSX, convert JSON to Excel, export JSON spreadsheet, JSON to Excel file, JSON Excel converter, JSON array to Excel, export JSON to XLSX, JSON to Excel online, JSON to Excel download",
    howTo: [
      { title: "Paste a JSON array", text: "Paste a JSON array of objects - each object becomes a row in the spreadsheet - or upload a .json file. A single object works too and becomes one row." },
      { title: "Check the preview", text: "The preview shows the headers and the first 10 rows so you can spot problems early. The download itself contains every row, not just the previewed ones." },
      { title: "Download the file", text: "Click Download .xlsx to save data.xlsx, which opens in Excel, Google Sheets, or LibreOffice Calc with no import step." },
    ],
    faqs: [
      { question: "Does the Excel output include column headers?", answer: "Yes. Column headers are automatically generated from the union of JSON object keys across all rows and placed in the first row of the spreadsheet. Headers carry no extra formatting: no bold, no colours, no filters, just plain values." },
      { question: "Are numbers and booleans formatted correctly in Excel?", answer: "Yes. JSON numbers are stored as Excel numbers (not text), so you can perform arithmetic directly in Excel. Booleans become TRUE/FALSE. Null values and keys missing from a row become empty cells." },
      { question: "Can I export multiple sheets?", answer: "No. The download is always a single-sheet workbook called Sheet1. Nested arrays of objects are not split into their own sheets: a nested value is written as JSON text inside a single cell of its parent row. If you need one sheet per nested list, split the lists into separate conversions first." },
      { question: "What library is used for Excel generation?", answer: "No third-party spreadsheet library is used. The workbook is assembled in your browser as a standard .xlsx file, which is a ZIP of XML parts, and no data is sent to any server at any point." },
      { question: "What does the output look like for a real example?", answer: "For the built-in example with Alice (30, London, true), Bob (25, New York, false) and Carol (35, Tokyo, true), the workbook has one sheet, Sheet1, with a header row of name, age, city and active, followed by exactly 3 data rows. Ages arrive as real numbers you can sum or average, and active arrives as TRUE or FALSE, not as text." },
      { question: "What happens to nested objects and arrays in a row?", answer: "They become JSON text in a single cell. An address object such as {city: London} is written as the text {\"city\":\"London\"} in the address cell, not split into address and city columns. If you need dotted columns like address.city, flatten the JSON into flat keys before converting, because this tool does not flatten nested values." },
      { question: "Do dates and codes survive the conversion?", answer: "Date-like strings stay as text, not Excel dates, so a value like 2026-01-05 will not sort or filter as a date until you convert that column in Excel. Codes behave better: a quoted string such as \"007\" stays text and keeps its leading zeros, because it is stored as a string cell. But an unquoted 7 in the JSON is a number, so if a code must keep leading zeros, make sure it is quoted as a string in the JSON first." },
    ],
    pairGuide: {
      intro: "JSON to Excel is the step that turns API data into a spreadsheet a non-coder can open. A CSV export forces an import wizard that can mangle dates, codes and encodings; a real .xlsx workbook opens directly in Excel, Google Sheets or LibreOffice Calc with numbers stored as numbers and headers already in place.",
      structureNote: "Each object in the JSON array becomes one row on a single sheet called Sheet1, and the union of all keys across rows becomes the header row. Numbers are stored as real numeric cells, booleans as TRUE or FALSE, and null or missing keys as empty cells. Nested objects and arrays are written as JSON text in a single cell, not flattened. A single JSON object converts to a one-row sheet. The on-page preview shows only the first 10 rows, but the downloaded file contains every row.",
      whenTo: [
        "Handing API or export data to someone who does not code",
        "Building a shareable report, list or record sheet from JSON",
        "Sorting, filtering or charting exported records in a spreadsheet",
        "Avoiding the CSV import wizard and its encoding and date traps",
      ],
      whenNotTo: [
        "When nested data needs its own columns or sheets: flatten it first, since nesting lands as JSON text in one cell",
        "When you need formatting, formulas, charts or filters in the file: the output is plain values only",
        "When dates must arrive as real Excel dates: date strings stay as text and need converting in Excel",
      ],
      gotcha: "Nesting and dates are the two surprises. A nested object becomes one cell of JSON text, not extra columns, and a date-like string stays text rather than becoming an Excel date. Scan those two kinds of columns in the preview before downloading, and flatten or retype them first if the spreadsheet must treat them as structured data.",
    },
  },

  // ─── Generate & Schema ───────────────────────────────────────────────────

  "json-schema-generator": {
    tagline: "Infer a JSON Schema from any JSON sample - get a ready-to-use schema for validation and documentation.",
    keywords: "JSON Schema generator, generate JSON Schema, JSON to schema, infer JSON Schema, JSON Schema from JSON, JSON Schema creator",
    howTo: [
      { title: "Paste your JSON sample", text: "Paste a representative JSON object or array. The richer the sample, the more accurate the schema." },
      { title: "Make the sample representative", text: "Include every field your real data can have, including optional ones. Fields missing from the sample will not appear in the schema." },
      { title: "See the schema", text: "The schema appears automatically as you type, inferred from the structure and values of your sample." },
      { title: "Copy or refine", text: "Copy the schema and add constraints (minLength, pattern, enum) not inferrable from a single sample." },
    ],
    faqs: [
      { question: "What is JSON Schema?", answer: "JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It describes the structure, required fields, data types, and constraints of a JSON document. It is widely used for API request/response validation and documentation." },
      { question: "How accurate is the generated schema?", answer: "The generator infers types correctly from the sample. It cannot infer constraints like minimum string length, allowed enum values, or regex patterns - those require manual addition. Use the generated schema as a starting point." },
      { question: "What JSON Schema draft is supported?", answer: "Only draft-07. Every schema this tool generates carries $schema http://json-schema.org/draft-07/schema#, and there is no draft selector. Draft-07 is the most widely supported version, so the schema works with most validators." },
      { question: "Can I generate a schema from multiple JSON samples?", answer: "No, not by wrapping samples in an array. Only the first item is used: in a test, [{\"a\":1},{\"a\":\"x\"}] produced a schema saying a is an integer, ignoring the string in the second item, and a key missing from one sample still ended up required. To cover several shapes, generate one schema per shape and combine them by hand, then check each sample against the result with the JSON Schema Validator." },
      { question: "Does the generator detect formats like email or dates?", answer: "No. A string such as ada@example.com becomes a plain {\"type\":\"string\"} with the value shown as an example, and a date string is treated the same way. No format keyword is ever added. If a field must be an email or a date-time, add \"format\":\"email\" or \"format\":\"date-time\" to that property yourself." },
      { question: "Why is every field marked required?", answer: "The generator marks every key in your sample as required and sets additionalProperties to false, so a document with a missing or extra field would fail validation against the schema. That is only correct if every field is truly always present. Remove optional fields from the required list by hand, and change additionalProperties if your data can carry extra keys." },
      { question: "What does the generator do with arrays of mixed types?", answer: "It merges the item schemas. An array such as [1,\"x\",true] produces items with an anyOf list covering integer, string and boolean, while an array of objects merges their properties and only keeps keys present in every item as required. An empty array has no items to learn from, so it becomes {\"type\":\"array\"} with no items schema at all." },
    ],
  },

  "json-schema-validator": {
    tagline: "Validate JSON against any JSON Schema and get a clear list of every validation error with paths.",
    keywords: "JSON Schema validator, validate JSON schema, JSON schema check, JSON Schema testing, validate against schema, JSON Schema errors",
    howTo: [
      { title: "Paste your JSON Schema", text: "Enter the JSON Schema in the left panel." },
      { title: "Paste the JSON to validate", text: "Enter the JSON document you want to validate against the schema in the right panel." },
      { title: "See the results", text: "Validation runs automatically as you type, and every violation is listed with its JSON path. There is no button to press." },
      { title: "Fix the errors", text: "Use the error paths and messages to correct the JSON document." },
    ],
    faqs: [
      { question: "What JSON Schema drafts are supported?", answer: "This validator checks a draft-07 subset, and the $schema value in your schema is ignored rather than used to pick a draft. It checks type (including integer), required, properties, additionalProperties: false, items, and anyOf. Keywords outside that list, such as minimum, pattern, enum, format, and $ref, are ignored rather than treated as errors, so a schema that relies on them will pass documents it should reject. For full draft support, use a library validator such as Ajv in your own code." },
      { question: "What information does an error message include?", answer: "Each violation shows the JSON path to the failing value, such as $.users[1].email, plus a plain message, for example Expected type \"string\", got \"number\". There is no schema path in the message, so match the JSON path back to the property in your schema yourself. A missing required field is reported at the missing field's path, such as $.active with Required property \"active\" is missing." },
      { question: "Can I validate an array of objects?", answer: "Yes. If your JSON is an array, the schema should have type: array with an items definition. Every item in the array is validated against the items schema." },
      { question: "Does it support custom validation keywords?", answer: "No. The validator is a small hand-written checker, not the Ajv library, and it only understands the keyword list above. Unknown keywords, including custom ones and $ref, are silently ignored. If your schema depends on $ref or a custom keyword, validate it with a full validator instead of this tool." },
      { question: "Does the validator check formats like email or dates?", answer: "No. The format keyword is ignored entirely, so a string such as not-an-email passes a schema that says {\"type\": \"string\", \"format\": \"email\"}. In a test, that exact document validated as correct. If a field must be an email or a date, check the format yourself or use a full validator that enforces it." },
      { question: "How do I read a violation path?", answer: "$ is the document root, .name steps into an object key, and [2] steps into an array item, so $.users[1].email means the email field of the second item in the users array. The tool reports one row per violation, with a count in the banner, for example Invalid - 3 violations found." },
      { question: "Can I validate a file instead of pasting?", answer: "Yes. Both panels have a file upload button, so you can load a .json document and a .json schema file instead of pasting. Invalid JSON in either panel shows a parse error banner and no validation runs until both sides parse." },
    ],
  },

  "json-generator": {
    tagline: "Generate realistic mock JSON data from a template using Faker-style helpers for names, emails, dates, and more.",
    keywords: "JSON generator, mock JSON data, generate JSON, fake JSON data, JSON data generator, random JSON, test data generator",
    howTo: [
      { title: "Write a JSON template", text: "Create a JSON object template and use {{name}}, {{email}}, {{uuid}}, {{integer(18,65)}} and similar placeholders where you want generated values. The full list is under Available Placeholders below the tool." },
      { title: "Repeat objects with $repeat", text: "To generate an array of objects, wrap the template as [{\"$repeat\": 5, \"$template\": {...}}]. There is no count setting: the number comes from $repeat, and 5 is used when $repeat has no number." },
      { title: "See the generated JSON", text: "The output updates live as you type. Pick a ready-made example from the Users list, Product, or Blog post buttons to start from a working template." },
      { title: "Copy or download", text: "Copy the generated JSON to use as test fixtures, seed data, or API mock responses, or download it as generated.json." },
    ],
    faqs: [
      { question: "What helpers are available for generated values?", answer: "The placeholders are {{name}} (also {{fullName}}), {{firstName}}, {{lastName}}, {{email}}, {{url}}, {{uuid}} (also {{id}}), {{date}} as YYYY-MM-DD, {{datetime}} as ISO 8601, {{boolean}}, {{color}}, {{status}} (active, inactive, pending, or archived), {{sentence}} (also {{lorem}}), {{loremWord}} (also {{word}}), {{integer(min,max)}} which defaults to 1 to 1000 when no range is given, and {{float(min,max)}} which defaults to 0 to 100. There are no phone, address, or company placeholders. An unknown placeholder is replaced by its bare name, so {{nosuchthing}} becomes nosuchthing, which is a quick way to spot a typo." },
      { question: "Can I generate nested objects?", answer: "Yes. Templates can be arbitrarily nested. Each level of the template can contain helpers, static values, nested objects, or nested arrays." },
      { question: "Can I generate arrays of objects?", answer: "Yes. Wrap your template in an array with $repeat: [{\"$repeat\": 5, \"$template\": {...}}]. Each item uses the same template but generates fresh values within that run, so five users get five different names and UUIDs. Plain arrays without $repeat are generated item by item, with placeholders resolved in each." },
      { question: "Is the generated data deterministic?", answer: "Yes. The same template always produces the same output, because the generator reseeds itself before every run. That makes it good for repeatable test fixtures: paste the same template tomorrow and you get the same users, emails, and UUIDs. To get different values, change the template, for example the integer range or a literal name. There is no randomise button and no seed setting." },
      { question: "Do the generated names and emails look real?", answer: "They look plausible but they come from small built-in lists: ten first names, ten last names, and four domains (example.com, test.dev, mail.net, acme.org), so emails always end in one of those domains and names repeat across large outputs. That is fine for fixtures and mock APIs, but do not use the output as real contact data." },
      { question: "Why did my template come back with an error?", answer: "The template itself must be valid JSON, so a missing comma or an unquoted key fails before any placeholder is resolved. The error shown is the JSON parser's message. Fix the template syntax first, then check the placeholders: the tool reports the parser error, not a placeholder error." },
    ],
  },

  // ─── Encode & Inspect ─────────────────────────────────────────────────────

  "base64": {
    tagline: "Encode text to Base64 or decode Base64 strings back to plain text - instantly, in your browser.",
    keywords: "Base64 encode, Base64 decode, Base64 online, encode Base64, decode Base64, Base64 converter, text to Base64",
    howTo: [
      { title: "Choose Encode, Decode, or Auto-detect", text: "Select Encode, Decode, or Auto-detect, which guesses the direction for you. Auto-detect decodes anything that looks like valid Base64 and encodes the rest." },
      { title: "Paste your input", text: "Enter the text to encode, or the Base64 string to decode." },
      { title: "View the output", text: "The result appears instantly in the output panel." },
      { title: "Copy the result", text: "Click Copy to copy the encoded or decoded value to your clipboard." },
    ],
    faqs: [
      { question: "What is Base64?", answer: "Base64 is a binary-to-text encoding scheme that represents binary data using a set of 64 printable ASCII characters (A-Z, a-z, 0-9, +, /). It is used to encode binary data (like images or files) into text form so it can be safely transmitted in text-based systems like email, HTML, or JSON." },
      { question: "Is Base64 encryption?", answer: "No. Base64 is encoding, not encryption. It is fully reversible by anyone without a key. Never use Base64 to protect sensitive data - use a proper encryption algorithm instead." },
      { question: "What is URL-safe Base64?", answer: "Standard Base64 uses + and / characters which have special meaning in URLs. URL-safe Base64 replaces + with - and / with _, making the encoded string safe to include in URLs without percent-encoding." },
      { question: "Why does Base64 output end with = or ==?", answer: "Base64 encodes data in 3-byte groups. If the input length is not a multiple of 3, padding characters (=) are added to make the last group complete. One = means one padding byte was added; == means two. Turn on the URL-safe checkbox and the padding is stripped entirely, so the same text encodes without any trailing =." },
      { question: "What does Auto-detect mode do?", answer: "It guesses the direction for each input. If the text looks like valid Base64 that decodes to printable text, it decodes it, otherwise it encodes it as plain text, and it tells you which way it went. It needs at least 4 characters to make the call, and binary data that does not decode to text is treated as plain text to encode." },
      { question: "Can I encode a file to Base64, or decode Base64 back to a file?", answer: "Yes, both, in the File tools section below the text box. Encode a file to Base64 reads any file as raw bytes, shows the Base64 and its size, and lets you download it as a .b64.txt file. To get a file back, switch to Decode mode, paste the Base64, type a filename, and use Download decoded file. The filename extension sets the downloaded file type. Note the overhead: Base64 is about 33% larger than the original, 4 characters for every 3 bytes." },
      { question: "What if my Base64 has a data: URI prefix or line breaks?", answer: "Both are handled. Decoding strips a data: URI prefix such as data:image/png;base64, automatically, ignores all whitespace, and accepts both the standard alphabet (+ and /) and the URL-safe alphabet (- and _) with or without padding. An invalid character is reported with its exact position, for example Invalid Base64 character \"!\" at position 5, and a length that is 1 past a multiple of 4 is rejected outright. Turn on Decode each line separately to process a list of Base64 values one per line." },
    ],
  },

  "jwt-decoder": {
    tagline: "Decode any JWT token to inspect its header and payload claims without needing the signing secret.",
    keywords: "JWT decoder, decode JWT, JWT inspector, JWT header payload, JSON Web Token decoder, JWT claims, JWT online",
    howTo: [
      { title: "Paste the JWT", text: "Paste the full JWT token (three Base64url-encoded parts separated by dots)." },
      { title: "Inspect header and payload", text: "The header (algorithm, type) and payload (claims, expiry) are decoded and displayed as formatted JSON." },
      { title: "Check expiry", text: "If the payload has an exp claim, a banner shows the expiry as a readable date and whether the token is expired. The iat and nbf claims are shown as raw numbers in the payload, not converted." },
      { title: "Copy decoded sections", text: "Copy the decoded header or payload JSON for use in debugging." },
    ],
    faqs: [
      { question: "Is it safe to paste a JWT here?", answer: "The decoder runs entirely in your browser - your JWT is never sent anywhere. However, treat JWTs as sensitive tokens and avoid pasting production tokens with long lifetimes into any online tool." },
      { question: "Does the decoder verify the JWT signature?", answer: "No. The decoder only decodes the Base64url-encoded header and payload. It does not verify the signature, which requires the signing secret or public key. Use this tool for inspection only, not for security validation." },
      { question: "What are JWT claims?", answer: "Claims are key-value pairs in the JWT payload. Standard claims include: iss (issuer), sub (subject), aud (audience), exp (expiry time), nbf (not before), iat (issued at), and jti (JWT ID). Custom claims are any additional properties added by the issuing application." },
      { question: "What algorithms does the header alg field refer to?", answer: "Common values: HS256 (HMAC-SHA256, symmetric), RS256 (RSA-SHA256, asymmetric), ES256 (ECDSA-SHA256, asymmetric). HS256 uses a shared secret; RS256 and ES256 use a public/private key pair." },
      { question: "Why is my token showing as invalid?", answer: "The two errors are specific. A token with fewer or more than three dot-separated parts fails with A JWT must have 3 parts separated by dots. A token with three parts that do not decode to JSON fails with Could not decode token. Check it's a valid JWT. Also check for URL encoding: a token copied from a URL with %3D in place of = or %2F in place of / fails, because this decoder does not URL-decode. Paste the raw token with its dots intact." },
      { question: "Which timestamps does the decoder convert to dates?", answer: "Only exp, the expiry claim. When the payload has a numeric exp, a banner shows the expiry as an ISO date, such as Token valid until 2026-11-13T00:00:00.000Z, or Token expired at ... once the token is past expiry, and the banner turns red. The iat (issued at) and nbf (not before) claims stay as raw Unix timestamps in the payload JSON, so convert them yourself if you need the date. A token with no exp claim shows no banner." },
      { question: "What exactly does the decoder show for a token?", answer: "Three parts: the header and payload as formatted JSON, and the signature as the raw third segment. The header shows the algorithm and type, the payload shows the claims, and the signature is displayed as text only. Nothing is verified, and nothing is sent anywhere, decoding runs entirely in your browser." },
    ],
  },

  "json-token-counter": {
    tagline: "Estimate how many LLM tokens a JSON payload will consume before sending it to an AI API.",
    keywords: "JSON token counter, LLM token count, count tokens, JSON tokens, GPT token counter, LLM tokens estimate, AI token calculator",
    howTo: [
      { title: "Paste your JSON or text", text: "Paste the JSON payload you plan to send to an LLM API, or any text. The counter works on both." },
      { title: "See the token count", text: "The estimated token count appears immediately, with characters, words, and bytes alongside it. There is no model selector and no cost figure: the count is a character-based estimate, not a tokenizer result." },
      { title: "Count a file instead", text: "Use the upload button to count the tokens in a whole file instead of pasting." },
      { title: "Optimise if needed", text: "If the count is too high, consider minifying the JSON or removing unused fields to reduce tokens." },
    ],
    faqs: [
      { question: "Why does token count matter for LLMs?", answer: "LLM APIs charge per token and have a maximum context window. Knowing the token count of your JSON payload helps you stay within limits, estimate costs, and avoid hitting context window errors in production." },
      { question: "What is a token?", answer: "A token is the basic unit that LLMs process. Tokens are not the same as words or characters - they are variable-length text chunks determined by the model's tokeniser. Common English words are usually one token; long words, JSON syntax, and non-English characters may be multiple tokens." },
      { question: "How accurate is the estimate?", answer: "It is a character-based approximation, not a tokenizer count. The tool estimates tokens as (characters minus punctuation x 0.5) divided by 3.7, plus punctuation x 0.6, where punctuation is the count of { } [ ] : , and quote characters, rounded up. JSON's punctuation density is why it counts differently from plain prose. The page itself says this is an approximation, not an exact tokenizer count, and actual usage varies by model. Treat it as a sizing guide, and use the model provider's own tokenizer for billing decisions." },
      { question: "Does minifying JSON reduce token count?", answer: "Yes. Whitespace costs tokens in this estimate, so removing it drops the count. On a 50-record test payload, the pretty-printed version counted 2,239 tokens and the minified version 1,752, about 22% fewer. A small two-record example went from 91 tokens to 66, about 28% fewer. The exact saving depends on how much indentation the pretty version had; a deeply indented file saves more." },
      { question: "Does the counter work for text that is not JSON?", answer: "Yes. The input box is labelled JSON or text, and the estimate runs on whatever you paste, JSON or prose. The words, characters, and bytes cards update the same way. Use the upload button to count a whole file." },
      { question: "Why does JSON cost more tokens than plain text of the same length?", answer: "Because JSON is punctuation dense, and this tool's formula charges for it: plain characters cost about 1 token per 3.7 characters, while each brace, bracket, colon, comma, or quote adds 0.6 tokens on top of a small character discount. A JSON document therefore counts more tokens than the same length of prose. Minifying removes the whitespace but not the punctuation, which is why it helps but cannot close the gap entirely." },
    ],
  },
};

export function getJsonToolContent(slug: string): JsonToolContent | undefined {
  return content[slug];
}

export default content;
