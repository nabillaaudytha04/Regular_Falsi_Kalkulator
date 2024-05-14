// Fungsi yang akan dicari akar-akarnya
function f(x, coefficients) {
  let result = 0;
  for (let i = 0; i < coefficients.length; i++) {
    result += coefficients[i] * Math.pow(x, coefficients.length - i - 1);
  }
  return result;
}

// Metode Regula Falsi
function regulaFalsi(a, b, epsilon, coefficients) {
  let fa = f(a, coefficients);
  let fb = f(b, coefficients);
  let c = 0;
  let iterations = [];
  let fxValues = []; // Untuk menyimpan nilai f(x) dalam setiap iterasi

  while (Math.abs(b - a) >= epsilon) {
    c = (a * fb - b * fa) / (fb - fa);
    let fc = f(c, coefficients);

    iterations.push({
      iteration: iterations.length + 1,
      a: a,
      b: b,
      x: c,
      fa: fa,
      fb: fb,
      fc: fc,
    });

    fxValues.push(fc);

    if (Math.abs(fc) < epsilon) {
      break;
    }

    if (fc * fa < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
  }

  return { root: c, iterations: iterations, fxValues: fxValues };
}

// Function to handle form submission
function calculate() {
  let a = parseFloat(document.getElementById('a').value);
  let b = parseFloat(document.getElementById('b').value);
  let epsilon = parseFloat(document.getElementById('epsilon').value);
  let degree = parseInt(document.getElementById('degree').value);

  let coefficients = [];
  for (let i = degree; i >= 0; i--) {
    coefficients.push(parseFloat(document.getElementById('coef_' + i).value));
  }

  let result = regulaFalsi(a, b, epsilon, coefficients);

  // Display root
  document.getElementById('result').innerHTML = 'Akar: <mark>' + result.root + '</mark>';

  // Display iteration table
  let table = '<h2>Tabel Hasil Iterasi</h2><table><tr><th>Iterasi</th><th>a</th><th>b</th><th>x</th><th>f(a)</th><th>f(b)</th><th>f(x)</th></tr>';
  result.iterations.forEach(function (iteration) {
    table += '<tr>';
    table += '<td>' + iteration.iteration + '</td>';
    table += '<td>' + iteration.a + '</td>';
    table += '<td>' + iteration.b + '</td>';
    table += '<td>' + iteration.x + '</td>';
    table += '<td>' + iteration.fa + '</td>';
    table += '<td>' + iteration.fb + '</td>';
    table += '<td>' + iteration.fc + '</td>';
    table += '</tr>';
  });
  table += '</table>';

  document.getElementById('iterations').innerHTML = table;

  // Display Chart
  displayChart(
    result.iterations.map((iteration) => iteration.iteration),
    result.fxValues
  );
}

// Function to display Chart
function displayChart(iterations, fxValues) {
  var ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: iterations,
      datasets: [
        {
          label: 'f(x)',
          data: fxValues,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
  return myChart;
}

// Dynamically generate input fields for coefficients based on selected degree
document.getElementById('degree').addEventListener('change', function () {
  let degree = parseInt(this.value);
  let coefficientsDiv = document.getElementById('coefficients');
  coefficientsDiv.innerHTML = ''; // Clear previous inputs

  for (let i = degree; i >= 0; i--) {
    let inputDiv = document.createElement('div');
    inputDiv.classList.add('fungsi');

    let label = document.createElement('label');
    label.innerHTML = 'x<sup>' + i + '</sup>';
    let input = document.createElement('input');
    input.type = 'number';
    input.id = 'coef_' + i;
    input.value = '0'; // Default value for coefficients
    inputDiv.appendChild(label);
    inputDiv.appendChild(input);

    coefficientsDiv.appendChild(inputDiv);

    if (i > 0) {
      coefficientsDiv.appendChild(document.createTextNode(' + '));
    }
  }
});

// Trigger the change event initially to generate input fields for default degree
document.getElementById('degree').dispatchEvent(new Event('change'));
