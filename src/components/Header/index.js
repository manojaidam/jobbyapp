import './index.css'
import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import {AiOutlineHome} from 'react-icons/ai'
import {BsFillFolderSymlinkFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

const Header = props => {
  const onRemoveToken = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="header-container">
      <Link to="/" className="link-item">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="header-app-logo"
          alt="website logo"
        />
      </Link>

      <ul className="header-list-container">
        <Link to="/" className="link-item">
          <li className="header-list-item">Home</li>
        </Link>
        <Link to="/" className="link-item">
          <li className="header-list-icon">
            <AiOutlineHome className="header-icon" />
          </li>
        </Link>
        <Link to="/jobs" className="link-item">
          <li className="header-list-item">Jobs</li>
        </Link>
        <Link to="/jobs" className="link-item">
          <li className="header-list-icon">
            <BsFillFolderSymlinkFill className="header-icon" />
          </li>
        </Link>
      </ul>
      <button
        type="button"
        className="header-logout-button"
        onClick={onRemoveToken}
      >
        Logout
      </button>
      <button
        type="button"
        className="header-logout-icon-button"
        onClick={onRemoveToken}
      >
        <FiLogOut className="header-icon" />
      </button>
    </nav>
  )
}

export default withRouter(Header)
