/*fetch('http://localhost:5000/api/auth/login', {
  method: 'POST', // or 'PUT'
  body: JSON.stringify(user), // data can be `string` or {object}!
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((res) => {
    document.getElementById('login');
    console.log(res);
  })
  .catch((error) => console.error('Error:', error));

// code from Stack Overflow https://stackoverflow.com/questions/54007817/postman-able-to-send-post-request-but-not-my-frontend-code*/

document.getElementById('login').addEventListener('submit', addLogin);

function addLogin(e) {
  e.preventDefault();

  let email = document.getElementById('email').value;

  let password = document.getElementById('password').value;

  fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}
// code taken from Fetch API Introduction - TraversyMedia https://www.youtube.com/watch?v=Oive66jrwBs
