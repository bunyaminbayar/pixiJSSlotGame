const ROWS = 3; // Number of rows
const COLUMNS = 5; // Number of columns
const SYMBOL_SIZE = 200; // Width and height of each symbol
const FALL_SPEED = 50; // Falling speed per frame
const MATRIX_Y_PADDING = 60; // Padding for the matrix
const SCORE_POINTS = {
    3: 30, // Points for 3 symbols match
    4: 50, // Points for 4 symbols match
    5: 75, // Points for 5 symbols match
    6: 100, // Points for 6 symbols match
    7: 150 // Points for 7 symbols match
};
const LOSS_POINTS = -10; // Points for no match
const URL_UPDATE_DELAY = 500; // Delay for updating URL (ms)
const DELAY_FOR_EACH_ROW = 20; // Animation start delay for each row (Bottom rows start first)
let DEFAULT_SCORE = 100; // Score credits given to the user per game

// Define image URLs
const SYMBOLS = {
    '9': 'assets/9.png',
    '10': 'assets/10.png',
    'A': 'assets/A.png',
    'H1': 'assets/H1.png',
    'H2': 'assets/H2.png',
    'H3': 'assets/H3.png',
    'H4': 'assets/H4.png',
    'H5': 'assets/H5.png',
    'H6': 'assets/H6.png',
    'J': 'assets/J.png',
    'K': 'assets/K.png',
    'M1': 'assets/M1.png',
    'M2': 'assets/M2.png',
    'M3': 'assets/M3.png',
    'M4': 'assets/M4.png',
    'M5': 'assets/M5.png',
    'M6': 'assets/M6.png',
    'Q': 'assets/Q.png'
};

// Create PIXI application
const app = new PIXI.Application({
    width: COLUMNS * SYMBOL_SIZE, // 5 columns x 200px
    height: (ROWS * SYMBOL_SIZE) + MATRIX_Y_PADDING, // 3 rows x 200px
});

document.body.appendChild(app.view);

// Array to hold sprites
let symbols = [];
let symbolNames = []; // Array to hold symbol names

// Score and score text
const scoreText = new PIXI.Text(`Score: ${DEFAULT_SCORE} ⭑`, {
    fontSize: 24,
    fill: 0xffffff,
    align: 'center'
});
scoreText.x = 10;
scoreText.y = MATRIX_Y_PADDING / 4;

// Win type text
const matchTypeText = new PIXI.Text('', {
    fontSize: 20,
    fill: 0xffffff,
    align: 'center'
});
matchTypeText.x = app.view.width - 10;
matchTypeText.y = MATRIX_Y_PADDING / 4;
matchTypeText.anchor.set(1, 0);

// Helper function to get a random symbol
const getRandomSymbol = () => {
    const keys = Object.keys(SYMBOLS);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return {
        name: randomKey,
        url: SYMBOLS[randomKey]
    };
};

// Check matches and update score
const checkForMatches = () => {
    const matches = {};

    // Count the occurrences of each symbol name
    symbolNames.forEach(name => {
        matches[name] = (matches[name] || 0) + 1;
    });

    let matchPoints = 0;
    let matchType = '';
    const wonSymbols = [];

    // Check matches
    Object.entries(matches).forEach(([key, count]) => {
        if (count >= 3) {
            matchPoints = SCORE_POINTS[count] || 0; // Get points from SCORE_POINTS
            matchType = `${count}-symbol match`; // Generate match type string
            wonSymbols.push(`${count} ${key}`);
        }
    });

    // If no match, subtract points
    if (matchPoints === 0) {
        matchPoints = LOSS_POINTS;
        matchType = 'Loss';
    }

    // Log won symbols
    console.log('Won Symbols:', wonSymbols.join(', '));

    // Display match type
    matchTypeText.text = `Match: ${wonSymbols.join(', ') + ' - ' + matchType}`;
    fadeInMatchType();

    // Update symbol URLs after 1 second delay
    setTimeout(() => {
        updateSymbolURLs(wonSymbols.map(symbol => symbol.split(' ')[1])); // Extract symbol names only
    }, URL_UPDATE_DELAY);

    updateScore(matchPoints);
};

