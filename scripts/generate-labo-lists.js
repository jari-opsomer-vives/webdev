#!/usr/bin/env node
'use strict';

/**
 * generate-labo-lists.js
 *
 * Scans every labo_X directory and automatically regenerates the
 * <ul class="labo-opdrachten"> list in each labo_X/index.html.
 *
 * Each assignment subdirectory (any dir with a direct .html file) becomes
 * a list item.  Nested container dirs (e.g. 2-3-4_opdracht-oefeningen-nodes)
 * are flattened so their children appear as top-level items.
 *
 * CSS and JS files inside an assignment are shown as sub-items so they
 * can be viewed directly from the browser.
 *
 * Usage:  node scripts/generate-labo-lists.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT         = path.resolve(__dirname, '..');
const LABO_PATTERN = /^labo_(\d+)$/;

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Convert a native path to a forward-slash href. */
function toHref(p) {
    return p.split(path.sep).join('/');
}

/** Natural (numeric-aware), case-insensitive sort for file/dir names. */
function natSort(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/** Return all .html files DIRECTLY inside dir (not recursive), index.html first. */
function directHtmlFiles(dir) {
    let items;
    try { items = fs.readdirSync(dir); } catch { return []; }

    const htmlFiles = items
        .filter(f => !f.startsWith('.') && path.extname(f).toLowerCase() === '.html')
        .filter(f => {
            try { return fs.statSync(path.join(dir, f)).isFile(); } catch { return false; }
        })
        .sort(natSort);

    // Put index.html first
    const idx = htmlFiles.indexOf('index.html');
    if (idx > 0) {
        htmlFiles.splice(idx, 1);
        htmlFiles.unshift('index.html');
    }
    return htmlFiles;
}

/**
 * Recursively find .css or .js files inside dir.
 * - Skips hidden dirs/files and node_modules.
 * - Excludes minified files (*.min.css / *.min.js).
 * Returns paths relative to baseDir.
 */
function findSourceFiles(dir, extensions, baseDir) {
    const results = [];
    let items;
    try { items = fs.readdirSync(dir).sort(natSort); } catch { return results; }

    for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules') continue;
        const fullPath = path.join(dir, item);
        let stat;
        try { stat = fs.statSync(fullPath); } catch { continue; }

        if (stat.isDirectory()) {
            results.push(...findSourceFiles(fullPath, extensions, baseDir));
        } else {
            const ext = path.extname(item).toLowerCase();
            if (!extensions.includes(ext)) continue;
            if (item.includes('.min.')) continue;          // skip minified files
            results.push(path.relative(baseDir, fullPath));
        }
    }
    return results;
}

// ─── assignment discovery ─────────────────────────────────────────────────────

/**
 * Recursively scan `dir` for "assignment directories" — directories that
 * contain at least one .html file directly.  Container directories (no direct
 * HTML but with sub-dirs that do) are transparently expanded so their children
 * are returned as flat top-level items.
 *
 * @param {string} dir       Directory to scan.
 * @param {string} laboDir   Root labo directory (used to compute relative paths).
 * @returns {{ relDir: string, htmlFiles: string[] }[]}
 *   relDir   – path of the assignment dir relative to laboDir
 *   htmlFiles – direct HTML filenames (index.html first)
 */
function findAssignments(dir, laboDir) {
    const results = [];
    let items;
    try { items = fs.readdirSync(dir).sort(natSort); } catch { return results; }

    for (const item of items) {
        if (item.startsWith('.')) continue;
        const fullPath = path.join(dir, item);
        let stat;
        try { stat = fs.statSync(fullPath); } catch { continue; }
        if (!stat.isDirectory()) continue;

        const html = directHtmlFiles(fullPath);
        if (html.length > 0) {
            // This dir is a leaf assignment.
            results.push({ relDir: path.relative(laboDir, fullPath), htmlFiles: html });
        } else {
            // Container dir with no direct HTML — recurse to find children.
            results.push(...findAssignments(fullPath, laboDir));
        }
    }
    return results;
}

// ─── HTML generation ──────────────────────────────────────────────────────────

/**
 * Build the replacement <ul class="labo-opdrachten"> HTML for a given labo dir.
 * Returns null if there are no assignments to list.
 */
