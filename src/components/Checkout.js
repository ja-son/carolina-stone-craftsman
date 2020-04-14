import React from 'react'
import PropTypes from 'prop-types'

class Checkout extends React.Component {
  render() {
    if(this.props.currentStep !== 6) {
      return null
    }

    return (
      <div></div>
    )
  }
}

Checkout.propTypes = {
  currentStep: PropTypes.number
}

export default Checkout