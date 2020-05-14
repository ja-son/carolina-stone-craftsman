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
          <div className="control">
            <label className="radio">
              <input type="radio" name="deliveryOption" />
              Pickup
            </label>
            <label className="radio">
              <input type="radio" name="deliveryOption" />
              Delivery
            </label>
            <label className="radio">
              <input type="radio" name="deliveryOption" />
              Installed
            </label>
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