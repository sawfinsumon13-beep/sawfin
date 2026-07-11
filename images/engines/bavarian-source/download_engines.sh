#!/bin/bash

BASE_URL="https://bavarianengineexchanges.com/index.html/images/engines/sets"
SUCCESS_LOG="download_success.log"
FAIL_LOG="download_failed.log"

> "$SUCCESS_LOG"
> "$FAIL_LOG"

# Try downloading sets 0001 through 0050 (should cover 10-20+ engines)
for set_num in $(seq -w 1 50); do
    set_id="set-${set_num}"
    mkdir -p "$set_id"
    
    echo "Attempting to download $set_id..."
    
    # Try downloading various image patterns
    # Pattern 1: thumbX images
    for thumb_num in {1..6}; do
        url="${BASE_URL}/${set_id}/thumb${thumb_num}.webp"
        output="${set_id}/thumb${thumb_num}.webp"
        
        if curl -f -s -o "$output" "$url" 2>/dev/null; then
            echo "SUCCESS: $url" >> "$SUCCESS_LOG"
            echo "  Downloaded: $output"
        else
            rm -f "$output"
        fi
    done
    
    # Pattern 2: main images
    for img_num in {1..6}; do
        url="${BASE_URL}/${set_id}/main-${img_num}.webp"
        output="${set_id}/main-${img_num}.webp"
        
        if curl -f -s -o "$output" "$url" 2>/dev/null; then
            echo "SUCCESS: $url" >> "$SUCCESS_LOG"
            echo "  Downloaded: $output"
        else
            rm -f "$output"
        fi
    done
    
    # Check if directory has any files
    file_count=$(ls -1 "$set_id" 2>/dev/null | wc -l)
    if [ "$file_count" -eq 0 ]; then
        rmdir "$set_id"
        echo "SKIP: $set_id (no images found)" >> "$FAIL_LOG"
    else
        echo "  $set_id: $file_count images downloaded"
    fi
done

echo ""
echo "Download complete! Summary:"
echo "- Successful downloads: $(wc -l < "$SUCCESS_LOG")"
echo "- Sets with images: $(ls -d set-* 2>/dev/null | wc -l)"
