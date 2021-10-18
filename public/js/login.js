// import axios from 'axios'

login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/v1/users/login',
      data: { email, password },
    })
    if (res.status === 200 && res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/')
      }, 100)
    }
    console.log(res)
  } catch (error) {
    console.log('ERROR', error.response.data)
  }
}




logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:5000/api/v1/users/logout',
    })
    if (res.status === 200 && res.data.status === 'success') {
      window.setTimeout(() => {
        location.reload(true)
      }, 100)
    }
    console.log(res)
  } catch (error) {
    console.log('ERROR', error.response.data)
  }
}

if (document.querySelector('.form')) {
  document.querySelector('.form').addEventListener('submit', (event) => {
    event.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
  })
}

if (document.querySelector('.nav_el--logout')) {
  document.querySelector('.nav_el--logout').addEventListener('click', (event) => {
    event.preventDefault()
    logout()
  })
}


