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
    ],
  },

  "json-beautifier": {
    tagline: "Clean up compact or poorly structured JSON into a neatly indented, easy-to-read format.",
    keywords: "JSON beautifier, beautify JSON, JSON pretty printer, format JSON, readable JSON",
    howTo: [
      { title: "Paste or type JSON", text: "Enter your JSON in the input area - minified, partially formatted, or completely raw." },
      { title: "Select indent size", text: "Choose 2 spaces, 4 spaces, or tab characters for the output indentation." },
      { title: "Read the output", text: "The beautified JSON appears immediately with every key and value on its own line." },
      { title: "Copy the result", text: "Use the Copy button to copy the output to your clipboard." },
    ],
    faqs: [
      { question: "What does 'beautify' mean for JSON?", answer: "Beautifying JSON means adding consistent indentation, line breaks, and spacing so the structure is easy to read at a glance. It is the opposite of minification, which removes all such whitespace." },
      { question: "Does beautifying affect JSON parsing?", answer: "No. A JSON parser treats whitespace as insignificant. A beautified and a minified version of the same JSON are semantically identical and parse to the same data structure." },
      { question: "Can I paste JSON from a browser network tab?", answer: "Yes. JSON copied directly from browser DevTools network responses is often compact or partially formatted. Paste it here and it becomes fully readable immediately." },
      { question: "Does it work with JSON arrays?", answer: "Yes. Both JSON objects (curly braces) and JSON arrays (square brackets) are formatted correctly, including deeply nested combinations of both." },
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
    ],
  },

  "json-viewer": {
    tagline: "Explore JSON as an interactive collapsible tree - expand and collapse nodes to navigate any structure.",
    keywords: "JSON viewer, JSON tree viewer, JSON explorer, visualise JSON, JSON tree, JSON inspector, interactive JSON",
    howTo: [
      { title: "Paste your JSON", text: "Paste any valid JSON - object, array, or primitive - into the input." },
      { title: "Explore the tree", text: "The JSON renders as a collapsible tree. Click any node with children to expand or collapse it." },
      { title: "Inspect values", text: "Leaf values (strings, numbers, booleans, null) are shown with type-coloured labels." },
      { title: "Search or navigate", text: "Use the search bar to filter visible nodes by key name or value." },
    ],
    faqs: [
      { question: "What is a JSON tree viewer?", answer: "A JSON tree viewer renders JSON as a hierarchical tree of expandable nodes, similar to the view you see in browser DevTools. It makes deeply nested structures much easier to navigate than reading raw text." },
      { question: "Can I edit values in the viewer?", answer: "The viewer is read-only for exploration. To edit JSON, use the JSON Editor tool which provides a side-by-side tree editor and text input." },
      { question: "Does it work with very large JSON files?", answer: "The viewer loads the entire JSON into the browser. For very large files (over a few MB), rendering all nodes at once may be slow. Collapsing top-level nodes first and then expanding what you need is the most efficient approach." },
      { question: "Are circular references supported?", answer: "Circular references are not valid JSON (JSON must be serialisable), so any valid JSON file will not contain them. The viewer handles all valid JSON structures." },
    ],
  },

  "json-editor": {
    tagline: "Edit JSON with a live side-by-side tree preview - changes in the text sync instantly to the tree view.",
    keywords: "JSON editor, online JSON editor, edit JSON, JSON tree editor, JSON live editor, JSON code editor",
    howTo: [
      { title: "Open or paste JSON", text: "Paste existing JSON into the text panel, or start typing a new JSON document." },
      { title: "Edit in text or tree view", text: "Edit directly in the text panel. The tree view updates as you type. Click nodes in the tree to navigate to the corresponding text." },
      { title: "Fix errors inline", text: "Syntax errors are highlighted as you type so you can fix them before saving." },
      { title: "Copy the edited JSON", text: "When done, copy the JSON from the text panel or download it as a file." },
    ],
    faqs: [
      { question: "What makes this different from a plain text editor?", answer: "The JSON Editor shows a live tree view alongside your text input. As you type, the tree updates in real time, making it easy to see the structure without manually tracing brackets. Syntax errors are also highlighted inline." },
      { question: "Can I add or delete keys in the tree view?", answer: "The tree view is primarily for navigation and inspection. For editing, use the text panel. Changes made in text are immediately reflected in the tree." },
      { question: "Does it support JSON Schema validation while editing?", answer: "For schema-based validation as you type, use the JSON Schema Validator tool and provide both the JSON and the schema separately." },
      { question: "Is my JSON saved anywhere?", answer: "No. Everything runs in your browser. Nothing is sent to any server. When you close the tab, the JSON is gone unless you copy or download it first." },
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
      { question: "What types of JSON errors can be repaired?", answer: "JSON Repair handles: trailing commas after the last item in objects or arrays, single-quoted strings (converts to double-quoted), unquoted object keys (adds double quotes), missing commas between items (attempts to insert them), stray quotes, and some truncated JSON structures." },
      { question: "Can it repair completely garbled JSON?", answer: "The repair tool works best on JSON that has common human or tool-introduced errors. Fundamentally garbled or corrupted text (such as binary data labelled as JSON) cannot be repaired, as there is no correct structure to recover." },
      { question: "Does repair change my data values?", answer: "No. Repair only fixes structural and syntax issues - punctuation, quote types, and bracket matching. Your key names, string values, numbers, and booleans are not modified." },
      { question: "Is JSON5 or JavaScript object syntax supported as input?", answer: "JSON Repair can handle several JS-style patterns (unquoted keys, single quotes, trailing commas) that are common when copying from JS source files. Full JSON5 with comments is also handled by stripping comment lines." },
    ],
  },

  "jsonl-formatter": {
    tagline: "Pretty-print each line of a JSONL (JSON Lines) file into readable indented JSON while keeping lines separate.",
    keywords: "JSONL formatter, JSON Lines formatter, NDJSON formatter, format JSONL, pretty print JSONL",
    howTo: [
      { title: "Paste your JSONL", text: "Paste a JSONL file where each line is a separate JSON value. Mixed-format files work too." },
      { title: "Select indent style", text: "Choose 2 spaces, 4 spaces, or tab for the indentation within each formatted JSON block." },
      { title: "View formatted output", text: "Each line is formatted into its own indented JSON block, separated by blank lines for readability." },
      { title: "Copy or download", text: "Copy the formatted output or download it as a .jsonl file." },
    ],
    faqs: [
      { question: "What is JSONL (JSON Lines)?", answer: "JSONL (also called NDJSON - Newline Delimited JSON) is a format where each line of a file contains a complete, independent JSON value. It is popular for log files, data streaming, and large datasets because each line can be read and parsed independently without loading the whole file." },
      { question: "Is JSONL the same as a JSON array?", answer: "No. A JSON array is a single JSON document containing multiple values in brackets. JSONL is a sequence of completely separate JSON values, one per line, with no surrounding brackets." },
      { question: "Can I format only some lines?", answer: "The formatter processes every line. If some lines are invalid JSON they are passed through unchanged (or flagged, depending on the setting). Valid lines are always formatted." },
      { question: "What happens with empty lines in the input?", answer: "Empty lines are preserved in the output. Lines containing only whitespace are treated as blank and skipped during formatting." },
    ],
  },

  "jsonl-validator": {
    tagline: "Validate every line of a JSONL file independently and get the exact line number of each error.",
    keywords: "JSONL validator, validate JSONL, JSON Lines validator, NDJSON validator, JSONL error checker, validate each JSON line",
    howTo: [
      { title: "Paste your JSONL", text: "Paste the JSONL content - each line should be a valid, complete JSON value." },
      { title: "Validation runs per line", text: "Every non-empty line is validated as independent JSON. Results appear line by line." },
      { title: "Review errors", text: "Any invalid lines are highlighted with their line number and a specific error message." },
      { title: "Fix and re-validate", text: "Edit the invalid lines based on the error messages, then re-paste to confirm all lines pass." },
    ],
    faqs: [
      { question: "How is JSONL validation different from JSON validation?", answer: "A JSON validator checks one document at a time. A JSONL validator checks each line of the file as an independent JSON document. A single invalid line does not invalidate the rest of the file." },
      { question: "What counts as a valid JSONL line?", answer: "Any complete, valid JSON value on a single line: an object, array, string, number, boolean, or null. The line must be syntactically complete - partial JSON is not valid in JSONL format." },
      { question: "Are blank lines allowed in JSONL?", answer: "Blank lines are technically not part of the JSONL specification but most parsers skip them. The validator ignores blank lines and only checks non-empty lines." },
      { question: "Can I use this to validate log files?", answer: "Yes. Application logs in JSONL format can be pasted directly. The validator identifies which log lines have malformed JSON, which is useful for debugging logging pipelines." },
    ],
  },

  // ─── Compare & Manipulate ─────────────────────────────────────────────────

  "json-diff": {
    tagline: "Compare two JSON documents side by side and see every addition, deletion, and change highlighted.",
    keywords: "JSON diff, JSON compare, JSON difference, compare JSON files, JSON delta, JSON changes, JSON comparison tool",
    howTo: [
      { title: "Paste the original JSON", text: "Enter the original (base) JSON in the left panel." },
      { title: "Paste the modified JSON", text: "Enter the modified JSON in the right panel." },
      { title: "Click Compare", text: "The diff runs and highlights additions in green, deletions in red, and changed values in amber." },
      { title: "Review changes", text: "Scroll through the highlighted diff to find every difference between the two documents." },
    ],
    faqs: [
      { question: "Does JSON Diff care about key order?", answer: "No. JSON objects are unordered by definition. The diff compares values by key name, not position. Reordered keys with identical values show no difference." },
      { question: "Does it diff nested objects and arrays?", answer: "Yes. The diff is recursive and descends into nested objects and arrays. Changes deep in the structure are highlighted exactly where they occur." },
      { question: "What does the diff show for array changes?", answer: "Array items are compared positionally - item 0 is compared with item 0, item 1 with item 1, etc. If an item is inserted or removed, all subsequent items will show as changed. For semantic array diffs, key-based comparison on an object property may be more useful." },
      { question: "Can I diff API responses?", answer: "Yes. Copy a JSON response from your browser DevTools Network tab and paste it into each panel. This is a common use case for verifying that a code change did not unexpectedly alter an API response." },
      { question: "Is there a size limit?", answer: "The diff runs entirely in your browser. Large JSON files work but may take a few seconds for the diffing algorithm to complete. For very large files (over a few MB), consider diffing a representative sample first." },
    ],
  },

  "json-sorter": {
    tagline: "Sort all object keys alphabetically throughout an entire JSON document, including nested objects.",
    keywords: "JSON sorter, sort JSON keys, alphabetical JSON, JSON key sort, order JSON keys, JSON normaliser",
    howTo: [
      { title: "Paste your JSON", text: "Paste the JSON object or array you want to sort." },
      { title: "Choose sort direction", text: "Select ascending (A-Z) or descending (Z-A) key ordering." },
      { title: "Click Sort", text: "All object keys in the document - including deeply nested ones - are sorted." },
      { title: "Copy the sorted JSON", text: "Copy the result to use in your project or version control." },
    ],
    faqs: [
      { question: "Why would I sort JSON keys?", answer: "Sorted keys make JSON easier to scan visually, simplify manual comparison between documents, and produce consistent output for version control diffs - two JSON objects with the same data but different key order will show as identical in a diff after sorting." },
      { question: "Does sorting change the data?", answer: "No. JSON object keys are semantically unordered, so reordering them does not change what the JSON represents. All values remain associated with their correct keys." },
      { question: "Are arrays sorted?", answer: "Array items are not sorted - their order is meaningful and preserved. Only object keys (property names) are alphabetically reordered. If you need array items sorted, that requires a more specialised tool." },
      { question: "Does it sort nested objects too?", answer: "Yes. The sort is applied recursively throughout the entire document, including objects nested inside arrays or other objects." },
    ],
  },

  "json-merge": {
    tagline: "Deep-merge two JSON objects into one - nested objects are combined, with the second taking precedence on conflicts.",
    keywords: "JSON merge, merge JSON objects, deep merge JSON, combine JSON, JSON object merge, JSON union",
    howTo: [
      { title: "Paste the base JSON", text: "Enter the first (base) JSON object in the left panel." },
      { title: "Paste the override JSON", text: "Enter the second JSON object whose values will take precedence on any key conflict." },
      { title: "Click Merge", text: "The tool performs a deep merge and shows the combined result." },
      { title: "Copy the merged result", text: "Copy the merged JSON to use in your code or configuration." },
    ],
    faqs: [
      { question: "What is a deep merge?", answer: "A deep merge combines two objects recursively. When both objects share a key that contains another object, the nested objects are merged too rather than one replacing the other. A shallow merge would simply overwrite the nested object entirely." },
      { question: "What happens when both objects have the same key?", answer: "The second object's value wins. If both values are objects, they are recursively merged. If either value is a primitive, array, or null, the second value replaces the first." },
      { question: "How are arrays merged?", answer: "Arrays are replaced, not merged element-by-element. If both objects have the same key containing an array, the second object's array completely replaces the first. Array concatenation is not performed automatically." },
      { question: "Can I merge more than two objects?", answer: "The tool merges two objects at a time. To merge three or more objects, merge the first two, then paste the result as the base and merge with the third object." },
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
      { question: "What separator is used in the flattened keys?", answer: "By default the tool uses a dot (.) as the separator, producing keys like user.address.city. Some variants use forward slashes or underscores. The separator can be configured in the tool options." },
      { question: "How are arrays handled during flattening?", answer: "Array indices become part of the path. For example, {\"items\":[{\"id\":1}]} flattens to {\"items.0.id\":1}. Unflattening correctly reconstructs arrays from numeric indices in the path." },
    ],
  },

  "jsonpath-tester": {
    tagline: "Run JSONPath expressions against any JSON document and see matching results highlighted in real time.",
    keywords: "JSONPath tester, JSONPath online, test JSONPath, JSONPath query, JSONPath expression, JSON query tool, JSONPath evaluator",
    howTo: [
      { title: "Paste your JSON", text: "Enter the JSON document you want to query in the input panel." },
      { title: "Type a JSONPath expression", text: "Enter a JSONPath expression in the query field, for example $.users[*].email or $.store.book[?(@.price < 10)]." },
      { title: "See the results", text: "Matching nodes are shown in the results panel and highlighted in the source JSON." },
      { title: "Refine your query", text: "Adjust the expression and results update instantly until you get the data you need." },
    ],
    faqs: [
      { question: "What is JSONPath?", answer: "JSONPath is a query language for JSON, analogous to XPath for XML. It lets you navigate and extract values from JSON using path expressions. It is widely used in APIs, testing tools, and configuration systems." },
      { question: "What JSONPath syntax is supported?", answer: "This tool supports the standard JSONPath operators: $ (root), . (child), .. (recursive descent), * (wildcard), [n] (array index), [start:end] (slice), [?(expression)] (filter), and @ (current node in filter)." },
      { question: "What does $..price return?", answer: "The .. operator is the recursive descent operator. $..price returns all values with the key 'price' anywhere in the document, regardless of depth." },
      { question: "Can I use filter expressions?", answer: 'Yes. Filter expressions use the [?(@.property operator value)] syntax. For example, $.books[?(@.price < 20)] returns all book objects where price is less than 20.' },
      { question: "Are results shown as a JSON array?", answer: "Yes. The results panel shows matching values as a JSON array. If a single value matches, it appears as a one-element array. If no values match, an empty array is returned." },
    ],
  },

  // ─── Convert ──────────────────────────────────────────────────────────────

  "json-to-csv": {
    tagline: "Convert a JSON array of objects to a CSV file with auto-detected column headers.",
    keywords: "JSON to CSV, convert JSON to CSV, JSON array to CSV, JSON export CSV, JSON to spreadsheet, JSON to Excel CSV, nested JSON to CSV, JSON to CSV for Excel",
    howTo: [
      { title: "Paste a JSON array", text: "Paste a JSON array of objects - each object becomes a row in the CSV." },
      { title: "Review column headers", text: "Column headers are auto-detected from the object keys. You can customise them if needed." },
      { title: "Click Convert", text: "The CSV output appears instantly with headers in the first row." },
      { title: "Copy or download", text: "Copy the CSV to paste into a spreadsheet, or download as a .csv file." },
    ],
    faqs: [
      { question: "What JSON structure is needed for CSV conversion?", answer: "The input should be a JSON array of objects, where each object has the same set of keys. For example: [{\"name\":\"Alice\",\"age\":30},{\"name\":\"Bob\",\"age\":25}]. Each object becomes one CSV row." },
      { question: "What happens with nested objects in the JSON?", answer: "Nested objects are flattened using dot notation. A key like {\"address\":{\"city\":\"London\"}} becomes a column named address.city with the value London." },
      { question: "Are different delimiters supported?", answer: "The tool outputs standard comma-separated values (CSV). If you need tab-separated (TSV) or semicolon-separated output for European locales, a delimiter option is available in the tool settings." },
      { question: "Can I convert a single JSON object instead of an array?", answer: "A single object is converted to a two-column CSV: one column for keys and one for values. For relational CSV output, an array of objects is the expected input format." },
      { question: "What happens to rows that are missing a key?", answer: "CSV is a flat table, so every row needs the same columns. When one record has a key that another lacks, the missing cell is left empty in that row, and the column still appears because another record has it. If your data is ragged, normalise the keys first or accept empty cells in the output." },
      { question: "How do I stop Excel garbling special characters in my CSV?", answer: "Save or open the CSV as UTF-8. Excel on Windows sometimes reads a plain CSV as a legacy encoding, which mangles accented characters and symbols. Opening the file through the Text Import wizard and choosing UTF-8, or pasting into Google Sheets, avoids the problem." },
      { question: "Why do some of my values need quotes in the CSV?", answer: "Under RFC 4180, any value containing a comma, a double quote or a line break must be wrapped in double quotes, with inner quotes doubled. That is how a spreadsheet knows the comma inside \"Smith, John\" is part of the value and not a column separator." },
    ],
    pairGuide: {
      intro: "JSON to CSV is the step that turns API data into something a spreadsheet can open. APIs hand you nested objects and arrays; spreadsheets want flat rows and columns. This conversion flattens each object into one row, so a list of users, orders or products becomes a table you can sort, filter and chart without writing a script.",
      structureNote: "Each object in the JSON array becomes one CSV row, and each key becomes a column header. Nested objects are flattened with dot notation, so address.city becomes its own column, and arrays inside a record are kept as a single cell value rather than split into rows. A single JSON object converts to a two-column key/value table instead, because there is no list of rows to build from.",
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
    tagline: "Convert a CSV file to a JSON array of objects with automatic type detection for numbers and booleans.",
    keywords: "CSV to JSON, convert CSV to JSON, CSV to JSON array, CSV parser, spreadsheet to JSON, CSV converter, Excel to JSON, CSV quoted fields to JSON",
    howTo: [
      { title: "Paste your CSV", text: "Paste the CSV content - the first row should contain column headers." },
      { title: "Check delimiter detection", text: "The tool auto-detects commas, tabs, or semicolons as delimiters. Override if needed." },
      { title: "Click Convert", text: "Each CSV row becomes a JSON object with property names from the header row." },
      { title: "Copy the JSON array", text: "Copy or download the resulting JSON array." },
    ],
    faqs: [
      { question: "What happens if my CSV has no headers?", answer: "If the CSV has no header row, column names default to col1, col2, col3, etc. Enable the 'No headers' option in the tool to use this mode." },
      { question: "Are numbers and booleans auto-converted?", answer: "Yes. Values that look like integers, floats, true, false, or null are automatically converted to their JSON equivalents. Strings remain as strings." },
      { question: "Can I handle CSV with commas inside quoted fields?", answer: "Yes. The parser correctly handles RFC 4180 quoting - values containing commas, newlines, or double quotes are wrapped in double quotes in valid CSV and parsed correctly here." },
      { question: "What encoding does the converter support?", answer: "The converter handles UTF-8 encoded CSV, which covers most spreadsheet exports. For CSV with special characters, ensure your file is saved as UTF-8 before pasting." },
      { question: "Why do codes like 007 or 01234 change when converted?", answer: "Because automatic type detection turns digit-looking values into numbers, and numbers drop leading zeros. If a column holds postcodes, product codes or phone numbers, treat it as text: the value 007 is a code, not the number 7, and converting it to a number destroys information." },
      { question: "Why does splitting on commas break my CSV?", answer: "Because valid CSV allows commas inside quoted values, doubled quotes inside quoted values, and even line breaks inside a quoted cell. A naive split on every comma cuts those values in half. A real CSV parser respects the quoting rules in RFC 4180, which is why this converter parses rather than splits." },
      { question: "Should empty cells become empty strings or null?", answer: "It depends on what consumes the JSON. An empty string means the field was present but blank; null means it was absent or unknown. APIs that distinguish the two will behave differently, so check the target schema before deciding, and be consistent across rows." },
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
      { title: "Paste your YAML", text: "Paste the YAML content - single document or multi-document with --- separators." },
      { title: "Click Convert", text: "The tool parses the YAML and outputs the equivalent JSON." },
      { title: "Review the result", text: "Check that types (especially booleans and nulls) converted as expected." },
      { title: "Copy the JSON", text: "Copy the JSON output to use in your code or tools." },
    ],
    faqs: [
      { question: "What YAML features are supported?", answer: "The converter handles the most common YAML features: nested mappings and sequences, multiline strings (block scalars), anchors and aliases, explicit type tags (!str, !int), and comments (which are stripped in the JSON output)." },
      { question: "What happens to YAML comments?", answer: "JSON does not support comments, so all YAML comments are stripped from the output. The data content is not affected." },
      { question: "Are YAML anchors and aliases supported?", answer: "Yes. YAML anchors (&name) and aliases (*name) are resolved before conversion. The resulting JSON contains the full expanded values, not references." },
      { question: "What happens with YAML's yes/no/on/off booleans?", answer: "In YAML 1.1, yes, no, on, off are booleans. In YAML 1.2 only true and false are booleans. The converter uses YAML 1.2 by default, treating yes and no as strings unless quoted." },
      { question: "What does not survive a YAML to JSON conversion?", answer: "Comments are stripped, because JSON has no comments. Anchors and aliases are expanded into full copies, not preserved as references. Multi-document streams separated by --- become separate JSON values, and custom tags such as !Ref are not carried over as tags." },
      { question: "Why does the same YAML file parse differently in older tools?", answer: "YAML 1.1 treated yes, no, on and off as booleans; YAML 1.2 treats only true and false as booleans. A config written for one version can therefore change meaning in a parser built for the other, which is why checking boolean-like values after conversion matters." },
      { question: "Can I convert a GitHub Actions workflow to JSON?", answer: "Yes, for inspection or processing. Paste the workflow YAML and the output is the equivalent JSON structure, with jobs, steps and keys preserved. Comments and anchor shortcuts in the workflow are expanded or dropped as described above, so the JSON is for reading and tooling, not a drop-in replacement for the original file." },
    ],
    pairGuide: {
      intro: "YAML to JSON is the step that turns a config file into data a program can process. YAML is written for humans, but most APIs, validators and scripts want JSON. Converting a Docker Compose file, a GitHub Actions workflow or an application config to JSON lets you validate it, query it and feed it into tooling that never learned YAML.",
      structureNote: "Mappings become JSON objects, sequences become arrays, and scalar types follow YAML 1.2 rules: true and false are booleans, numbers stay numbers, and yes or no stay strings. Anchors and aliases resolve into full expanded values, comments disappear, and a multi-document file with --- separators yields separate JSON values rather than one document.",
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
      { question: "What happens with JSON keys that are not valid XML element names?", answer: "XML element names cannot start with numbers or contain spaces. Keys that would produce invalid XML names are sanitised by prefixing an underscore or replacing invalid characters." },
      { question: "Are JSON arrays converted to XML properly?", answer: "JSON arrays are expanded into repeated XML elements with the same tag. For example, {\"item\":[\"a\",\"b\"]} becomes <item>a</item><item>b</item>." },
      { question: "Can I convert XML back to JSON?", answer: "Yes. Use the XML to JSON converter on this site." },
      { question: "How do I convert a top-level JSON array to XML?", answer: "XML needs a single root element, but a JSON array has no name. The converter wraps the array in the root element you choose, and each item becomes a repeated element inside it, so [\"a\",\"b\"] under root items becomes repeated item elements. Without that wrapper there would be no valid XML document at all." },
      { question: "What is the difference between an XML attribute and an element?", answer: "JSON has no attributes, so the distinction has to be invented when converting. An element holds content or children, while an attribute holds metadata about its element. Systems such as SOAP services, RSS feeds and sitemaps often require a specific field to be an attribute, so check the target schema before converting rather than assuming elements will do." },
      { question: "How are special characters handled in XML output?", answer: "Characters that XML reserves, such as & and <, are escaped in text content, and keys that cannot be element names, such as keys starting with a digit or containing spaces, are sanitised. Null values have no natural XML form, so they typically become an empty element rather than a missing one." },
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
    tagline: "Parse XML documents and convert them to clean JSON objects with configurable attribute handling.",
    keywords: "XML to JSON, convert XML to JSON, XML JSON converter, XML parser, XML to JSON online, parse XML, SOAP XML to JSON, RSS XML to JSON",
    howTo: [
      { title: "Paste your XML", text: "Enter the XML document in the input panel." },
      { title: "Choose attribute handling", text: "Select whether XML attributes become properties or are prefixed (e.g. @name) in the JSON." },
      { title: "Click Convert", text: "The parsed JSON representation of the XML appears." },
      { title: "Copy the JSON", text: "Copy the resulting JSON for use in your code." },
    ],
    faqs: [
      { question: "How are XML attributes handled in the JSON output?", answer: "By default, XML element attributes are included in the JSON as properties prefixed with @ (e.g., @id, @class). You can disable this to ignore attributes or treat them as regular child properties." },
      { question: "What happens with text nodes and element children?", answer: "If an XML element has both text content and child elements, the text content is stored under a special key (usually #text or _) and the child elements are stored as their own keys." },
      { question: "Are XML namespaces preserved?", answer: "Namespace prefixes (e.g. ns:element) are preserved in the JSON key names as-is. Namespace declarations (xmlns:) are included as attributes by default." },
      { question: "Can I convert complex SOAP or API XML responses?", answer: "Yes. The converter handles any well-formed XML including SOAP envelopes, RSS feeds, and API responses. The resulting JSON may be deeply nested depending on the XML structure." },
      { question: "Why do different tools give different JSON for the same XML?", answer: "Because XML attributes have no single JSON equivalent. Some converters prefix them with @, some put them in an @attributes object, and some drop them entirely. This converter prefixes attributes with @ by default, so an id attribute becomes @id in the JSON. Knowing the convention matters before you write code against the output." },
      { question: "Can I convert XML to JSON and back without losing anything?", answer: "Not reliably. Comments, CDATA sections, the XML prolog and DOCTYPE, mixed content where text and elements sit side by side, and sometimes element order do not survive a round trip through JSON. Treat XML to JSON as a one-way step for processing, and keep the original XML if you need to reproduce it." },
      { question: "What happens when an element repeats three times?", answer: "Repeated sibling elements become a JSON array. Three item elements become one item key holding an array of three values, while a single item element stays a single value. That inconsistency is inherent to XML to JSON conversion, and code reading the output should handle both shapes." },
    ],
    pairGuide: {
      intro: "XML to JSON is the step that turns a document format into a data format. RSS feeds, SOAP responses, sitemaps and legacy API outputs arrive as XML, but modern JavaScript, Python and validation tooling all want JSON. Converting gives you objects and arrays you can query, filter and validate with ordinary code.",
      structureNote: "Elements become object keys, text content becomes the value, and repeated elements become arrays. Attributes are prefixed with @ by default, so id becomes @id, and an element that holds both text and children stores its text under a special key while its children become their own keys. Namespace prefixes stay attached to key names.",
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
      { title: "Choose draft version", text: "Select JSON Schema draft (draft-07 is most widely supported)." },
      { title: "Click Generate", text: "A JSON Schema is inferred from the structure and values of your sample." },
      { title: "Copy or refine", text: "Copy the schema and add constraints (minLength, pattern, enum) not inferrable from a single sample." },
    ],
    faqs: [
      { question: "What is JSON Schema?", answer: "JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It describes the structure, required fields, data types, and constraints of a JSON document. It is widely used for API request/response validation and documentation." },
      { question: "How accurate is the generated schema?", answer: "The generator infers types correctly from the sample. It cannot infer constraints like minimum string length, allowed enum values, or regex patterns - those require manual addition. Use the generated schema as a starting point." },
      { question: "What JSON Schema draft is supported?", answer: "The generator outputs draft-07 by default, which is the most widely supported version. Draft 2019-09 and 2020-12 options are also available. All three are structurally similar with incremental additions." },
      { question: "Can I generate a schema from multiple JSON samples?", answer: "Paste multiple samples by wrapping them in an array. The generator will merge type information across all items to produce a schema that validates any of them." },
    ],
  },

  "json-schema-validator": {
    tagline: "Validate JSON against any JSON Schema and get a clear list of every validation error with paths.",
    keywords: "JSON Schema validator, validate JSON schema, JSON schema check, JSON Schema testing, validate against schema, JSON Schema errors",
    howTo: [
      { title: "Paste your JSON Schema", text: "Enter the JSON Schema in the left panel." },
      { title: "Paste the JSON to validate", text: "Enter the JSON document you want to validate against the schema in the right panel." },
      { title: "Click Validate", text: "The tool runs the schema validation and lists every error with the exact JSON path." },
      { title: "Fix the errors", text: "Use the error paths and messages to correct the JSON document." },
    ],
    faqs: [
      { question: "What JSON Schema drafts are supported?", answer: "The validator supports draft-04, draft-06, draft-07, draft 2019-09, and draft 2020-12. The correct draft is auto-detected from the $schema property in your schema file." },
      { question: "What information does an error message include?", answer: "Each error includes the JSON path to the failing value (e.g. /users/0/email), the schema path (e.g. /properties/email/format), and a human-readable message describing what rule was violated." },
      { question: "Can I validate an array of objects?", answer: "Yes. If your JSON is an array, the schema should have type: array with an items definition. Every item in the array is validated against the items schema." },
      { question: "Does it support custom validation keywords?", answer: "The validator uses the AJV library which supports standard JSON Schema keywords. Custom vocabulary keywords defined with custom validators are not supported in this browser-based tool." },
    ],
  },

  "json-generator": {
    tagline: "Generate realistic mock JSON data from a template using Faker-style helpers for names, emails, dates, and more.",
    keywords: "JSON generator, mock JSON data, generate JSON, fake JSON data, JSON data generator, random JSON, test data generator",
    howTo: [
      { title: "Write a JSON template", text: "Create a JSON object template and use {{faker.helper}} placeholders where you want generated values." },
      { title: "Set the count", text: "If generating an array of objects, set how many items to produce." },
      { title: "Click Generate", text: "The tool replaces each placeholder with a realistic randomly generated value." },
      { title: "Copy or download", text: "Copy the generated JSON to use as test fixtures, seed data, or API mock responses." },
    ],
    faqs: [
      { question: "What helpers are available for generated values?", answer: "Available helpers include: name.fullName, internet.email, internet.url, phone.number, address.city, address.country, datatype.number, datatype.float, datatype.boolean, date.past, date.future, lorem.sentence, company.name, and many more." },
      { question: "Can I generate nested objects?", answer: "Yes. Templates can be arbitrarily nested. Each level of the template can contain helpers, static values, nested objects, or nested arrays." },
      { question: "Can I generate arrays of objects?", answer: "Yes. Wrap your template in an array and set the repeat count. Each item in the array uses the same template but generates fresh random values." },
      { question: "Is the generated data deterministic?", answer: "No - each time you click Generate, fresh random values are produced. For reproducible data, use a seeded random function, which is available as an advanced option." },
    ],
  },

  // ─── Encode & Inspect ─────────────────────────────────────────────────────

  "base64": {
    tagline: "Encode text to Base64 or decode Base64 strings back to plain text - instantly, in your browser.",
    keywords: "Base64 encode, Base64 decode, Base64 online, encode Base64, decode Base64, Base64 converter, text to Base64",
    howTo: [
      { title: "Choose Encode or Decode", text: "Select whether you want to encode plain text to Base64 or decode a Base64 string." },
      { title: "Paste your input", text: "Enter the text to encode, or the Base64 string to decode." },
      { title: "View the output", text: "The result appears instantly in the output panel." },
      { title: "Copy the result", text: "Click Copy to copy the encoded or decoded value to your clipboard." },
    ],
    faqs: [
      { question: "What is Base64?", answer: "Base64 is a binary-to-text encoding scheme that represents binary data using a set of 64 printable ASCII characters (A-Z, a-z, 0-9, +, /). It is used to encode binary data (like images or files) into text form so it can be safely transmitted in text-based systems like email, HTML, or JSON." },
      { question: "Is Base64 encryption?", answer: "No. Base64 is encoding, not encryption. It is fully reversible by anyone without a key. Never use Base64 to protect sensitive data - use a proper encryption algorithm instead." },
      { question: "What is URL-safe Base64?", answer: "Standard Base64 uses + and / characters which have special meaning in URLs. URL-safe Base64 replaces + with - and / with _, making the encoded string safe to include in URLs without percent-encoding." },
      { question: "Why does Base64 output end with = or ==?", answer: "Base64 encodes data in 3-byte groups. If the input length is not a multiple of 3, padding characters (=) are added to make the last group complete. One = means one padding byte was added; == means two." },
    ],
  },

  "jwt-decoder": {
    tagline: "Decode any JWT token to inspect its header and payload claims without needing the signing secret.",
    keywords: "JWT decoder, decode JWT, JWT inspector, JWT header payload, JSON Web Token decoder, JWT claims, JWT online",
    howTo: [
      { title: "Paste the JWT", text: "Paste the full JWT token (three Base64url-encoded parts separated by dots)." },
      { title: "Inspect header and payload", text: "The header (algorithm, type) and payload (claims, expiry) are decoded and displayed as formatted JSON." },
      { title: "Check expiry and claims", text: "exp, iat, and nbf timestamps are converted to readable dates automatically." },
      { title: "Copy decoded sections", text: "Copy the decoded header or payload JSON for use in debugging." },
    ],
    faqs: [
      { question: "Is it safe to paste a JWT here?", answer: "The decoder runs entirely in your browser - your JWT is never sent anywhere. However, treat JWTs as sensitive tokens and avoid pasting production tokens with long lifetimes into any online tool." },
      { question: "Does the decoder verify the JWT signature?", answer: "No. The decoder only decodes the Base64url-encoded header and payload. It does not verify the signature, which requires the signing secret or public key. Use this tool for inspection only, not for security validation." },
      { question: "What are JWT claims?", answer: "Claims are key-value pairs in the JWT payload. Standard claims include: iss (issuer), sub (subject), aud (audience), exp (expiry time), nbf (not before), iat (issued at), and jti (JWT ID). Custom claims are any additional properties added by the issuing application." },
      { question: "What algorithms does the header alg field refer to?", answer: "Common values: HS256 (HMAC-SHA256, symmetric), RS256 (RSA-SHA256, asymmetric), ES256 (ECDSA-SHA256, asymmetric). HS256 uses a shared secret; RS256 and ES256 use a public/private key pair." },
      { question: "Why is my token showing as invalid?", answer: "Ensure you are pasting the complete token including all three parts separated by dots. If the token was copied from a URL, check that URL encoding (such as %3D instead of =) has not been included." },
    ],
  },

  "json-token-counter": {
    tagline: "Estimate how many LLM tokens a JSON payload will consume before sending it to an AI API.",
    keywords: "JSON token counter, LLM token count, count tokens, JSON tokens, GPT token counter, LLM tokens estimate, AI token calculator",
    howTo: [
      { title: "Paste your JSON", text: "Paste the JSON payload you plan to send to an LLM API." },
      { title: "Select the model", text: "Choose the model family (GPT-4, GPT-3.5, Claude, etc.) for tokeniser-specific counting." },
      { title: "See the token count", text: "The estimated token count appears immediately along with the approximate API cost." },
      { title: "Optimise if needed", text: "If the count is too high, consider minifying the JSON or removing unused fields to reduce tokens." },
    ],
    faqs: [
      { question: "Why does token count matter for LLMs?", answer: "LLM APIs charge per token and have a maximum context window. Knowing the token count of your JSON payload helps you stay within limits, estimate costs, and avoid hitting context window errors in production." },
      { question: "What is a token?", answer: "A token is the basic unit that LLMs process. Tokens are not the same as words or characters - they are variable-length text chunks determined by the model's tokeniser. Common English words are usually one token; long words, JSON syntax, and non-English characters may be multiple tokens." },
      { question: "How accurate is the estimate?", answer: "The counter uses the same tokeniser libraries that the model providers use (tiktoken for OpenAI models, approximate estimates for others). For OpenAI models the count is exact; for other models it is an estimate within a few percent." },
      { question: "Does minifying JSON reduce token count?", answer: "Yes. Minifying removes whitespace, which means fewer characters and therefore fewer tokens. For large JSON payloads, minifying can reduce token count by 15-30%." },
    ],
  },
};

export function getJsonToolContent(slug: string): JsonToolContent | undefined {
  return content[slug];
}

export default content;
