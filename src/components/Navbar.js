import React from 'react'
import { Link } from 'gatsby'
import logo from '../img/logo_sm.jpg'

const Navbar = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      navBarActiveClass: '',
    }
  }

  toggleHamburger = () => {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active,
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
              navBarActiveClass: 'is-active',
            })
          : this.setState({
              navBarActiveClass: '',
            })
      }
    )
  }

  render() {
    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item" title="Carolina Stone Craftsman">
              <img src={logo} alt="Carolina Stone Craftsman" style={{ transform: 'scale(2.7)', marginLeft: '40px', marginTop: '18px', marginBottom: '28px' }} />
            </Link>
            <span className="navbar-item phone" style={{ marginLeft: '2.2em' }}>
              <a href="tel:803-408-3456">803-408-3456</a>
            </span>
            {/* Hamburger menu */}
            <div
              className={`navbar-burger burger ${this.state.navBarActiveClass}`}
              data-target="navMenu"
              onClick={() => this.toggleHamburger()}
            >
              <span />
              <span />
              <span />
            </div>
          </div>
          <div
            id="navMenu"
            className={`navbar-menu ${this.state.navBarActiveClass}`}
          >
            <div className="navbar-start has-text-centered">
              <Link className="navbar-item" to="/about">
                About
              </Link>
              <Link className="navbar-item" to="/gallery/show">
                Gallery
              </Link>
              <Link className="navbar-item" to="/products/order">
                Shop
              </Link>
              <Link className="navbar-item" to="/blog">
                Blog
              </Link>
              {/* <Link className="navbar-item" to="/contact">
                Contact
              </Link> */}
              {/* <Link className="navbar-item" to="/contact/examples">
                Form Examples
              </Link> */}
            </div>
            <div className="navbar-end has-text-centered">
             
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