function buildList(laboDir) {
    const assignments = findAssignments(laboDir, laboDir);
    if (assignments.length === 0) return null;

    const indent = {
        ul:      '        ',   // 8 spaces — matches existing template
        li:      '            ',
        a:       '                ',
        nested:  '                ',
        nestedLi:'                    ',
    };

    const liParts = assignments.map(({ relDir, htmlFiles }) => {
        const primaryHtml = htmlFiles[0];          // index.html or first HTML
        const otherHtmlFiles = htmlFiles.slice(1); // remaining HTML files

        const primaryHref = toHref(path.join(relDir, primaryHtml));
        const label       = path.basename(relDir);

        // CSS and JS source files within this assignment
        const cssFiles = findSourceFiles(path.join(laboDir, relDir), ['.css'], laboDir);
        const jsFiles  = findSourceFiles(path.join(laboDir, relDir), ['.js'],  laboDir);

        const hasSubItems = otherHtmlFiles.length > 0 || cssFiles.length > 0 || jsFiles.length > 0;

        let li = `${indent.li}<li>\n`;
        li    += `${indent.a}<a href="${primaryHref}">${label}</a>`;

        if (hasSubItems) {
            li += `\n${indent.nested}<ul class="labo-bestanden">`;

            // Extra HTML pages within the same assignment dir
            for (const f of otherHtmlFiles) {
                const href    = toHref(path.join(relDir, f));
                const display = f; // just the filename
                li += `\n${indent.nestedLi}<li><a href="${href}">${display}</a></li>`;
            }

            // CSS files
            for (const f of cssFiles) {
                const href    = toHref(f);
                // Display relative to the assignment dir, e.g. "styles/style.css"
                const display = toHref(path.relative(relDir, f));
                li += `\n${indent.nestedLi}<li><a href="${href}" class="bestand-css">${display}</a></li>`;
            }

            // JS files
            for (const f of jsFiles) {
                const href    = toHref(f);
                const display = toHref(path.relative(relDir, f));
                li += `\n${indent.nestedLi}<li><a href="${href}" class="bestand-js">${display}</a></li>`;
            }

            li += `\n${indent.nested}</ul>`;
        }

        li += `\n${indent.li}</li>`;
        return li;
    });

    // The regex replaces from <ul ... to </ul>.
    // The whitespace BEFORE <ul is not part of the match, so we must NOT
    // add leading spaces to the opening tag — only to the closing one.
    return `<ul class="labo-opdrachten">\n`
         + liParts.join('\n')
         + `\n${indent.ul}</ul>`;
}

// ─── update a single labo index.html ─────────────────────────────────────────

/**
 * Find the <ul class="labo-opdrachten"> block in html and return its
 * [start, end) character offsets, correctly handling nested <ul> tags.
 * Returns null if not found.
 */
function findUlBlock(html) {
    const OPEN  = '<ul class="labo-opdrachten">';
    const start = html.indexOf(OPEN);
    if (start === -1) return null;

    let depth = 0;
    let pos   = start;
    while (pos < html.length) {
        if (html.startsWith('<ul', pos) && (html[pos + 3] === ' ' || html[pos + 3] === '>')) {
            depth++;
            pos += 3;
        } else if (html.startsWith('</ul>', pos)) {
            depth--;
            if (depth === 0) {
                return [start, pos + 5]; // pos + 5 = position after </ul>
            }
            pos += 5;
        } else {
            pos++;
        }
    }
    return null; // unmatched — malformed HTML
}

function updateLaboIndex(laboDir) {
    const indexPath = path.join(laboDir, 'index.html');
    if (!fs.existsSync(indexPath)) return false;

    let html = fs.readFileSync(indexPath, 'utf8');

    const range = findUlBlock(html);
    if (!range) return false; // page has no labo-opdrachten list — skip

    const newUl = buildList(laboDir);
    if (!newUl) return false;

    const newHtml = html.slice(0, range[0]) + newUl + html.slice(range[1]);
    if (newHtml === html) {
        console.log(`  no changes  ${path.basename(laboDir)}/index.html`);
        return false;
    }

    fs.writeFileSync(indexPath, newHtml, 'utf8');
    console.log(`  updated     ${path.basename(laboDir)}/index.html`);
    return true;
}

// ─── main ─────────────────────────────────────────────────────────────────────

const labos = fs.readdirSync(ROOT)
    .filter(name => LABO_PATTERN.test(name))
    .sort((a, b) => {
        const aNum = parseInt(a.match(LABO_PATTERN)[1], 10);
        const bNum = parseInt(b.match(LABO_PATTERN)[1], 10);
        return aNum - bNum;
    });

let updated = 0;
console.log('Generating labo assignment lists…\n');

for (const labo of labos) {
    const laboDir = path.join(ROOT, labo);
    try {
        if (fs.statSync(laboDir).isDirectory() && updateLaboIndex(laboDir)) {
            updated++;
        }
    } catch (err) {
        console.error(`  ERROR  ${labo}: ${err.message}`);
    }
}

console.log(`\nDone — ${updated} file(s) updated.`);
