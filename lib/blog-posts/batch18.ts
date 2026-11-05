import type { BlogPost } from "@/lib/blog";

export const batch18: BlogPost[] = [
  {
    slug: "json-vs-csv-spreadsheets",
    title: "JSON vs CSV for Spreadsheets: When to Convert and What Breaks",
    seoTitle: "JSON vs CSV for Spreadsheets: When to Convert and What Breaks",
    excerpt:
      "JSON and CSV solve different problems, and most conversion bugs come from picking the wrong format or converting carelessly. This guide compares the two with real size numbers, shows the same data in both formats, and lists the five traps that break spreadsheets: leading zeros, dates, nested data, ragged rows, and encoding.",
    author: "Wahaj Ansari",
    publishedAt: "2026-11-05",
    readingTime: 11,
    category: "JSON",
    tags: ["JSON", "CSV", "Spreadsheets", "Data", "Excel", "Conversion"],
    content: `<p>The short answer: use CSV when the data is a flat table and the destination is a spreadsheet, a database import, or a report someone will open in Excel. Use JSON when the data has nesting, optional fields, or types that must survive the trip, such as an order with line items, or when the destination is an API, an app, or a script. Neither format is better in general. They solve different problems, and most of the pain people blame on one format or the other actually comes from converting between them without checking what the conversion destroys.</p>
<p>This guide compares the two formats side by side with real numbers, shows the same three orders written in both, and walks through the five traps that break spreadsheets most often: leading zeros, ambiguous dates, nested data, ragged rows, and character encoding. It also gives a short workflow that avoids all five, using the free converters on this site, which run entirely in your browser and never upload your data.</p>

<h2>The one sentence difference</h2>
<p>CSV is a flat table: rows and columns of plain text, one record per line, with the meaning of each value supplied by the header row. JSON is a tree: objects and arrays that can nest to any depth, where every value carries its own key and its own type. That single difference explains almost everything else. CSV is smaller and opens directly in spreadsheets because a table is exactly what a spreadsheet is. JSON is more expressive because a tree can hold an order, its customer, and its five line items in one record, while CSV has to flatten that into five rows or cram the items into one cell.</p>
<p>JSON also carries types. The value 30 is a number, the value "30" is a string, true is a boolean, and null means explicitly empty. CSV has no types at all: every field is text until the program reading it decides otherwise. That is why a spreadsheet can silently turn a product code into a different number, and why a date written as 03/04/2026 means 3 April in most of the world and 4 March in the United States. The format did not lose the information. It never had it.</p>

<h2>JSON vs CSV at a glance</h2>
<table>
<tr><th></th><th>CSV</th><th>JSON</th></tr>
<tr><td>Shape</td><td>Flat table: rows and columns</td><td>Nested tree: objects and arrays</td></tr>
<tr><td>Types</td><td>None: everything is text</td><td>String, number, boolean, null, array, object</td></tr>
<tr><td>Opens in Excel</td><td>Yes, double click or import</td><td>Not directly: convert first</td></tr>
<tr><td>Best for</td><td>Spreadsheet handoffs, database imports, flat reports</td><td>APIs, apps, config, nested or typed records</td></tr>
<tr><td>File size for flat tables</td><td>Smaller: headers listed once</td><td>Larger: keys repeat on every record</td></tr>
<tr><td>Nesting</td><td>Not supported: flatten or split into tables</td><td>Native: objects inside objects, arrays inside objects</td></tr>
<tr><td>Standard</td><td>RFC 4180, loosely followed</td><td>RFC 8259</td></tr>
<tr><td>Missing values</td><td>Empty cell</td><td>Missing key or explicit null</td></tr>
</table>
<p>If the table above is all you need, the decision rule is one line: if the data is naturally a table and the next person opens it in a spreadsheet, ship CSV. If the data has structure that a table cannot hold, or the next program is an API, ship JSON. The rest of this guide is about the cases where that rule is not enough, and about what breaks when you move between the two.</p>

<h2>Worked example: the same three orders in both formats</h2>
<p>Take three small orders. As JSON, each order is one object with five named fields, and the three objects sit in an array:</p>
<pre><code>[{"order":"A1001","customer":"Mina","item":"Desk lamp","qty":2,"price":24.99},{"order":"A1002","customer":"Omar","item":"Notebook","qty":5,"price":4.5},{"order":"A1003","customer":"Sara","item":"Keyboard","qty":1,"price":59}]</code></pre>
<p>As CSV, the same data is a header row plus three data rows:</p>
<pre><code>order,customer,item,qty,price
A1001,Mina,Desk lamp,2,24.99
A1002,Omar,Notebook,5,4.5
A1003,Sara,Keyboard,1,59</code></pre>
<p>Both hold exactly the same information, but the CSV is 109 bytes against 225 bytes for the compact JSON, roughly half the size, because the keys order, customer, item, qty, and price are written once in the header instead of three times. That gap grows with scale. On a generated table of 10,000 product rows with five short columns, the compact JSON measured 840,254 bytes, the pretty printed JSON with two space indentation measured 1,200,255 bytes, and the CSV measured 390,281 bytes. CSV is 53.6 percent smaller than compact JSON and 67.5 percent smaller than pretty JSON for the same flat data. The lesson is not that CSV is always smaller: for nested data the comparison reverses, because CSV has to repeat or duplicate rows to represent structure that JSON holds once. But for a flat export, CSV is the compact choice by a wide margin.</p>
<p>Try it yourself with our <a href="/json-to-csv">JSON to CSV</a> converter: paste the three orders above, and the CSV appears instantly. Going the other way, our <a href="/csv-to-json">CSV to JSON</a> converter turns the CSV back into an array of objects. One detail worth knowing: our CSV to JSON converter keeps every value as a string, so the code 007 stays "007" and the price 19.99 stays "19.99". That protects codes and identifiers, but it means numbers and booleans need parsing by whatever consumes the JSON next. Our <a href="/blog/json-to-csv-complete-guide">complete JSON to CSV guide</a> covers the conversion step itself in detail.</p>

<h2>When CSV wins for spreadsheets</h2>
<p>CSV wins whenever the destination is a person with a spreadsheet. Excel, Google Sheets, and LibreOffice Calc all open CSV directly, and a CSV file can be handed to an accountant, a client, or a colleague with no instructions beyond "double click it". The same is true for bulk imports: PostgreSQL COPY, MySQL LOAD DATA, BigQuery, and most CRM import screens have a CSV path that is faster and better tested than any JSON import, because CSV is the format those tools were built around.</p>
<p>CSV also wins on size and simplicity for flat reporting. A monthly sales export, a sensor log, a contact list, or a product catalogue with fixed columns is a table, and a table belongs in CSV. There is no nesting to preserve, no optional fields to model, and no types that a spreadsheet cannot reapply on import. The file is smaller, it streams row by row, and a million row export is routine where the equivalent JSON would be roughly twice the size and far harder to open in a spreadsheet.</p>
<p>One hard limit to know: Excel allows 1,048,576 rows per sheet. A CSV with more rows than that will not fit in one Excel sheet, and older tools and some import screens have lower limits still. If your export is that large, split it into chunks before handing it over, or keep it in JSON and process it with a script instead of a spreadsheet.</p>

<h2>When JSON wins</h2>
<p>JSON wins the moment the data stops being a table. An order with a customer object and an array of line items cannot be written as one CSV row without flattening, and flattening it means either repeating the order details on every line item row or joining the items into a single cell as text. Both workarounds lose something: the first duplicates data and makes edits error prone, the second turns structured data into a string that no spreadsheet formula can read.</p>
<p>JSON also wins when types matter. A price of 19.99, a quantity of 2, and a flag of true are three different kinds of value, and JSON keeps them distinct. In CSV they are all text, and the program reading the file has to guess. Most guesses are right for plain numbers, but guesses fail on codes, dates, and anything that looks like a number but is not one, which is exactly the trap in the next section.</p>
<p>The third JSON win is optional and ragged data. Real records rarely all have the same fields: one customer has a phone number, another has a loyalty ID, a third has neither. JSON handles that naturally, because a missing key simply does not appear. CSV has to carry the column anyway and leave the cell empty, so a file built from ragged records ends up mostly empty cells with a long header row. If most of your columns are empty for most of your rows, the data is not really a table, and JSON is the honest format for it.</p>

<h2>What breaks when you convert</h2>
<p>Conversion is where the damage happens, and the same five traps appear in almost every broken spreadsheet handoff. They are all avoidable once you know to look for them.</p>
<p><strong>1. Leading zeros disappear.</strong> A product code of 007, a postcode of 01234, or a phone number starting with 0 is text, not a number. But a spreadsheet or a converter that infers types will read the digits, store the number 7, and the code is destroyed. The defence is to keep codes as strings everywhere: quote them in JSON, and when importing CSV into Excel, mark the column as Text in the import wizard instead of letting Excel guess. Our CSV to JSON converter never infers types, so codes survive the trip in that direction, but Excel itself will still guess unless you tell it not to.</p>
<p><strong>2. Dates get reinterpreted.</strong> CSV has no date type, so 03/04/2026 is just text, and the reader decides what it means. In the United States it is 4 March; in most of the rest of the world it is 3 April. The fix is to write dates in ISO 8601 form, 2026-04-03, which is unambiguous everywhere, and to store them as strings in JSON. If you receive a CSV with slash dates, find out which convention the sender used before you sort or filter by date, because a wrong guess silently scrambles the order.</p>
<p><strong>3. Nested data has nowhere to go.</strong> Our <a href="/json-to-csv">JSON to CSV</a> converter puts a nested object into a single cell as a JSON string, for example {"city":"London"} inside the address column. That is honest, but it is not a column, and no spreadsheet can filter on the city inside that string. The right move is to flatten first: our <a href="/json-flatten">JSON Flatten</a> tool turns {"address":{"city":"London"}} into {"address.city":"London"}, which converts to a real address.city column. For arrays of objects, such as order line items, the clean options are a second table with one row per item, or keeping the data in JSON. Stuffing an array into a cell is a last resort, not a plan.</p>
<p><strong>4. Ragged rows leave empty cells.</strong> When records have different keys, the CSV carries every key as a column and fills the gaps with empty cells. That is correct behaviour, but a file where half the cells are empty is a sign the data was not tabular to begin with. Before converting, check whether the keys are consistent across records. If they are not, either normalise the keys first or keep the data in JSON.</p>
<p><strong>5. Encoding garbles non-English text.</strong> CSV files are usually UTF-8, but Excel on Windows sometimes opens a plain CSV as a legacy encoding, which turns accented characters, Arabic script, and symbols into gibberish. The fix is to open the file through Excel's Text Import wizard and choose UTF-8, or to paste the data into Google Sheets, which handles UTF-8 correctly. If you are generating the CSV yourself, a UTF-8 byte order mark at the start of the file makes Excel on Windows detect the encoding correctly.</p>

<h2>A conversion workflow that avoids the traps</h2>
<p>Put the traps together and the safe workflow is five steps. First, decide the destination: spreadsheet or database import means CSV, API or script means JSON, and if you are unsure, keep the JSON as the master copy and generate CSV from it, never the other way round. Second, flatten nested objects before converting to CSV, using the JSON Flatten tool, and split arrays of objects into a second table when they carry real data. Third, write dates as 2026-04-03 and keep codes such as 007 as quoted strings. Fourth, convert with the tool on this page, then open the result and check the first five rows and the last row before you trust the whole file: headers present, codes intact, dates in the right order, no JSON strings hiding in cells. Fifth, when handing CSV to an Excel user, tell them to import with UTF-8 encoding and Text format for code columns, or send a file with a UTF-8 byte order mark so Excel detects it on its own.</p>
<p>For the round trip, keep the original JSON. Converting JSON to CSV and back does not restore the original: types are lost, nested objects become strings or flattened columns, key order may change, and empty cells come back as empty strings rather than missing keys. The CSV is a view of the data for a spreadsheet, not a backup of it. If you need the data back in JSON later, convert from the saved original, not from the CSV.</p>

<h2>What about real Excel files?</h2>
<p>Sometimes CSV is not enough, because the recipient needs formatting, multiple sheets, or formulas. That is what .xlsx is for, and it is a different format from CSV: a zipped bundle of XML files, not plain text. If you need a real spreadsheet file rather than a CSV, our <a href="/json-to-excel">JSON to Excel</a> converter builds one directly from JSON, and the reverse direction is covered by our <a href="/blog/json-vs-yaml-vs-toml-config-formats">JSON vs YAML vs TOML guide</a> for config formats and our <a href="/blog/what-is-json-and-why-it-matters">beginner's guide to JSON</a> for the format itself. As a rule of thumb, CSV is the right handoff for data, .xlsx is the right handoff for a formatted document, and JSON is the right handoff for a program.</p>
<p>The decision is simple once the destination is clear. A flat table going to a person with a spreadsheet is CSV. A nested or typed record going to an API, an app, or a script is JSON. Anything else is a conversion, and conversions deserve the five minute check in the workflow above, because the traps in this guide are silent: the file still opens, the rows still look right, and the damage only shows up when a code has lost its zero or a date has moved by a month.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Should I use JSON or CSV for Excel?</dt>
<dd>Use CSV. Excel opens CSV directly, and a flat table with consistent columns is exactly what CSV is for. Convert your JSON to CSV first, check the first few rows for leading zeros and date formats, then open it in Excel. If you need formatting or multiple sheets, generate a real .xlsx file instead of a CSV.</dd>
<dt>Is JSON or CSV smaller?</dt>
<dd>For flat tabular data, CSV is much smaller, because the column names are written once in the header row instead of repeated on every record. On a measured 10,000 row table with five short columns, CSV was 390,281 bytes against 840,254 bytes for compact JSON and 1,200,255 bytes for pretty printed JSON, so CSV was about 54 percent smaller than compact JSON. For nested data the comparison reverses, because CSV has to duplicate rows or cram structure into single cells.</dd>
<dt>Why do leading zeros disappear in my spreadsheet?</dt>
<dd>Because the spreadsheet or converter read a code such as 007 as the number 7. Codes, postcodes, and phone numbers are text, not numbers, and they must be kept as strings. When importing CSV into Excel, set the column format to Text in the import wizard instead of letting Excel guess, and keep codes quoted as strings in JSON.</dd>
<dt>Can CSV handle nested JSON data?</dt>
<dd>Not directly. CSV is flat, so a nested object has to be flattened into dot notation columns such as address.city, or stored as a JSON string inside one cell, which a spreadsheet cannot filter on. Flatten first with a JSON Flatten tool, or split arrays of objects into a second table. If the nesting itself matters, keep the data in JSON.</dd>
<dt>What date format should I use in CSV files?</dt>
<dd>Use ISO 8601, written as 2026-04-03, which is unambiguous everywhere. Slash dates such as 03/04/2026 mean 4 March in the United States and 3 April in most of the rest of the world, so a spreadsheet that guesses the convention can silently reorder your dates. Store dates as strings in JSON for the same reason.</dd>
<dt>Can I convert CSV back to the original JSON?</dt>
<dd>Not exactly. Converting JSON to CSV loses types, flattens or stringifies nested data, and turns missing keys into empty cells, and converting back cannot restore what was lost. Empty cells come back as empty strings rather than missing keys, and numbers come back as strings unless the consumer parses them. Keep the original JSON as the master copy and treat CSV as a one way view for spreadsheets.</dd>
</dl>
</section>`,
  },
];
