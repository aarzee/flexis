
document.addEventListener('DOMContentLoaded', () => {
  const COLORS = [
    'yellow',
    'blue',
    'red',
    'limegreen',
    'cyan',
    'orange',
    'hotpink'
  ];

  const TETROMINOES = [
    'i',
    'o',
    't',
    'j',
    'l',
    's',
    'z'
  ];

  const TETROMINO_COLORS = {
    i: 'cyan',
    o: 'yellow',
    t: 'hotpink',
    j: 'blue',
    l: 'orange',
    s: 'limegreen',
    z: 'red'
  };

  const TETROMINO_SHAPES = {
    i: [
      [
        [false, true, false, false],
        [false, true, false, false],
        [false, true, false, false],
        [false, true, false, false]
      ],
      [
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
        [false, false, false, false]
      ],
      [
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false]
      ],
      [
        [false, false, false, false],
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false]
      ]
    ],
    o: [
      [
        [true, true],
        [true, true]
      ],
      [
        [true, true],
        [true, true]
      ],
      [
        [true, true],
        [true, true]
      ],
      [
        [true, true],
        [true, true]
      ]
    ],
    t: [
      [
        [false, false, false],
        [true, true, true],
        [false, true, false],
      ],
      [
        [false, true, false],
        [false, true, true],
        [false, true, false]
      ],
      [
        [false, true, false],
        [true, true, true],
        [false, false, false]
      ],
      [
        [false, true, false],
        [true, true, false],
        [false, true, false]
      ]
    ],
    j: [
      [
        [false, false, false],
        [true, true, true],
        [false, false, true]
      ],
      [
        [false, true, true],
        [false, true, false],
        [false, true, false]
      ],
      [
        [true, false, false],
        [true, true, true],
        [false, false, false]
      ],
      [
        [false, true, false],
        [false, true, false],
        [true, true, false]
      ]
    ],
    l: [
      [
        [false, false, false],
        [true, true, true],
        [true, false, false]
      ],
      [
        [false, true, false],
        [false, true, false],
        [false, true, true]
      ],
      [
        [false, false, true],
        [true, true, true],
        [false, false, false]
      ],
      [
        [true, true, false],
        [false, true, false],
        [false, true, false]
      ]
    ],
    s: [
      [
        [false, true, true],
        [true, true, false],
        [false, false, false]
      ],
      [
        [true, false, false],
        [true, true, false],
        [false, true, false]
      ],
      [
        [false, false, false],
        [false, true, true],
        [true, true, false]
      ],
      [
        [false, true, false],
        [false, true, true],
        [false, false, true]
      ]
    ],
    z: [
      [
        [true, true, false],
        [false, true, true],
        [false, false, false]
      ],
      [
        [false, true, false],
        [true, true, false],
        [true, false, false]
      ],
      [
        [false, false, false],
        [true, true, false],
        [false, true, true]
      ],
      [
        [false, false, true],
        [false, true, true],
        [false, true, false]
      ]
    ]
  };

  const randomColor = () => COLORS[Math.random() * COLORS.length | 0];

  const randomTetromino = () => TETROMINOES[Math.random() * TETROMINOES.length | 0];

  const root = document.getElementById('root');

  const boxesContainer = document.createElement('div');
  boxesContainer.id = 'boxes';


  root.appendChild(boxesContainer);

  const boxes = [];

  const colorsArray = [];

  for(let i = 0; i < 200; i++) {
    const color = 'empty';
    colorsArray.push(color);
    const box = document.createElement('div');
    box.className = color;
    boxesContainer.appendChild(box);
    boxes.push(box);
  }

  const colorsBuffer = new Array(200);

  let i = 200;

  while(i--) colorsBuffer[i] = colorsArray[i];

  const updateColors = () => {
    for(let i = 0; i < 200; i++) {
      if(colorsArray[i] !== colorsBuffer[i]) {
        colorsBuffer[i] = colorsArray[i];
        boxes[i].className = colorsArray[i];
      }
    }
  };

  let boxIndex = 199;

  const moveForward = () => {
    colorsArray[boxIndex] = 'empty';
    boxIndex = (boxIndex + 1) % 200;
    colorsArray[boxIndex] = COLORS[((boxIndex / 10) | 0) % COLORS.length];
    updateColors();
  }

  // setInterval(moveForward, 100);

  const coordToIndex = (x, y) => y * 10 + x;


  let currentTopLeft = coordToIndex(4, 0);

  let currentRotation = 0;
  let currentTetromino = 'i';

  const tetrominoPositions = (tetromino, rotation, topLeft) => {
    const shape = TETROMINO_SHAPES[tetromino][rotation];
    const positions = [];
    for(let i = 0; i < shape.length; i++) {
      for(let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) positions.push(topLeft + coordToIndex(j, i));
      }
    }
    return positions;
  }

  const putTetromino = (tetromino, rotation, topLeft) => {
    tetrominoPositions(tetromino, rotation, topLeft).forEach(index => colorsArray[index] = TETROMINO_COLORS[tetromino]);
  };

  const removeTetromino = (tetromino, rotation, topLeft) => {
    tetrominoPositions(tetromino, rotation, topLeft).forEach(index => colorsArray[index] = 'empty');
  };

  putTetromino(currentTetromino, currentRotation, currentTopLeft);
  updateColors();

  const rotate = () => {
    removeTetromino(currentTetromino, currentRotation, currentTopLeft);
    currentRotation = (currentRotation + 1) & 3;
    putTetromino(currentTetromino, currentRotation, currentTopLeft);
    // debugger;
    updateColors();
  };

  let ticks = 0;
  let tetrominoIndex = 0;

  const update = () => {
    if (ticks % 10 == 9) {
      removeTetromino(currentTetromino, currentRotation, currentTopLeft);
      tetrominoIndex = (tetrominoIndex + 1) % TETROMINOES.length;
      currentTetromino = TETROMINOES[tetrominoIndex];
      currentRotation = 0;
      putTetromino(currentTetromino, currentRotation, currentTopLeft);
    } else rotate();
    ticks++;
  }

  setInterval(update, 500);

});
