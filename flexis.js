
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


  let currentTopLeft = [4, 0];

  let currentRotation = 0;
  let currentTetromino = 'l';

  const tetrominoPositions = (tetromino, rotation, topLeft) => {
    const shape = TETROMINO_SHAPES[tetromino][rotation];
    const positions = [];
    const [topLeftX, topLeftY] = topLeft;
    for(let i = 0; i < shape.length; i++) {
      for(let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) positions.push([topLeftX + j, topLeftY + i]);
      }
    }
    return positions;
  }

  const illegalPosition = ([x, y]) => x < 0 || x > 9 || y < 0 || y > 19;

  const putTetromino = (tetromino, rotation, topLeft) => {
    tetrominoPositions(tetromino, rotation, topLeft).forEach(([x, y]) => colorsArray[coordToIndex(x, y)] = TETROMINO_COLORS[tetromino]);
  };

  const tetrominoAtRest = (tetromino, rotation, topLeft) => {
    const positions = tetrominoPositions(tetromino, rotation, topLeft);
    for(let i = 0; i < positions.length; i++) {
      const [x, y] = positions[i];
      if (y === 19)
        return true;
      const below = [x, y + 1];
      if (!positions.includes(below) && colorsArray[coordToIndex(x, y + 1)] !== 'empty')
        return true;
    }
    return false;
  };

  const positionsAreLegal = positions => {
    for(let i = 0; i < positions.length; i++) {
      const [x, y] = positions[i];
      if (illegalPosition([x, y]) || colorsArray[coordToIndex(x, y)] !== 'empty')
        return false;
    }
    return true;
  }

  const removeTetromino = (tetromino, rotation, topLeft) => {
    tetrominoPositions(tetromino, rotation, topLeft).map(([x, y]) => coordToIndex(x, y)).forEach(index => colorsArray[index] = 'empty');
  };

  const moveLeft = () => {
    const [topLeftX, topLeftY] = currentTopLeft;
    removeTetromino(currentTetromino, currentRotation, currentTopLeft);
    debugger;
    if (positionsAreLegal(tetrominoPositions(currentTetromino, currentRotation, [topLeftX - 1, topLeftY])))
      currentTopLeft = [topLeftX - 1, topLeftY];
    putTetromino(currentTetromino, currentRotation, currentTopLeft);
    updateColors();
  };

  const moveRight = () => {
    const [topLeftX, topLeftY] = currentTopLeft;
    removeTetromino(currentTetromino, currentRotation, currentTopLeft);
    if (positionsAreLegal(tetrominoPositions(currentTetromino, currentRotation, [topLeftX + 1, topLeftY])))
      currentTopLeft = [topLeftX + 1, topLeftY];
    putTetromino(currentTetromino, currentRotation, currentTopLeft);
    updateColors();
  };

  putTetromino(currentTetromino, currentRotation, currentTopLeft);
  updateColors();

  const extremities = positions => {
    let left = positions[0][0];
    let right = positions[0][0];
    let up = positions[0][1];
    let down = positions[0][1];
    for(let i = 1; i < positions.length; i++) {
      left = Math.min(left, positions[i][0]);
      right = Math.max(right, positions[i][0]);
      up = Math.min(up, positions[i][1]);
      down = Math.max(down, positions[i][1]);
    }
    return { left, right, up, down };
  };

  const rotate = () => {
    removeTetromino(currentTetromino, currentRotation, currentTopLeft);
    const newRotation = (currentRotation + 1) & 3;
    let positionsAreInBounds = false;
    let newPositions = tetrominoPositions(currentTetromino, newRotation, currentTopLeft);
    let [newTopLeftX, newTopLeftY] = currentTopLeft;

    const { left, right, up, down } = extremities(newPositions);
    console.log(left, right, up, down);
    if (left < 0) newTopLeftX -= left;
    if (right > 9) newTopLeftX -= (right - 9);
    if (up < 0) newTopLeftY += up;
    if (down > 19) newTopLeftY -= (down - 19);

    if(newTopLeftX !== currentTopLeft[0] || newTopLeftY !== currentTopLeft[1])
      newPositions = tetrominoPositions(currentTetromino,
      newRotation, [newTopLeftX, newTopLeftY]);

    if (positionsAreLegal(newPositions))
      currentRotation = newRotation;
      currentTopLeft = [newTopLeftX, newTopLeftY];

    putTetromino(currentTetromino, currentRotation, currentTopLeft);
    updateColors();
  };

  let ticks = 0;
  let tetrominoIndex = 0;

  const update = () => {
    if (ticks % 10 === 9) {
      removeTetromino(currentTetromino, currentRotation, currentTopLeft);
      tetrominoIndex = (tetrominoIndex + 1) % TETROMINOES.length;
      currentTetromino = TETROMINOES[tetrominoIndex];
      currentRotation = 0;
      putTetromino(currentTetromino, currentRotation, currentTopLeft);
    } else rotate();
    ticks++;
  }

  document.addEventListener('keydown', e => {
    switch (e.keyCode) {
      case 37:
        moveLeft();
        break;
      case 39:
        moveRight();
        break;
      case 38:
        rotate();
        break;
    }
  });

});
