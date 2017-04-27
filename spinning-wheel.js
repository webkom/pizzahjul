const canvas = document.querySelector('canvas');
canvas.width = window.innerHeight;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

const values = [
  '01 DEN ENKLE',
  '02 KVESS',
  '03 DRØMMEN',
  '04 PIZZABAKEREN SPESIAL',
  '05 SNADDER',
  '06 MIX',
  '07 MEKSIKANEREN',
  '08 BIFFEN',
  '09 DEN MARINERTE',
  '10 PEPPERSVENNEN',
  '11 FLAMMEN',
  '12 TACOKYLLINGEN',
  '13 KOKKENS KYLLING',
  '14 KOKKENS FAVORITT',
  '15 GNISTEN',
  '16 LUKSUSKYLLING',
  '17 KYLLINGFARMEN',
  '18 VEGETARIANEREN',
  '19 KEBABEN',
  '20 DRENGEN',
  '21 MR.X',
  '22 CHORIZO SPESIAL',
  '23 DOBBELDEKKER',
  '24 HEIT KYLLING',
  '25 CHORIZOEN',
  '26 TOSPANNET',
  '27 SQUASHEN',
  '28 HOTTENTOTTEN'
];

const draw = speed => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  values.forEach((value, i) => {
    const radian = 2 * Math.PI / values.length;
    context.fillStyle = `hsl(${i / values.length * 360}, 83%, 60%)`;
    context.beginPath();
    context.moveTo(canvas.width / 2, canvas.height / 2);
    context.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.height / 2,
      radian * i,
      radian * (i + 1),
      false
    );
    context.closePath();
    context.fill();

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((i + 0.5) * radian);

    const dx = Math.floor(canvas.width / 2) - canvas.width / 4;

    context.fillStyle = 'black';
    context.font = `16px Helvetica`;
    context.fillText(value, dx, 0);
    context.restore();
  });

  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(speed * Math.PI / 180);
  context.translate(-canvas.width / 2, -canvas.height / 2);
};

const run = running => {
  let start = performance.now();
  let speed = 0;

  const render = () => {
    let now = performance.now();
    const t = (now - start) / 1000;
    speed = t < 5 ? t * t * 3 : speed * 0.98;

    draw(speed);

    if (running) {
      requestAnimationFrame(render);
    }
  };

  setTimeout(() => {
    running = false;
  }, 15000);

  render();
};

const button = document.querySelector('button');
button.addEventListener('click', () => {
  run(true);
});

run(false);