// Update score and add animation
const updateScore = (points) => {
    DEFAULT_SCORE += points;
    scoreText.text = `Score: ${DEFAULT_SCORE} ⭑`;

    // Zoom in-out animation
    const zoomAnimation = (delta) => {
        scoreText.scale.x += 0.02 * delta;
        scoreText.scale.y += 0.02 * delta;

        if (scoreText.scale.x > 1.2) {
            app.ticker.remove(zoomAnimation);
            app.ticker.add(zoomBack);
        }
    };

    const zoomBack = (delta) => {
        scoreText.scale.x -= 0.02 * delta;
        scoreText.scale.y -= 0.02 * delta;

        if (scoreText.scale.x <= 1) {
            scoreText.scale.x = 1;
            scoreText.scale.y = 1;
            app.ticker.remove(zoomBack);
        }
    };

    app.ticker.add(zoomAnimation);
};

// Create the matrix and start symbols falling from the top
const createMatrix = () => {
    // Remove existing sprites
    symbols.forEach(symbol => app.stage.removeChild(symbol));
    symbols = [];
    symbolNames = []; // Clear old names

    const startY = MATRIX_Y_PADDING; // 60px padding

    // Create new sprites
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            // Get a random symbol
            const {
                name,
                url
            } = getRandomSymbol();
            symbolNames.push(name); // Store symbol names

            // Create a new sprite
            const texture = PIXI.Texture.from(url);
            const symbol = new PIXI.Sprite(texture);

            // Set the sprite's initial position above the view
            symbol.x = col * SYMBOL_SIZE;
            symbol.y = -Math.random() * (ROWS * SYMBOL_SIZE) - SYMBOL_SIZE; // Random starting point above

            // Store target position
            symbol.targetY = startY + row * SYMBOL_SIZE;

            // Store start delay for each row (lower rows start first)
            symbol.startDelay = (ROWS - row - 1) * DELAY_FOR_EACH_ROW; // Lower rows start earlier

            // Add sprite to the stage
            app.stage.addChild(symbol);
            symbols.push(symbol);
        }
    }

    // Log the names of symbols in the matrix
    console.log('Symbol names in the matrix:', symbolNames.join(', '));

    // Add score and match type texts to the stage last to ensure they are on top
    app.stage.addChild(scoreText);
    app.stage.addChild(matchTypeText);
};

// Start the fade-in animation for the match type text
const fadeInMatchType = () => {
    matchTypeText.alpha = 0; // Initially invisible
    const fadeIn = (delta) => {
        matchTypeText.alpha += 0.02 * delta;

        if (matchTypeText.alpha >= 1) {
            matchTypeText.alpha = 1;
            app.ticker.remove(fadeIn);
        }
    };
    app.ticker.add(fadeIn);
};

// Start the fade-out animation for the match type text
const fadeOutMatchType = () => {
    const fadeOut = (delta) => {
        matchTypeText.alpha -= 0.02 * delta;

        if (matchTypeText.alpha <= 0) {
            matchTypeText.alpha = 0;
            app.ticker.remove(fadeOut);
        }
    };
    app.ticker.add(fadeOut);
};

// Update URLs for symbols that won
const updateSymbolURLs = (wonSymbolNames) => {
    symbols.forEach(symbol => {
        const symbolName = symbolNames[symbols.indexOf(symbol)];

        // If the symbol is among the won symbols, update the URL
        if (wonSymbolNames.includes(symbolName)) {
            const oldUrl = SYMBOLS[symbolName];
            const newUrl = getConnectUrl(oldUrl);
            const newTexture = PIXI.Texture.from(newUrl);

            // Update the URL after a certain delay
            setTimeout(() => {
                symbol.texture = newTexture;
            }, URL_UPDATE_DELAY);
        }
    });
};

// Change URL by adding "_connect"
const getConnectUrl = (url) => url.replace('.png', '_connect.png');

// Create the matrix and start the animation
const startGame = () => {
    // Create the matrix
    createMatrix();

    // Start animation
    app.ticker.add(fall);
};

// Function to handle falling animation
const fall = (delta) => {
    let allSettled = true; // Check if all sprites are settled
    symbols.forEach(symbol => {
        // Check start delay
        if (symbol.startDelay > 0) {
            symbol.startDelay -= delta;
            allSettled = false;
        } else if (symbol.y < symbol.targetY) {
            symbol.y += FALL_SPEED * delta; // Speed per frame
            if (symbol.y > symbol.targetY) {
                symbol.y = symbol.targetY; // Settle at target position
            }
            allSettled = false; // Still moving sprite
        }
    });

    // If all sprites are settled, stop animation and check for matches
    if (allSettled) {
        app.ticker.remove(fall);
        checkForMatches(); // Check for matches
    }
};

// Add "Start" button
const button = document.createElement("button");
button.innerText = "Spin ↻";
document.body.appendChild(button);

// Button click event
button.addEventListener("click", () => {
    startGame();
    fadeOutMatchType(); // Start fade-out animation when button is clicked
});