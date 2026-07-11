#!/bin/bash

BASE_URL="https://bavarianengineexchanges.com/index.html"
SUCCESS_COUNT=0
FAIL_COUNT=0

# Create log files
> download_success.log
> download_failed.log

# Read each main image URL and download it plus try to get thumbnails
while IFS= read -r img_path; do
    # Extract set number and base info
    set_num=$(echo "$img_path" | grep -oP 'set-\d+')
    
    # Create directory for this set
    mkdir -p "$set_num"
    
    # Download the main image
    full_url="${BASE_URL}/${img_path}"
    filename=$(basename "$img_path")
    output="${set_num}/${filename}"
    
    if curl -f -s -o "$output" "$full_url" 2>/dev/null; then
        echo "SUCCESS: $full_url" >> download_success.log
        ((SUCCESS_COUNT++))
        echo "Downloaded: $output"
    else
        echo "FAILED: $full_url" >> download_failed.log
        ((FAIL_COUNT++))
        rm -f "$output"
    fi
    
    # Try to get thumbnails for this set (thumb1 through thumb6)
    for i in {1..6}; do
        # Try different thumbnail naming patterns
        thumb_filename=$(echo "$filename" | sed "s/main-/thumb${i}-/")
        thumb_url="${BASE_URL}/images/engines/sets/${set_num}/${thumb_filename}"
        thumb_output="${set_num}/${thumb_filename}"
        
        if curl -f -s -o "$thumb_output" "$thumb_url" 2>/dev/null; then
            echo "SUCCESS: $thumb_url" >> download_success.log
            ((SUCCESS_COUNT++))
        else
            rm -f "$thumb_output"
        fi
    done
    
done < all_image_urls.txt

echo ""
echo "===== DOWNLOAD SUMMARY ====="
echo "Total successful downloads: $SUCCESS_COUNT"
echo "Total failed downloads: $FAIL_COUNT"
echo "Sets downloaded: $(ls -d set-* 2>/dev/null | wc -l)"
echo ""
echo "Checking for complete 6-image sets..."
for set_dir in set-*/; do
    if [ -d "$set_dir" ]; then
        count=$(ls -1 "$set_dir" 2>/dev/null | wc -l)
        if [ "$count" -ge 6 ]; then
            echo "✓ $set_dir has $count images (COMPLETE)"
        else
            echo "  $set_dir has $count images"
        fi
    fi
done
