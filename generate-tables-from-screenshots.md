# Generating HTML Tables from Screenshots

## Task

Given a folder of screenshots of timeline/event tables, produce a single HTML file
containing one `<aside>` block per screenshot, ready to paste into the book HTML.

## What to provide

1. **Folder path** containing the screenshot images (any order is fine — process alphabetically)
2. **Starting table ID number** — or say "check the book" and scan
   `book-diethnis-sxeseis.html` for the highest `id="tableNNN"` and increment from there

## HTML structure to use

Every table is wrapped in a box aside using this exact pattern:

```html
<aside class="box" role="complementary">
<h2 class="aside-title" id="toc-HASH"><span class="box-label">ΓΕΓΟΝΟΤΑ</span> TITLE FROM SCREENSHOT</h2>
<table id="tableNNN">
<tbody>
<tr>
<td><p class="no-indent"><b>DATE</b></p></td>
<td><p class="no-indent">EVENT DESCRIPTION</p></td>
</tr>
</tbody>
</table>
</aside>
```

Rules:
- Box label is always `ΓΕΓΟΝΟΤΑ` for this table type
- No `<thead>`, no `<th>` — only `<tbody>` with `<tr>/<td>`
- Every `<td>` wraps its content in `<p class="no-indent">`
- Date column uses `<b>` for bold, no extra class
- Table IDs are zero-padded to 3 digits: table027, table028, …

## How to compute the toc- hash

```python
import hashlib

# heading_text = get_text() of the full <h2>, whitespace-normalized
# For <span class="box-label">ΓΕΓΟΝΟΤΑ</span> ΠΑΓΚΟΣΜΙΑ ΙΣΤΟΡΙΑ, 1900-1945
# heading_text = "ΓΕΓΟΝΟΤΑ ΠΑΓΚΟΣΜΙΑ ΙΣΤΟΡΙΑ, 1900-1945"

heading_text = "ΓΕΓΟΝΟΤΑ " + title_from_screenshot
toc_id = "toc-" + hashlib.sha256(heading_text.encode("utf-8")).hexdigest()[:8]
```

## Output

- A single `.html` file (not a full document — just the `<aside>` blocks concatenated)
- Blocks separated by a blank line
- After generating, `pbcopy` the file contents to clipboard

## Known corrections

- Screenshot "1904-1995" → correct to **1904-1905** (Russo-Japanese War typo)
