/*const login = document.getElementById('login');
login.addEventListener('submit', function (e) {
  e.preventDefaut();

  const loginData = new loginData(this);

  fetch('/api/v1/auth/login', {
    method: 'POST',
    body: loginData,
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      console.log(text);
    })
    .catch(function (error) {
      console.log(error);
    });
});*/

const login = document.getElementById('loginForm');
const btn = document.getElementById('submit');
btn.addEventListener('click', login);
const sendHttpRequest = (method, url, data) => {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: data ? { 'Content-type': 'application/json' } : {},
  }).then((response) => {
    if (response.status >= 400) {
      //!response.ok
      return response.json().then((errResData) => {
        const error = new Error('Something went wrong!');
        error.data = errResData;
        throw error;
      });
    }

    return response.json();
  });
};
const loginData = () => {
  sendHttpRequest('POST', '/api/v1/auth/login')
    .then((responseData) => {
      console.log(responseData);
    })

    .catch((err) => {
      console.log(err);
    });
};
