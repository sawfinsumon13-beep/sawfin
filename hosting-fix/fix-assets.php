<?php
/**
 * Purebred Kitties - One-time asset fix for Apache/cPanel hosting.
 * 
 * HOW TO USE:
 * 1. Upload this file to public_html (same folder as index.html)
 * 2. Visit: https://yourdomain.com/fix-assets.php
 * 3. Wait until you see "Done!"
 * 4. DELETE this file immediately for security
 * 5. Refresh your website - CSS and images should load
 */

set_time_limit(0);
ini_set('memory_limit', '512M');

$root = __DIR__;
$created = 0;
$skipped = 0;
$errors = 0;

function cleanTarget(string $dir, string $name): ?string
{
    if (strpos($name, '?') === false) {
        return null;
    }

    [$base, $queryPart] = explode('?', $name, 2);

    // file.css?v=HASH.css -> file.css
    if (preg_match('/^(.+\.(css|js|png|jpg|jpeg|webp|gif|svg))$/i', $base, $m)) {
        if (preg_match('/\.(css|js|png|jpg|jpeg|webp|gif|svg)$/i', $queryPart)) {
            return $dir . DIRECTORY_SEPARATOR . $base;
        }
        return $dir . DIRECTORY_SEPARATOR . $base;
    }

    return null;
}

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS)
);

foreach ($iterator as $file) {
    if (!$file->isFile()) {
        continue;
    }

    $path = $file->getPathname();

    // Skip this script and hidden files
    if (basename($path) === basename(__FILE__) || basename($path)[0] === '.') {
        continue;
    }

    $target = cleanTarget($file->getPath(), $file->getFilename());
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

header('Content-Type: text/html; charset=utf-8');
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Asset Fix Complete</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
    .ok { color: green; font-size: 24px; font-weight: bold; }
    .warn { color: red; font-weight: bold; }
  </style>
</head>
<body>
  <p class="ok">Done!</p>
  <p>Created <strong><?php echo $created; ?></strong> clean asset copies.</p>
  <p>Skipped (already exist): <?php echo $skipped; ?></p>
  <?php if ($errors > 0): ?><p class="warn">Errors: <?php echo $errors; ?></p><?php endif; ?>
  <hr>
  <p><strong>Next steps:</strong></p>
  <ol>
    <li>Make sure <code>.htaccess</code> is uploaded to public_html</li>
    <li>Visit your homepage and refresh (Ctrl+F5)</li>
    <li><span class="warn">DELETE fix-assets.php now!</span></li>
  </ol>
  <p><a href="/index.html">Go to Homepage</a></p>
</body>
</html>
