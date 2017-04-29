const canvas = document.querySelector('canvas');
const winner = document.querySelector('#winner');
canvas.width = window.innerHeight - 50;
canvas.height = window.innerHeight - 50;
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

const colors = ['#771816', '#FFE79F', '#FFD57F', '#F7AC00']

const draw = rotate => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(rotate);
  context.translate(-canvas.width / 2, -canvas.height / 2);

  context.fillStyle = '#db9704';
  context.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0, 2 * Math.PI);
  context.fill();

  values.forEach((value, i) => {
    const radian = 2 * Math.PI / values.length;
    context.fillStyle = `hsl(${i / values.length * 360}, 83%, 60%)`;
    context.fillStyle = colors[i % colors.length];
    context.beginPath();
    context.moveTo(canvas.width / 2, canvas.height / 2);
    context.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.height / 2 - 10,
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


};

let startAngle = Math.random() * Math.PI;
let current = startAngle;

const run = (speed, duration) => {
  let start = performance.now();
  let angle = startAngle;

  const render = (now) => {
    let t = (now - start) / (1000 * duration);

    t = Math.min(1, t);
    angle = speed * (1 - t);

    current = (current + angle) % (Math.PI * 2);

    draw(angle);

    if (t < 1) {
      requestAnimationFrame(render);
    } else {
      const selected = (values.length - Math.floor(current / ( 2 * Math.PI / values.length)));
      winner.innerText = values[selected - 1];
    }
  };

  requestAnimationFrame(render);
};

canvas.addEventListener('click', () => {
  run(Math.min(0.4, Math.floor(Math.random() * 10) / 10), 5);
});

draw(startAngle);
