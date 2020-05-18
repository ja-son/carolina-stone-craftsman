import React from 'react'
import PropTypes from 'prop-types'
import api from '../components/api'

class Checkout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deliveryOption: '',
      canDeliver: true,
      zipCode: ''
    }
  }
  handleStateChange = event => {
    const {name, value} = event.target
    let canDeliver = value === "pickup"
    this.setState({
      [name]: value,
      zipCode: ''
    })
    this.props.onChange({
      deliveryOption: value,
      canDeliver: canDeliver
    })
  }

  handleZipChange = event => {
    const {value} = event.target
    this.setState({
      zipCode: value
    })
    if(value && value.length === 5) {
      this.setState({
        isProcessing: true
      })
      api.canDeliver(value)
      .then(data => {
        this.setState({
          isProcessing: false,
          canDeliver: data
        })
        this.props.onChange({
          deliveryOption: this.state.deliveryOption,
          canDeliver: this.state.canDeliver
        })
      })
    } else {
      this.setState({
        canDeliver: false,
      })
      this.props.onChange({
        deliveryOption: this.state.deliveryOption,
        canDeliver: false
      })
    }
  }

  renderRadiusForm = () => {
    let className = 'control'
    let messageVisibility = 'hidden'
    let messageDisplay = 'none'
    
    if(this.state.isProcessing === true) {
      className += ' is-loading'
    }

    if(this.state.canDeliver === false) {
      messageVisibility = "visible"
      messageDisplay = "block"
    } else {
      messageVisibility = 'hidden'
      messageDisplay = 'none'
    }

    let zipCode = this.state.zipCode
    return (
      <section className="section">
      <div className="columns">
        <div className="column is-3">
          <label className="label" htmlFor={'zipCode'}>Enter your zip code</label>
          <div className={className}>
            <input className="input"
              type="text" 
              name="zipCode" 
              value={zipCode}
              onChange={this.handleZipChange} />
          </div>
        </div>
        <div className="column">
          <article 
              className="message is-warning is-medium"
              style={{
                visibility: messageVisibility,
                display: messageDisplay
              }}>
                <div className="message-body">
                You must pick up your order from that location
                </div>
            </article>
        </div>
        <div className="column"></div>
      </div>
      </section>
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
          <progress className="progress is-large" value="85" max="100">85%</progress>
          <div className="columns">
            <div className="column">
              <label className="radioImage">
              <input type="radio" 
                name="deliveryOption" 
                value="pickup" 
                onChange={this.handleStateChange} 
                checked={this.state.deliveryOption === "pickup"} />
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
              <input type="radio" 
                name="deliveryOption" 
                value="delivery" 
                onChange={this.handleStateChange} 
                checked={this.state.deliveryOption === "delivery"} />
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
              <input type="radio" 
                name="deliveryOption" 
                value="installed" 
                onChange={this.handleStateChange} 
                checked={this.state.deliveryOption === "installed"} />
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
  currentStep: PropTypes.number,
}

export default Checkout