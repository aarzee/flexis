
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

  const randomColor = () => COLORS[Math.random() * COLORS.length | 0];

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

  let boxIndex = 0;

  const moveForward = () => {
    colorsArray[boxIndex] = 'empty';
    boxIndex = (boxIndex + 1) % 200;
    colorsArray[boxIndex] = COLORS[((boxIndex / 10) | 0) % COLORS.length];
    updateColors();
  }

  setInterval(moveForward, 100);




});
