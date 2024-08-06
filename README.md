# PixiJS Slot Game

## Overview

This project is a slot game built with PixiJS, an HTML5 rendering library. The game features a matrix of symbols that fall into place, with animations and score calculations based on matching symbols. "connect" versions of matching symbols are displayed

## Demo

https://solodevs.com/portfolio/pixi-slot/

## Features

- **Dynamic Symbol Matrix:** Displays a grid of symbols with customizable rows and columns.
- **Falling Animations:** Symbols fall from the top to their designated positions.
- **Match Scoring:** Points are awarded based on the number of matching symbols.
- **Configurable Settings:** Easily adjust game settings such as symbol size, fall speed, and scoring.

## Getting Started

### File structure


```
.
├── assets
│   ├── İmages
├── js
│   └── main.js
├── css
│   └── styles.css
├── index.html
└── README.md
```

### Prerequisites

Ensure you have the following:
- A modern web browser
- Internet connection (for loading PixiJS via CDN)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
### Start Game
Use a local server to run the game in the browser.
### Configuration
Editable Settings
At the top of the **js/main.js** file, you can configure the following values:

**ROWS:** Number of rows in the matrix (default: 3)

**COLUMNS:** Number of columns in the matrix (default: 5)

**SYMBOL_SIZE:** Width and height of each symbol in pixels (default: 200)

**FALL_SPEED:** Speed of symbol fall animation in pixels per frame (default: 50)

**MATRIX_Y_PADDING:** Vertical padding for the matrix (default: 60)

**SCORE_POINTS:** Points awarded for matching symbols:

3: Points for 3-symbol match

4: Points for 4-symbol match

5: Points for 5-symbol match

6: Points for 6-symbol match

7: Points for 7-symbol match

**LOSS_POINTS:** Points deducted for no matches (default: -10)

**URL_UPDATE_DELAY:** Delay in milliseconds before updating symbol URLs (default: 1000)
Symbol URLs
Update the SYMBOLS object with your symbol image URLs. Each key represents the symbol name and its corresponding image URL.

### Usage
Start the Game:

Click the **"Spin"** button to generate the symbol matrix and begin the falling animation.

#### Check Results:

After the symbols have fallen into place, the game calculates matches and updates the score accordingly.

#### Code Structure
**index.html:** html codes, css and js files are imported here.

**styles/css:** Contains simple css styles

**js/main.js:** Contains game settings and js functions.

## Contact
bunyamin.bayar.dev@gmail.com