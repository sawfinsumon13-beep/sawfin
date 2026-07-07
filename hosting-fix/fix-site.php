<?php
/**
 * Purebred Kitties - One-time hosting fix (run once, then DELETE).
 *
 * Fixes:
 * 1. Moves files out of wrong "index.html/" subfolder to public_html root
 * 2. Creates clean CSS/JS/image copies (removes ? from wget-style filenames)
 *
 * HOW TO USE:
 * 1. Upload this file + .htaccess to public_html
 * 2. Visit: https://purebreedkittensforsale.com/fix-site.php
 * 3. DELETE this file when done
 */

set_time_limit(0);
ini_set('memory_limit', '512M');

$root = __DIR__;
$log = [];

function add_log(array &$log, string $msg): void
{
    $log[] = $msg;
}

function clean_target(string $dir, string $name): ?string
{
    if (strpos($name, '?') === false) {
        return null;
    }

    [$base, $queryPart] = explode('?', $name, 2);
    $exts = ['css', 'js', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];

    foreach ($exts as $ext) {
        if (preg_match('/\.' . $ext . '$/i', $base) && preg_match('/\.' . $ext . '$/i', $queryPart)) {
            return $dir . DIRECTORY_SEPARATOR . $base;
        }
    }

    if (substr_count($base, '.') >= 1) {
        return $dir . DIRECTORY_SEPARATOR . $base;
    }

    return null;
}

function move_folder_contents(string $from, string $to, array &$log): int
{
    if (!is_dir($from)) {
        return 0;
    }

    $moved = 0;
    $items = scandir($from);
    if ($items === false) {
        return 0;
    }

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }

        $src = $from . DIRECTORY_SEPARATOR . $item;
        $dst = $to . DIRECTORY_SEPARATOR . $item;

        if (is_dir($src)) {
            if (is_dir($dst)) {
                $moved += move_folder_contents($src, $dst, $log);
                @rmdir($src);
            } else {
                if (@rename($src, $dst)) {
                    $moved++;
                    add_log($log, "Moved folder: $item");
                }
            }
            continue;
        }

        if (file_exists($dst)) {
            continue;
        }

        if (@rename($src, $dst)) {
            $moved++;
        } elseif (@copy($src, $dst)) {
            @unlink($src);
            $moved++;
        }
    }

    return $moved;
}

// Step 1: Fix wrong folder structure (index.html/ subfolder)
$wrongFolder = $root . DIRECTORY_SEPARATOR . 'index.html';
$moved = 0;
if (is_dir($wrongFolder)) {
    $moved = move_folder_contents($wrongFolder, $root, $log);
    @rmdir($wrongFolder);
    add_log($log, "Moved $moved items from index.html/ folder to site root.");
} else {
    add_log($log, "No index.html/ subfolder found (OK if already fixed).");
}

// Step 2: Create clean asset copies
$created = 0;
$skipped = 0;
$errors = 0;

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS)
);

foreach ($iterator as $file) {
    if (!$file->isFile()) {
        continue;
    }

    $path = $file->getPathname();
    $base = basename($path);

    if ($base === basename(__FILE__) || $base === 'fix-assets.php' || $base[0] === '.') {
        continue;
    }

    $target = clean_target($file->getPath(), $file->getFilename());
    if (!$target || file_exists($target)) {
        $skipped++;
        continue;
    }

    if (@link($path, $target) || @copy($path, $target)) {
        $created++;
    } else {
        $errors++;
    }
}

add_log($log, "Created $created clean asset copies (skipped $skipped, errors $errors).");

header('Content-Type: text/html; charset=utf-8');
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Site Fix Complete</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 680px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    .ok { color: #0a0; font-size: 22px; font-weight: bold; }
    .warn { color: #c00; font-weight: bold; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    li { margin: 6px 0; }
  </style>
</head>
<body>
  <p class="ok">Done!</p>

  <ul>
    <?php foreach ($log as $line): ?>
      <li><?php echo htmlspecialchars($line); ?></li>
    <?php endforeach; ?>
  </ul>

  <hr>
  <p><strong>Next steps:</strong></p>
  <ol>
    <li>Make sure <code>.htaccess</code> is in public_html (same folder as index.html)</li>
    <li>If CSS still missing, upload <code>essential-assets.zip</code> and extract to public_html</li>
    <li>Visit <a href="/">homepage</a> and press Ctrl+F5</li>
    <li class="warn">DELETE fix-site.php now!</li>
  </ol>
</body>
</html>
