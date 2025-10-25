# Rishit Chatterjee — Portfolio Website

A single-page portfolio with a fixed background video, smooth in-page navigation, and a few lightweight WebGL designs thrrough Three JS. 

Sections include About, Projects, Skills, and Contact. The top nav links scroll to each section on the same page.

## Highlights

* **Clean top-nav** scrolling to `#about`, `#projects`, `#skills`, `#contact`
* **Fixed background video** that stays pinned while content scrolls
* **One featured project**: Pneumonia Detection AI

* **WebGL visuals (Three.js, CDN-loaded)**

  * Revolving **icosahedron** under the Projects section
  * Horizontal, “genetic” **tetrahedron** under the icosahedron
  * A right-edge **tesseract** overlay with thick purple edges
    All are injected from `app.js` so the HTML stays simple
* * Scroll animations and **Boxicons** for icons
* **LinkedIn CV** in the top nav

---

## Tech Stack

* HTML5, CSS3
* Vanilla JavaScript
* [Three.js](https://threejs.org/) (loaded from CDN)
* [Boxicons](https://boxicons.com/)

---

## Getting Started

This is a static site. We can open `index.html` directly, but running a tiny local server is nicer.

**Option 1: Python**

```bash
# from the project folder
python -m http.server 5173
# then visit http://localhost:5173
```

**Option 2: VS Code Live Server**

* Install the “Live Server” extension
* Right-click `index.html` → “Open with Live Server”

Place the assets/images/videos here:

```
images/   # logos, grid images, skills image
videos/   # background mp4 (e.g., lotr_o.mp4), blackhole.mp4, project1.mp4, glob.mp4
```

---

## Project Structure

```
.
├─ index.html     # markup and sections
├─ style.css      # layout, colors, video pinning, section tints
├─ app.js         # hover video behavior, smooth scrolling, WebGL injections
├─ images/
└─ videos/
```

Key sections and IDs:

* `#about` — short intro + info cards
* `#projects` — featured project + WebGL canvases
* `#skills` — designer/coder panels and icon slider
* `#contact` — simple contact block

---

## Navigation (smooth scroll)


## WebGL Animations (Three.js)

All Three.js scenes are created in `app.js` and attached to the page at runtime. No extra HTML is required.

### What’s included

* **Icosahedron** under `#projects`
  A softly lit, rotating icosahedron inside a rounded container.
* **Tetrahedron** under the icosahedron
  A horizontal, slowly revolving tetrahedron with a light wireframe.
* **Right-edge tesseract**
  A tall, fixed overlay along the right edge that renders a 4D hypercube wireframe using purple cylinders for real thickness. It sits above the background video and below the header, and it doesn’t block clicks.

### Tuning the visuals

Open `app.js` and search for these blocks:

* `addIcosahedron()` — change color, size, or background of the host container
* `addTetrahedron()` — tweak rotation speed, wireframe opacity, or scale
* `addRightTesseract()` — change width via the `clamp(…)` in the host styles, edge thickness via `edgeRadius`, and color via the material `color`/`emissive`

The scripts:

* Load Three.js from a CDN only once
* Cap device pixel ratio for performance
* Pause rendering when off-screen (where possible) or when the tab is hidden

---

## Styling Notes

* Sections like Projects and Skills can be darkened with a translucent blue-violet background. This helps legibility on top of the video.
* Designer and Coder panels use a subtle “glassy” look with `backdrop-filter` where supported.
* If the header overlaps a section title, increase `scroll-padding-top` a bit.

---

## Accessibility

* Nav links are plain anchors that work without JavaScript
* Icons include ARIA labels
* The right-edge tesseract uses `pointer-events: none`, so it never blocks interaction
* Keep contrast readable if we adjust tints or video brightness

---

## Featured Project

**Pneumonia Detection AI**
An ML tool to help radiologists and patients detect pneumonia from chest X-rays. Uses CNNs and transfer learning (VGG16, ResNet50), with preprocessing, data exploration, model optimization, and evaluation through accuracy and confusion matrices.
Repo: [https://github.com/AgentQuantum/pneumonia-cnn](https://github.com/AgentQuantum/pneumonia-cnn)

---

## Deploy

Any static host works:

* GitHub Pages (best)

Make sure the `videos/` and `images/` folders are included and paths match what `index.html` expects.

## Mini Game (Three.js)

A small lane-dodger game that runs inside the page. It adds a **Game** item to the top nav, injects a `#game` section under **Projects**, and renders a simple 3D runner using Three.js. When the player passes obstacles, the player block moves forward. After **10** passes they get a quick white flash and the site opens my **LinkedIn CV** in a new tab.

**Controls**
- **Move**: ← / A and → / D  
- **Jump**: ↑ / W  
- **Dash**: Shift  
- **Pause**: P  
- **Restart**: R  
- **Touch**: swipe left or right to move, swipe up to jump

**What it does**
- Spawns a mix of regular and tiny obstacles in three lanes  
- Smooth forward progress after each pass  
- On 10 passes triggers a quick flash, then opens my LinkedIn page  
- Pauses when off-screen to save battery

**Where it lives**
- Implemented entirely in `app.js`  
- Look for the block named `addGameNavAndSectionEnhancedForward()`  
- Three.js is loaded from a CDN if it is not already present

**Tuning**
- Change the CV link with `CV_URL`  
- Make forward progress bigger with `FORWARD_STEP`  
- Difficulty knobs  
  - `spawnEvery` for spawn frequency  
  - `baseSpeed` for obstacle speed  
- Frame size  
  - Edit the inline styles on the `#game-host` container in `app.js`  
  - Defaults to `width: min(1200px, 96vw)` and `height: 440px`



---

## Acknowledgements

I would like to acknowledge Prof. Naser Al Madi who helped in the completion of this project.


