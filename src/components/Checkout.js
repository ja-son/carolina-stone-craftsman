import React from 'react'
import PropTypes from 'prop-types'

class Checkout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deliveryOption: ''
    }
  }
  handleStateChange = event => {
    const {name, value} = event.target
    console.log(name, value)
    this.setState({
      [name]: value
    })
  }

  renderRadiusForm = () => {
    return (
      <div>
        <h1>Poop</h1>
      </div>
    )
  }

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
              <input type="radio" name="deliveryOption" value="pickup" onChange={this.handleStateChange} />
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
              <input type="radio" name="deliveryOption" value="delivery" onChange={this.handleStateChange} />
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
              <input type="radio" name="deliveryOption" value="installed" onChange={this.handleStateChange} />
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
        {this.state.deliveryOption && this.state.deliveryOption === 'delivery' ? this.renderRadiusForm() : ''}
      </div>
    )
  }
}

Checkout.propTypes = {
  currentStep: PropTypes.number
}

export default Checkout