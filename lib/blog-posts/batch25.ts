import type { BlogPost } from "@/lib/blog";

export const batch25: BlogPost[] = [
  {
    slug: "fix-invalid-json-errors",
    title: "How to Fix Invalid JSON: The 7 Errors That Break Your File (and How to Fix Each One)",
    seoTitle: "How to Fix Invalid JSON: 7 Common Syntax Errors and Their Fixes",
    excerpt:
      "A JSON file that will not parse is almost always broken by one of seven small mistakes. Here is how to read the error message, find the exact line, and fix each error with a before and after example, plus a five minute workflow that takes a file from red to valid.",
    author: "Wahaj Ansari",
    publishedAt: "2026-11-12",
    readingTime: 13,
    category: "JSON",
    tags: ["JSON", "JSON Validator", "Syntax Errors", "Debugging", "APIs"],
    content: `<p>The short answer: paste the broken JSON into a validator, read the line and column in the error message, and fix the one character the parser stopped at. Most invalid JSON comes down to one of seven mistakes: a trailing comma, single quotes, an unquoted key, a comment, a missing comma or colon, a value JSON does not allow such as NaN, or extra content after the value. This guide shows each error with a broken example and the fixed version, explains what the error message means, and gives you a five minute workflow that takes a file from red to valid. Everything it links to runs in your browser, so the data you paste never leaves your device.</p>
<p>JSON is strict by design. It has no forgiving fallbacks: one stray comma or one unquoted key and the whole document is rejected, even if the other 999 lines are perfect. That strictness is also good news, because it means the fix is usually a single character. The hard part is finding it, and that is what the first section covers. If you already know where the error is, skip to the error list. If you want the fastest route, skip to the five minute workflow and let our <a href="/json-repair">JSON Repair</a> tool fix the common cases for you.</p>

<h2>Read the error message before you touch the file</h2>
<p>When a parser rejects JSON it throws an error with two pieces of information: a description of what went wrong, and the position where it failed. In JavaScript that looks like <code>SyntaxError: Unexpected token ',' in JSON at position 42</code>. The position is a character count from the start of the string, not a line number, which makes it hard to use on its own in a long file. Our <a href="/json-validator">JSON Validator</a> converts that position into a line and column for you, so the same error reads as <code>Unexpected token ',' in JSON at position 42 (line 6, column 12)</code>, and you can jump straight to the spot. It also tells you what the document is when it parses cleanly, for example <code>Valid JSON - Object with 4 keys</code> or <code>Valid JSON - Array with 12 items</code>, which is a quick sanity check that the structure is what you expected.</p>
<p>The exact wording varies between parsers. Chrome, Firefox, Node.js, and Python each phrase the same failure differently, and the wording changed between browser versions too. The underlying cause is always the same, so learn to read the cause instead of memorising the message. Three messages cover most cases. <code>Unexpected token</code> means the parser found a character it did not expect at that position, which is the message behind trailing commas, single quotes, unquoted keys, and comments. <code>Unexpected end of JSON input</code> means the text ran out before the document was complete, which usually means an unclosed string, object, or array. <code>Expected property name</code> means the parser was looking for a quoted key and found something else, which is the classic unquoted key error. The table below maps the common messages to their causes.</p>

<h2>Quick reference: error message, cause, and fix</h2>
<table>
<tr><th>Error message</th><th>Most likely cause</th><th>Fix</th></tr>
<tr><td>Unexpected token , in JSON at position N</td><td>Trailing comma before } or ]</td><td>Delete the comma after the last item</td></tr>
<tr><td>Unexpected token ' in JSON at position N</td><td>Single-quoted string or key</td><td>Change the quotes to double quotes</td></tr>
<tr><td>Expected property name or '}' in JSON at position N</td><td>Unquoted key</td><td>Put double quotes around the key</td></tr>
<tr><td>Unexpected token / in JSON at position N</td><td>A comment in the file</td><td>Remove the comment entirely</td></tr>
<tr><td>Expected ',' or '}' in JSON at position N</td><td>Missing comma or colon between entries</td><td>Add the missing comma or colon</td></tr>
<tr><td>Unexpected token N or U in JSON at position N</td><td>NaN, Infinity, or undefined as a value</td><td>Replace it with null or a real number</td></tr>
<tr><td>Unexpected non-whitespace character after JSON at position N</td><td>Trailing content after the root value</td><td>Delete everything after the closing bracket</td></tr>
<tr><td>Unexpected end of JSON input</td><td>Unclosed string, object, or array</td><td>Close the missing quote or bracket</td></tr>
</table>
<p>Keep this table open while you work through the errors below. Each row is one section, with a broken example, the fixed version, and a note on whether our repair tool can fix it for you.</p>

<h2>Error 1: a trailing comma after the last item</h2>
<p>This is the single most common JSON error, and it comes from habit. JavaScript allows a trailing comma after the last item in an object or array, and so do many other languages, so developers write them without thinking. Strict JSON forbids them: after the last item the parser expects a closing bracket, and a comma tells it another item is coming. When it finds the bracket instead, it stops.</p>
<pre><code>// BROKEN
{
  "name": "Ada",
  "age": 30,
}</code></pre>
<pre><code>// FIXED
{
  "name": "Ada",
  "age": 30
}</code></pre>
<p>The same rule applies inside arrays: <code>[1, 2, 3,]</code> is invalid for the same reason. The fix is always the same: delete the comma before the closing bracket. It is the easiest error to make and the easiest to miss, because the comma looks harmless and the error position points at the closing bracket, one character past the real problem. Our <a href="/json-repair">JSON Repair</a> tool removes trailing commas automatically, and it is one of the six fixes it reports by name.</p>

<h2>Error 2: single quotes instead of double quotes</h2>
<p>JSON requires double quotes around every string and every key. Single quotes are valid in JavaScript, Python, and many other languages, so code copied out of a program often arrives wrapped in them. A JSON parser rejects them on sight. The rule is absolute: there is no setting or mode that makes single quotes valid JSON.</p>
<pre><code>// BROKEN
{
  'name': 'Ada',
  'active': true
}</code></pre>
<pre><code>// FIXED
{
  "name": "Ada",
  "active": true
}</code></pre>
<p>Replace every single quote with a double quote. Watch out for apostrophes inside string values, because a sentence such as <code>It's ready</code> contains a single quote that is part of the text, not a delimiter, and a careless find and replace will break it. If the string itself contains double quotes, escape them with a backslash, as in <code>"She said \"hello\""</code>. Our repair tool converts single-quoted strings to double-quoted strings and escapes any double quotes it finds inside them.</p>

<h2>Error 3: unquoted keys</h2>
<p>In JavaScript you can write <code>{name: "Ada"}</code> and it works. In JSON it does not. Every key in a JSON object must be a double-quoted string, including short keys such as <code>id</code> and <code>ok</code> that look fine without quotes. The parser expects a quoted property name right after an opening brace or a comma, and the first letter of an unquoted key is a character it cannot place, so it stops there.</p>
<pre><code>// BROKEN
{
  name: "Ada",
  age: 30
}</code></pre>
<pre><code>// FIXED
{
  "name": "Ada",
  "age": 30
}</code></pre>
<p>Put double quotes around every key. This error is common in config files and API payloads that were written by hand or copied from JavaScript examples. Our repair tool quotes unquoted keys automatically, including keys that start with a letter, an underscore, or a dollar sign.</p>

<h2>Error 4: comments in the file</h2>
<p>JSON has no comment syntax at all. Neither <code>//</code> line comments nor <code>/* */</code> block comments are valid, even though the file they sit in might be a config file that a human needs to annotate. The parser sees the first slash and stops, because a slash is not a valid start for any JSON value.</p>
<pre><code>// BROKEN
{
  // user's display name
  "name": "Ada",
  /* created in 2026 */
  "age": 30
}</code></pre>
<pre><code>// FIXED
{
  "name": "Ada",
  "age": 30
}</code></pre>
<p>Remove the comments entirely. If you need commented configuration, use a format that supports it, such as YAML or JSONC, which is the commented JSON dialect VS Code uses for settings files. Our guide on <a href="/blog/what-is-json-and-why-it-matters">what JSON is and why it matters</a> covers the JSON versus YAML choice in more detail. If you must keep the notes, move them into a string value such as <code>"_comment": "user's display name"</code>, which is valid JSON even if it is a workaround. Our repair tool strips both line comments and block comments for you.</p>

<h2>Error 5: a missing comma, colon, or closing quote</h2>
<p>This error covers three small omissions that all produce a confusing message, because the parser only notices the problem one token after the missing character. A missing comma between two entries makes the parser read the next key as a continuation of the previous value. A missing colon makes it read the value as a second key. A missing closing quote makes it swallow everything that follows as part of one long string, until the file ends or a later quote confuses it further. In all three cases the reported position is usually one line below the real mistake, so look at the line above the reported one first.</p>
<pre><code>// BROKEN: missing comma after the first entry
{
  "name": "Ada"
  "age": 30
}</code></pre>
<pre><code>// FIXED
{
  "name": "Ada",
  "age": 30
}</code></pre>
<pre><code>// BROKEN: missing closing quote on the string
{
  "name": "Ada,
  "age": 30
}</code></pre>
<pre><code>// FIXED
{
  "name": "Ada",
  "age": 30
}</code></pre>
<p>A missing colon looks like this: <code>{"name" "Ada"}</code>, fixed by writing <code>{"name": "Ada"}</code>. Check every key for a colon after its closing quote and every entry except the last for a comma after its value. This is the one common error our repair tool cannot fix: it cannot know where you meant the comma or quote to go, so a missing comma, colon, or closing quote has to be fixed by hand. That is why the validator's line and column matter so much here. For a closer look at how JSON is structured, our beginner guide to <a href="/blog/what-is-json-and-why-it-matters">what JSON is</a> walks through the six value types and the object and array syntax.</p>

<h2>Error 6: NaN, Infinity, and undefined as values</h2>
<p>JSON allows exactly six kinds of value: string, number, boolean, null, array, and object. <code>NaN</code>, <code>Infinity</code>, and <code>undefined</code> are JavaScript values, not JSON values, and they appear in JSON files when data is copied out of a JavaScript console or built by hand from JavaScript habits. The parser rejects them because they are not numbers and not any other valid type. Python code causes the same problem with capitalised values: <code>True</code>, <code>False</code>, and <code>None</code> must become lowercase <code>true</code>, <code>false</code>, and <code>null</code>.</p>
<pre><code>// BROKEN
{
  "score": NaN,
  "limit": Infinity,
  "nickname": undefined
}</code></pre>
<pre><code>// FIXED
{
  "score": null,
  "limit": null,
  "nickname": null
}</code></pre>
<p>Replace <code>NaN</code> and <code>Infinity</code> with <code>null</code> when the value is genuinely unknown, or with a real number when you know what it should be, for example <code>0</code> for a missing score. Replace <code>undefined</code> with <code>null</code> or delete the key entirely if the field is optional. Our repair tool replaces <code>undefined</code>, <code>NaN</code>, and both positive and negative <code>Infinity</code> with <code>null</code> and tells you it did so. It does not convert Python style <code>True</code>, <code>False</code>, or <code>None</code>, so those need a manual find and replace.</p>

<h2>Error 7: trailing content after the root value</h2>
<p>A JSON document is exactly one value: one object, one array, one string, or one number. Anything after that value is an error, even if it is perfectly valid JSON on its own. This happens when two objects get pasted into one file, when a log line is appended to a JSON dump, or when an API returns an error page after the JSON body. The parser reads the first value, then finds more text where it expected the end of the file.</p>
<pre><code>// BROKEN: two objects in one file
{"id": 1, "name": "Ada"}
{"id": 2, "name": "Grace"}</code></pre>
<pre><code>// FIXED: one array holding both objects
[
  {"id": 1, "name": "Ada"},
  {"id": 2, "name": "Grace"}
]</code></pre>
<p>The fix depends on what the extra content is. If it is a second object that belongs with the first, wrap both in an array as above. If it is a log line, a stray word, or a fragment, delete it. If the file starts with a web page instead of JSON, usually an HTML error page beginning with <code>&lt;!DOCTYPE html&gt;</code>, the problem is upstream: the server returned an error instead of data, and no amount of editing the text will fix it. Check the response status and the raw body before parsing, which the next section covers. Our repair tool does not remove trailing content, because it cannot tell which of two values you meant to keep.</p>

<h2>The error no validator catches: duplicate keys</h2>
<p>Duplicate keys are the one error on this list that does not break parsing at all, which makes them more dangerous than the other seven. JSON parsers accept an object with the same key twice and silently keep the last value, so the file validates cleanly while the data is wrong. A config file with two <code>"timeout"</code> entries uses whichever one comes second, and nothing in the error output tells you the first one was ignored.</p>
<pre><code>// PARSES, BUT WRONG: the first timeout is silently lost
{
  "timeout": 30,
  "retries": 3,
  "timeout": 60
}</code></pre>
<pre><code>// FIXED: one entry, the value you actually want
{
  "timeout": 60,
  "retries": 3
}</code></pre>
<p>Delete the entry you do not want and keep one. Our validator reports this file as valid, because it is valid JSON, and our repair tool leaves duplicate keys alone for the same reason. The defence is a habit, not a tool: when a value looks wrong in your app but the JSON validates, search the file for the key and count how many times it appears. A quick way to spot it is to paste the file into our <a href="/json-formatter">JSON Formatter</a> with the sort keys option on, which groups duplicate keys next to each other in the output.</p>

<h2>The five minute repair workflow</h2>
<p>When a file will not parse, work in this order instead of editing blindly. It takes about five minutes and it works for almost every broken file.</p>
<p><strong>Step 1: validate and note the line and column.</strong> Paste the file into our <a href="/json-validator">JSON Validator</a>. It shows the error with the line and column, which tells you where to look, and it accepts a file upload if the JSON is too long to paste. If it says the file is valid, the problem is not syntax: check for duplicate keys, or check whether the data matches what your code expects, which is a schema problem rather than a syntax problem. Our guide to <a href="/blog/json-schema-beginners-guide">JSON Schema</a> covers that side of validation.</p>
<p><strong>Step 2: run the repair tool.</strong> Paste the same text into our <a href="/json-repair">JSON Repair</a> tool. It fixes five of the seven errors in this guide automatically: it removes line and block comments, converts single quotes to double quotes, quotes unquoted keys, removes trailing commas, and replaces <code>undefined</code>, <code>NaN</code>, and <code>Infinity</code> with <code>null</code>. It then lists exactly what it fixed, for example <code>Fixed: Removed trailing commas, Quoted unquoted object keys.</code> If the file was already valid it says so plainly instead of changing anything. If it cannot repair the file it says <code>Could not fully repair</code> and shows the remaining error, which means the file has one of the problems the tool cannot fix, usually a missing comma or an unclosed bracket.</p>
<p><strong>Step 3: fix what the repair tool cannot.</strong> The repair tool cannot add a missing comma, colon, or closing quote, close an unclosed bracket, remove trailing content, or resolve duplicate keys. Those need a human decision, and the line and column from step 1 tells you where to make it. Open the file in our <a href="/json-editor">JSON Editor</a>, which validates as you type and shows the parser error under the text, and fix the flagged spot. Then paste the result into the repair tool again in case a second, hidden error was sitting behind the first one.</p>
<p><strong>Step 4: format and confirm.</strong> Paste the repaired text into our <a href="/json-formatter">JSON Formatter</a>, choose 2 space indent, and check the result. Switch to the tree view to confirm the structure is what you expected: every object and array in the right place, no missing entries, no duplicated keys sitting side by side. The formatter also autosaves your input in your browser, so a refresh never loses the file, and you can download the result as a formatted file. Finally, paste the formatted output back into the validator and confirm it reports valid JSON. If you need a clean readable copy for a report or a handoff, our <a href="/json-beautifier">JSON Beautifier</a> does the same tidy up with a single indent setting and an optional sort keys toggle.</p>

<h2>When the JSON comes from an API</h2>
<p>Not every invalid JSON error lives in a file you typed. The most common API version looks like this: a request that should return JSON returns an HTML error page instead, and the parser fails at position 0 on the first character of <code>&lt;!DOCTYPE html&gt;</code>. Before you parse any response, read the raw body. In JavaScript, call <code>response.text()</code> and inspect the string before calling <code>JSON.parse</code> on it, and check the response status first: a 404 or 500 page is HTML, not JSON, and no repair tool can turn it into data.</p>
<p>The other API causes are truncation and empty bodies. A response cut short by a timeout or a size limit ends mid string or mid object, which produces <code>Unexpected end of JSON input</code>. The fix is upstream: retry the request, raise the timeout, or page through the data in smaller chunks. An empty response body is not valid JSON either, because there is no value at all, so guard it with a check such as <code>text ? JSON.parse(text) : null</code> instead of parsing blindly. A byte order mark, an invisible character some editors and servers put at the very start of a file, also breaks parsing at position 0; delete the first character or re-save the file as plain UTF-8 without it. In every case, validate the raw text before it reaches your application code, because a parser error caught at the boundary is a log line, while the same error caught deep inside your logic is a crash.</p>

<h2>Stop it happening again</h2>
<p>The cheapest fix for invalid JSON is never writing it by hand. Generate JSON with a serialiser instead of building strings: <code>JSON.stringify</code> in JavaScript, <code>json.dumps</code> in Python, and the equivalent in every other language produce valid JSON by construction, including correct quoting, escaping, and commas. When you must edit a file by hand, edit it in our <a href="/json-editor">JSON Editor</a>, which validates live as you type and shows the parser error the moment you introduce one, instead of discovering it later when the file is used.</p>
<p>Build two habits around that. First, format before you save: run the file through the formatter so the structure is visible and a missing comma stands out on its own line. Second, validate before you ship: run the file through the validator, and if the shape of the data matters as well as the syntax, validate it against a schema with our <a href="/json-schema-validator">JSON Schema Validator</a>, which reports every violation with its exact path in the document. Syntax errors are the parser telling you the file cannot be read at all. Schema errors are the next layer up, and they are worth fixing for the same reason: a file that parses but has the wrong shape breaks your code just as surely, only later and more quietly.</p>

<section>
<h2>Frequently Asked Questions</h2>
<dl>
<dt>How do I find where my JSON is invalid?</dt>
<dd>Paste it into a validator that reports a line and column, not just a character position. Our <a href="/json-validator">JSON Validator</a> converts the parser position into a line and column, so you can jump straight to the spot. If the reported position looks wrong, look one line above it: the parser often notices a missing comma or quote one token after the real mistake.</dd>
<dt>Can I fix invalid JSON automatically?</dt>
<dd>For the common cases, yes. Our <a href="/json-repair">JSON Repair</a> tool fixes trailing commas, single quotes, unquoted keys, comments, and <code>undefined</code>, <code>NaN</code>, and <code>Infinity</code> values, and it lists every fix it applied. It cannot fix a missing comma or colon, an unclosed bracket or string, trailing content, or duplicate keys, because those need a human decision about what you meant. Those you fix by hand using the line and column from the validator.</dd>
<dt>Why does JSON.parse say "Unexpected token" in my browser?</dt>
<dd>Because the parser found a character it did not expect at that position, and the wording is generic on purpose: the same message covers trailing commas, single quotes, unquoted keys, and comments. The useful part of the message is the position, which our validator turns into a line and column. The exact wording varies between Chrome, Firefox, Node.js, and other runtimes, so match the cause in the reference table above instead of memorising one browser's phrasing.</dd>
<dt>Is a trailing comma really invalid in JSON?</dt>
<dd>Yes. JavaScript object literals allow trailing commas, and many other languages do too, which is why the habit is so common. Strict JSON does not allow them, and there is no option or mode that changes that. Delete the comma before the closing bracket. Our repair tool removes trailing commas automatically if you would rather not hunt for them by hand.</dd>
<dt>Can JSON have comments?</dt>
<dd>No. Standard JSON has no comment syntax, so both <code>//</code> line comments and <code>/* */</code> block comments make a file invalid. If you need comments, use YAML or JSONC, the commented JSON dialect VS Code uses for settings files, or move the note into a string value such as <code>"_comment"</code>. Our repair tool strips both kinds of comment for you.</dd>
<dt>Why does my JSON look valid but the API still rejects it?</dt>
<dd>Because parsing is only the first check. The file can be valid JSON and still be wrong for the API: a duplicate key silently keeps only the last value, trailing content after the root value is a separate document, a value can have the wrong type for the field, or a required field can be missing. Run it through a schema validator with the API's expected shape to catch the type and structure problems that a syntax check cannot see.</dd>
</dl>
</section>`,
  },
];
