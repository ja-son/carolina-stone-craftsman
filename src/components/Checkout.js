import React from 'react'
import PropTypes from 'prop-types'

class Checkout extends React.Component {
  render() {
    if(this.props.currentStep !== 6) {
      return null
    }

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Delivery Options</h1>
            <h2 className="subtitle">Please choose your delivery options from the available choices below</h2>
          </div>
        </section>
        <section className="section">
          <progress class="progress is-large" value="85" max="100">85%</progress>
          <div className="columns">
            <div className="column">
              <label className="radioImage">
              <input type="radio" name="deliveryOption" value="none" />
              <div className="has-text-centered" style={{
                padding: "30px"
              }}>
                <span className="icon is-large">
                  <i className="fas fa-3x fa-people-carry"></i>
                </span>
                <h4>Pickup</h4>
              </div>
            </label>
            </div>
            <div className="column">
              <label className="radioImage">
              <input type="radio" name="deliveryOption" value="none" />
              <div className="has-text-centered" style={{
                padding: "30px"
              }}>
                <span className="icon is-large">
                  <i className="fas fa-3x fa-truck"></i>
                </span>
                <h4>Delivery</h4>
              </div>
            </label>
            </div>
            <div className="column">
              <label className="radioImage">
              <input type="radio" name="deliveryOption" value="none" />
              <div className="has-text-centered" style={{
                padding: "30px"
              }}>
                <span className="icon is-large">
                  <i className="fas fa-3x fa-tools"></i>
                </span>
                <h4>Installed</h4>
              </div>
            </label>
            </div>
            <div className="column"></div>
          </div>
        </section>
      </div>
    )
  }
}

Checkout.propTypes = {
  currentStep: PropTypes.number
}

export default Checkout