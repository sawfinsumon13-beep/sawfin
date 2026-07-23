# sawfin

## Fiverr gig image

To create your gig image with your **exact original photo**, add your photo file to this folder:

- Save it as: `my-photo.jpg` (or `.png`)

Then tell the agent: **"my photo is uploaded"**

The agent will composite your real photo into the yellow Fiverr template with:
- Yellow background + tech icons (JS, HTML5, Laravel, React)
- Black banner: **WEBSITE DEVELOPMENT**

Or run locally:

```bash
pip install Pillow rembg onnxruntime
python3 create_fiverr_gig.py my-photo.jpg -o fiverr-gig-final.png
```
