// const { response } = require('express');
// console.log('run from fetch.js');
// Standart post request using fetch - Login
document.getElementById('loginForm').addEventListener('submit', addLogin);
document.getElementById('loginStafForm').addEventListener('submit', loginStaff);
document.getElementById('registerForm').addEventListener('submit', register);
document.getElementById('bookingForm').addEventListener('submit', createBooking);

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
    .then((data) => {
      console.log(data)
      if (data.success == true) {
        console.log('User has logged in succesfully');
        console.log(data);
      } else {
        console.log('Not logged in');
        console.log(data.success);
      }
    });
}

function loginStaff(e) {
  console.log('Coming from fetch');
  e.preventDefault();
  // get email and password values
  let email = document.getElementById('staffEmail').value;

  let password = document.getElementById('staffPassword').value;
  // call the api
  fetch('http://localhost:5000/api/v1/staff/login', {
    method: 'POST',
    headers: {
      //call the object in the headers
      Accept: 'application/json, text/plain, */*',
      'Content-type': 'application/json',
    }, //wrap the data in a stringify json function
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      if (data.success == true) {
        console.log('User has logged in succesfully');
        console.log(data);
      } else {
        console.log('Not logged in');
        console.log(data.success);
      }
    });
}

function createBooking(e) {
  e.preventDefault();
  // get email and password values
  let calendar = document.getElementById('calendar').value;

  alert(calendar);

  let costomerComments = document.getElementById('textarea').value;

  console.log(calendar);
  console.log(costomerComments);
  // call the api
  fetch('http://localhost:5000/api/v1/booking', {
    method: 'POST',
    headers: {
      //call the object in the headers
      Accept: 'application/json, text/plain, */*',
      'Content-type': 'application/json',
    }, //wrap the data in a stringify json function
    body: JSON.stringify({ bookingDate: calendar, costomerComments: costomerComments }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      // if (data.success == true) {
      //   console.log('Booking created');
      //   console.log(data);
      // } else {
      //   console.log(data);
      // }
    });
}

// Standart post request using fetch - Register
function register(e){
  e.preventDefault();
  console.log(e)

  // return false
  let registerForm = document.querySelector('#registerForm');
  const data = new URLSearchParams();
  for (const p of new FormData(registerForm)) {
    data.append(p[0], p[1]);
    console.log(p[0])
    // conse.log(p[1])
  }
  
  name = data.get("name");
  email = data.get("email");
  password = data.get("password");
  phone = data.get("phone");
  vehicleMake = data.get("vehicle make");
  vehicleEngine = data.get("vehicle engine");
  vehicleLicense = data.get("vehicle license");

  console.log(data.get("email"))

  // console.log(data);

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
};

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
