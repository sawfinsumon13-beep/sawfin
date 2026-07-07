<?php
/**
 * ONE-TIME Hostinger fix — upload to public_html root, open in browser once, then DELETE.
 * Moves site files from public_html/index.html/ up to public_html/
 */
header('Content-Type: text/plain; charset=utf-8');

$root = __DIR__;
$src = $root . DIRECTORY_SEPARATOR . 'index.html';

if (!is_dir($src)) {
    echo "No index.html folder found — files may already be at root.\n";
    echo "Test: yourdomain.com/products/male-bengal-kitten-umar.html\n";
    exit(0);
}

$moved = 0;
$skipped = 0;

function moveTree(string $from, string $to, int &$moved, int &$skipped): void
{
    $items = @scandir($from);
    if ($items === false) {
        return;
    }
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }
        $fromPath = $from . DIRECTORY_SEPARATOR . $item;
        $toPath = $to . DIRECTORY_SEPARATOR . $item;
        if (is_dir($fromPath)) {
            if (!is_dir($toPath)) {
                if (!@mkdir($toPath, 0755, true)) {
                    echo "FAIL mkdir: $toPath\n";
                    continue;
                }
            }
            moveTree($fromPath, $toPath, $moved, $skipped);
            @rmdir($fromPath);
        } else {
            if (file_exists($toPath)) {
                echo "SKIP (exists): $item\n";
                $skipped++;
                continue;
            }
            if (@rename($fromPath, $toPath)) {
                echo "OK: $item\n";
                $moved++;
            } else {
                echo "FAIL: $item\n";
            }
        }
    }
}

echo "Moving files from index.html/ to public_html root...\n\n";
moveTree($src, $root, $moved, $skipped);

$left = @scandir($src);
if ($left !== false && count($left) === 2) {
    @rmdir($src);
    echo "\nRemoved empty index.html/ folder.\n";
}

echo "\nDone. Moved: $moved, skipped: $skipped\n";
echo "DELETE this file (move-to-root.php) now.\n";
echo "Test: yourdomain.com/products/male-bengal-kitten-umar.html\n";
