// import mapbox from './mapbox'
import { login } from './login'
//       script(src="/js/mapbox.js")
//       script(src="/js/login.js")

document.querySelector('.form').addEventListener('submit', (event) => {
  event.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  login(email, password)
})
