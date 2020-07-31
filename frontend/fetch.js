const { response } = require('express');

// Standart post request using fetch - Login
document.getElementById('login').addEventListener('submit', addLogin);
// pass in event parameter to prevent submiting to a file.
function addLogin(e) {
  e.preventDefault();
  // get email and password values
  let email = document.getElementById('email').value;

  let password = document.getElementById('password').value;
  // call the api
  fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      //call the object in the headers
      Accept: 'application/json, text/plain, */*',
      'Content-type': 'application/json',
    }, //wrap the data in a stringify json function
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

// Standart post request using fetch - Register

document.querySelector('#register').addEventListener('submit', (e) => {
  e.preventDefault();
  let registerForm = document.querySelector('#register');
  const data = new URLSearchParams();
  for (const p of new FormData(registerForm)) {
    data.append(p[0], p[1]);
  }
  fetch('http://localhost:5000/api/v1/auth/register', {
    method: 'POST',
    headers: {
      //call the object in the headers
      Accept: 'application/json, text/plain, */* ',
      'Content-type': 'application/json',
    }, //wrap the data in a stringify json function
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      phone: phone,
      vehicleMake: vehicleMake,
      vehicleEngine: vehicleEngine,
      vehicleLicense: vehicleLicense,
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
});

/*document.getElementById('register').addEventListener('submit', addRegister);
// pass in event parameter to prevent submiting to a file.
function addRegister(e) {
  e.preventDefault();
  // get all values
  let name = document.getElementById('name').value;

  let email = document.getElementById('email').value;

  let password = document.getElementById('password').value;

  let phone = document.getElementById('phone').value;

  let vehicleMake = document.getElementById('vehicleMake').value;

  let vehicleEngine = document.getElementById('vehicleEngine').value;

  let vehicleLicense = document.getElementById('vehicleLicense').value;

  // call the api
  fetch('http://localhost:5000/api/v1/auth/register', {
    method: 'POST',
    headers: {
      //call the object in the headers
      Accept: 'application/json, text/plain, ',
      'Content-type': 'application/json',
    }, //wrap the data in a stringify json function
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      phone: phone,
      vehicleMake: vehicleMake,
      vehicleEngine: vehicleEngine,
      vehicleLicense: vehicleLicense,
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}*/
// code taken from Fetch API Introduction - TraversyMedia - https://www.youtube.com/watch?v=Oive66jrwBs
