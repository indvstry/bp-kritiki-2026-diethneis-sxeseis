/**
 * export-eps-to-png.jsx
 * Batch-exports every .eps file in a chosen folder to PNG.
 * Output goes into a "_png" subfolder next to the source files.
 *
 * Usage: File > Scripts > Other Script… (or drag onto Illustrator)
 * Tested on Adobe Illustrator CS6 / CC 2019+
 */

#target illustrator

(function () {

    // ── Settings ──────────────────────────────────────────────────────────────
    var RESOLUTION   = 150;   // dpi  — change to 300 for print-quality
    var ANTIALIAS    = true;
    var TRANSPARENCY = false; // true = background stays transparent
    var OUT_SUBDIR   = "_png"; // created inside the source folder
    // ──────────────────────────────────────────────────────────────────────────

    var srcFolder = Folder.selectDialog("Select the folder that contains your EPS files");
    if (!srcFolder) { return; } // user cancelled

    var epsFiles = srcFolder.getFiles(function (f) {
        return f instanceof File && f.name.match(/\.eps$/i);
    });

    if (epsFiles.length === 0) {
        alert("No .eps files found in:\n" + srcFolder.fsName);
        return;
    }

    // Create output subfolder
    var outFolder = new Folder(srcFolder + "/" + OUT_SUBDIR);
    if (!outFolder.exists) { outFolder.create(); }

    var options = new ExportOptionsPNG24();
    options.resolution       = RESOLUTION;
    options.antiAliasing     = ANTIALIAS;
    options.transparency     = TRANSPARENCY;
    options.artBoardClipping = true;

    var ok = 0, failed = [];

    for (var i = 0; i < epsFiles.length; i++) {
        var epsFile = epsFiles[i];
        try {
            var doc = app.open(epsFile);

            // Select all art, shrink artboard 0 to its bounds, then deselect
            app.executeMenuCommand("selectall");
            doc.fitArtboardToSelectedArt(0);
            app.executeMenuCommand("deselectall");

            // Build destination path — Illustrator appends ".png" automatically
            var baseName  = epsFile.name.replace(/\.eps$/i, "");
            var destFile  = new File(outFolder + "/" + baseName);

            doc.exportFile(destFile, ExportType.PNG24, options);
            doc.close(SaveOptions.DONOTSAVECHANGES);
            ok++;
        } catch (e) {
            failed.push(epsFile.name + " (" + e.message + ")");
            try { doc.close(SaveOptions.DONOTSAVECHANGES); } catch (_) {}
        }
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    var msg = "Done.\n\nExported: " + ok + " / " + epsFiles.length + " files";
    msg += "\nOutput folder:\n" + outFolder.fsName;
    if (failed.length) {
        msg += "\n\nFailed (" + failed.length + "):\n• " + failed.join("\n• ");
    }
    alert(msg);

})();
