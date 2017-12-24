const PADDING = 15;

const defaultValues = `
01 DEN ENKLE
02 KVESS
03 DRØMMEN
04 PIZZABAKEREN SPESIAL
05 SNADDER
06 MIX
07 MEKSIKANEREN
08 BIFFEN
09 DEN MARINERTE
10 PEPPERSVENNEN
11 FLAMMEN
12 TACOKYLLINGEN
13 KOKKENS KYLLING
14 KOKKENS FAVORITT
15 GNISTEN
16 LUKSUSKYLLING
17 KYLLINGFARMEN
18 VEGETARIANEREN
19 KEBABEN
20 DRENGEN
21 MR.X
22 CHORIZO SPESIAL
23 DOBBELDEKKER
24 HEIT KYLLING
25 CHORIZOEN
26 TOSPANNET
27 SQUASHEN
28 HOTTENTOTTEN
`.trim();

function shuffle(input) {
  const array = input.slice();
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const parseParticipants = participants =>
  participants
    .split('\n')
    .filter(Boolean)
    .map(participant => {
      if (/(\w+) (\d+)/.test(participant)) {
        return participant.trim().split(' ');
      }

      return [participant, 1];
    })
    .map(([name, count]) => Array(parseInt(count, 10)).fill(name))
    .reduce((acc, item) => [...acc, ...item], []);

(async () => {
  const canvas = document.querySelector('canvas');
  const winner = document.querySelector('#winner');
  canvas.width = window.innerHeight - 50;
  canvas.height = window.innerHeight - 50;

  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = true;

  const radius = canvas.width / 2;
  const queryString = new URLSearchParams(new URL(window.location.href).search);

  const options = {
    participants: queryString.get('values') || defaultValues,
    duration: parseInt(queryString.get('duration'), 10) || 10
  };

  document.querySelector('#values').value = options.participants;
  document.querySelector('#duration').value = options.duration;

  const values = shuffle(parseParticipants(options.participants));

  const colors = ['#771816', '#FFE79F', '#FFD57F', '#F7AC00'];

  const draw = rotate => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(rotate);
    context.translate(-canvas.width / 2, -canvas.height / 2);

    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.arc(radius, radius, radius, 0, 2 * Math.PI);
    context.fill();

    values.forEach((value, i) => {
      const radian = 2 * Math.PI / values.length;
      context.fillStyle = colors[i % colors.length];
      context.beginPath();
      context.moveTo(radius, radius);
      context.arc(
        radius,
        radius,
        radius - PADDING,
        radian * i,
        radian * (i + 1),
        false
      );
      context.closePath();
      context.fill();

      context.save();
      context.translate(radius, radius);
      context.rotate((i + 0.5) * radian);

      const dx = radius - 2 * PADDING;

      context.fillStyle = 'black';
      context.textAlign = 'right';
      context.font = `16px system-ui`;
      context.fillText(value, dx, 5);
      context.restore();
    });

    context.fillStyle = '#FFE79F';
    context.beginPath();
    context.arc(radius, radius, radius / 8, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  };

  let startAngle = Math.random() * Math.PI;
  let current = startAngle;

  let running = false;

  const run = (speed, duration) => {
    running = true;
    let start = performance.now();
    let angle = startAngle;

    const render = now => {
      let t = (now - start) / (1000 * duration);

      t = Math.min(1, t);
      angle = speed * (1 - t);

      current = (current + angle) % (Math.PI * 2);

      draw(angle);
      if (t < 1) {
        requestAnimationFrame(render);
      } else {
        const selected =
          values.length - Math.floor(current / (2 * Math.PI / values.length));
        winner.innerText = values[selected - 1];
        running = false;
      }
    };

    requestAnimationFrame(render);
  };

  canvas.addEventListener('click', () => {
    if (values.length === 0) {
      alert('No tickets available.');
      return;
    }
    if (running) return;
    run(Math.min(0.4, Math.floor(Math.random() * 10) / 10), options.duration);
  });

  draw(startAngle);
})();
