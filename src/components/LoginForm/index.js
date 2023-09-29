import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  successFormDetails = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  failureFormDetails = errorMsg => {
    console.log(errorMsg)
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userData = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
    }
    const url = 'https://apis.ccbp.in/login'
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.successFormDetails(data.jwt_token)
      console.log(data)
    } else {
      this.failureFormDetails(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="responsive-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="app-logo"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <div className="label-container">
              <label htmlFor="userName" className="label">
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                id="userName"
                placeholder="Username"
                className="input-element"
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="label-container">
              <label htmlFor="password" className="label">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                id="password"
                placeholder="Password"
                className="input-element"
                onChange={this.onChangePassword}
              />
            </div>
            <button className="login-button" type="submit">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
