import React from 'react'
import PropTypes, { element } from 'prop-types'
import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";
import api from "./api";
import "./OrderReview.css"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input/input'
import PreviewCompatibleImage from './PreviewCompatibleImage'
import Badge from '../../static/img/secure-stripe-payment-logo-300x90.png'

class OrderReview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 0,
      currency: "",
      clientSecret: null,
      error: null,
      metadata: null,
      succeeded: false,
      processing: false,
      order: {},
      lineItems: [],
      city: "",
      postal_code: "",
      stateAbbr: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidUpdate() {
    if(this.props.currentStep !== 8 || this.state.error) {
      return
    }

    let order = {
      stone: this.props.stone,
      edge: this.props.edge,
      options: this.props.options,
      sinkOffsets: this.props.sinkOffsets,
      quantity: this.props.quantity,
      deliveryOption: this.props.deliveryOption,
      area: this.props.shape.getArea(),
      edgeLength: this.props.shape.getTotalEdgeLength(),
      backsplashLength: this.props.shape.getTotalBacksplashLength(),
      shape: this.props.shape.rawDef.name,
      iconURIData: this.props.shape.iconURIData,
      sides: []
    }

    let shape = this.props.shape

    this.props.shape.params.map( (item, index) => {
      order.sides.push({
        label: item.label,
        length: shape.rawDef.paramsLengthFn[index](shape.paramsValuesMap),
        isBacksplash: item.isBacksplash,
        edgeType: item.edgeType
      })
    })

    let sidesChanged = false

    if(this.state.order.sides) {
      this.state.order.sides.map( (item, index) => {
        sidesChanged = sidesChanged === false && order.sides[index].edgeType != item.edgeType  
      })
    }

    if(this.state.amount === 0 || 
        (sidesChanged === true) ||
        (this.state.order.stone && this.state.order.stone !== order.stone) ||
        (this.state.order.area && this.state.order.area !== order.area) ||
        (this.state.order.edgeLength && this.state.order.edgeLength !== order.edgeLength) ||
        (this.state.order.edge && this.state.order.edge !== order.edge) ||
        (this.state.order.options && this.state.order.options !== order.options) ||
        (this.state.order.quantity && this.state.order.quantity !== order.quantity) ||
        (this.state.order.backsplashLength && this.state.order.backsplashLength !== order.backsplashLength) ) {

      api.createPaymentIntent({
        payment_method_types: ["card"],
        details: order
      })
      .then(data => {
        this.setState({
          clientSecret: data.clientSecret,
          amount: data.amount,
          lineItems: data.lineItems,
          order: order
        })
      })
      .catch(err => {
        this.setError(err.message)
      })
    }
  }

  handleClose = event => {
    event.preventDefault()
    document.getElementById('checkOutModal').classList.toggle('is-active')
  }

  handleStateChange = event => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handlePhoneChange = e => {
    this.setState({
      phone: e
    })
  }

  handlePostalCodeChange = event => {
    const {name, value} = event.target

    if(value.length >= 5) {
      fetch(`/.netlify/functions/zipcodeLookUp?zip=${value}`)
        .then(response => response.json())
        .then(data => {
          this.setState({
            city: data[value].city,
            stateAbbr: data[value].state
          })
        })
    }
  }

  setAmount(value) {
    this.setState({
      amount: value
    })
  }

  setCurrency(value) {
    this.setState({
      currency: value
    })
  }

  setClientSecret(value) {
    this.setState({
      clientSecret: value
    })
  }

  setError(value) {
    this.setState({
      error: value
    })
  }

  setMetadata(value) {
    this.setState({
      metadata: value
    })
  }

  setSucceeded(value) {
    api.saveOrder({
      amount: this.state.amount,
      order: this.state.order,
      lineItems: this.state.lineItems,
      metadata: this.state.metadata
    })
    .then(data => {
      if(data) {
        this.setState({
          orderId: data.id
        })
      }
    })
    .catch(err => {
      this.setError(err.message)
    })
    this.setState({
      succeeded: value
    })

    if(this.props.onSuccess) {
      this.props.onSuccess()
    }
  }

  setProcessing(value) {
    this.setState({
      processing: value
    })
  }

  setLineItems(value) {
    this.setState({
      lineItems: value
    })
  }

  handleSubmit = async ev => {
    ev.preventDefault();
    this.setProcessing(true);

    const {stripe, elements} = this.props;

    // Step 3: Use clientSecret from PaymentIntent and the CardElement
    // to confirm payment with stripe.confirmCardPayment()
    const payload = await stripe.confirmCardPayment(this.state.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: ev.target.name.value,
          email: ev.target.email.value,
          phone: ev.target.phone.value
        }
      },
      receipt_email: ev.target.email.value,
      shipping: {
          name: ev.target.name.value,
          phone: ev.target.phone.value,
          address: {
            line1: ev.target.line1.value,
            city: ev.target.city.value,
            postal_code: ev.target.postal_code.value,
            state: ev.target.stateAbbr.value
        }
      }
    });

    if (payload.error) {
      this.setError(`Payment failed: ${payload.error.message}`);
      this.setProcessing(false);
      console.log("[error]", payload.error);
    } else {
      this.setError(null);
      this.setProcessing(false);
      this.setMetadata(payload.paymentIntent);
      this.setSucceeded(true);
      console.log("[PaymentIntent]", payload.paymentIntent);
    }
  }

  renderSuccess = () => {
    let orderDate = this.state.metadata ? new Date(this.state.metadata.created * 1000).toLocaleString() : Date.now().toLocaleString()
    return (
      <div>
      <section className="hero is-primary">
        <div className="hero-body">
          <h1 className="title">Thanks for your order</h1>
          <h2 className="subtitle">We are getting started on your order right away, and you will receive a confirmation email at {this.state.metadata ? this.state.metadata.receipt_email : ''}. You can also expect a call from one of our sales staff within 24 hours to provide a lead time of when your will be ready.</h2>
        </div>
      </section>
      <div className="container">
            <h4 className="title is-4">Order Details</h4>
        <div className="columns is-mobile">
          <div className="column"></div>
          <div className="column">
          </div>
          <div className="column"></div>
        </div>
        <div className="columns is-mobile">
          <div className="column is-3">
              <label className="label">Order Id</label>
              {this.state.orderId ? this.state.orderId : ''}
          </div>
          <div className="column">
            <div className="is-pulled-left">
              <label className="label">Order date</label>
              {orderDate}
            </div>
          </div>
        </div>
        <div className="columns is-mobile">
          <div className="column is-3">
            <label className="label">Customer Name</label>
            {this.state.metadata ? this.state.metadata.shipping.name : ''}
          </div>
          <div className="column ">
            <div className="is-pulled-left">
              <label className="label">Email</label>
              {this.state.metadata ? this.state.metadata.receipt_email : ''}              
            </div>
          </div>
        </div>
        <div className="columns is-mobile">
          <div className="column is-3">
            <label className="label">Total</label>
            $ {this.state.metadata ? this.state.metadata.amount / 100 : '0.00'}
          </div>
          <div className="column ">
            <div className="is-pulled-left">
              <label className="label">Contact number</label>
              {this.state.metadata ? this.state.metadata.shipping.phone : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }

  renderForm = () => {
    const options = {
      style: {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      }
    }

    const grandTotal = this.state.amount ? this.state.amount.toFixed(2) : 0.00
    
    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Order Summary</h1>
            <h2 className="subtitle">Review the details of your order before you checkout</h2>
          </div>
        </section>
        <section className="section">
          <div className="columns">
            <div className="column"></div>
            <div className="column is-4">
              <table className="table is-striped is-fullwidth">
                <thead>
                  <tr>
                    <th>Line Item</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.lineItems &&
                  this.state.lineItems.map(item => (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>$ {item.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Grand Total</th>
                    <th>$ {grandTotal}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="column is-4">
              <div className="notification is-info is-light">
                <strong>Before you place your order</strong>
                <p>
                  Please note that we respond to all orders 
                  within 24 hours by phone to verify your purchase 
                  and selections. After confirmation of your
                  order, we provide you a lead time and 
                  when you can expect your order to be either 
                  delivered or picked up.
                </p>
              </div>
            </div>
            <div className="column"></div>
          </div>
        </section>
      <div className="modal" id="checkOutModal">
        <div className="modal-background"></div>
        <div className="modal-content" style={{
          backgroundColor: "#FFF"
        }}>
          <div className="box">
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  id="name"
                  name="name"
                  required={true}
                  placeholder="Name"
                  autoComplete="cardholder"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
            </div>
              
            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="email"
                  id="email"
                  name="email"
                  required={true}
                  placeholder="your-email@gmail.com"
                  autoComplete="email"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <div className="control has-icons-left">
              <PhoneInput
                      className="input"
                      country="US"
                      name={'phone'}
                      id={'phone'}
                      required={true}
                      placeholder={'Phone number'}
                      onChange={this.handlePhoneChange}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-phone"></i>
                    </span>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <CardElement
                  className="sr-input"
                  options={options}
                />
              </div>
            </div>

            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  id="line1"
                  name="line1"
                  required={true}
                  placeholder="Shipping Address"
                  autoComplete="line1"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-map-marker-alt"></i>
                </span>
              </div>
            </div>

            <div className="field has-addons">
            <div className="control">
                <input
                  className="input"
                  type="number"
                  id="postal_code"
                  name="postal_code"
                  required={true}
                  placeholder="Shipping Postal Code"
                  autoComplete="postal_code"
                  onChange={this.handlePostalCodeChange}
                  maxLength={5}
                />
              </div>
              <div className="control">
                <div className="select">
                  <select id="stateAbbr"
                    name="stateAbbr" 
                    value={this.state.stateAbbr}
                    onChange={this.handleStateChange}>
                      <option>Select State</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="DC">District Of Columbia</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                  </select>
                </div>
              </div>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="city"
                  name="city"
                  required={true}
                  placeholder="Shipping City"
                  autoComplete="city"
                  value={this.state.city}
                  onChange={this.handleStateChange}
                />
              </div>
            </div>

            {this.state.error && <div className="notification is-danger is-light">{this.state.error}</div>}

            <div className="columns is-centered is-vcentered">
              <div className="column">
              <button
                className="button is-fullwidth is-primary"
                disabled={this.state.processing || !this.state.clientSecret }>
                  {this.state.processing ? "Processing…" : "Pay"}
              </button>
              </div>
              <div className="column">
                <PreviewCompatibleImage
                  imageInfo={{
                    image: Badge,
                    style: {
                      maxWidth: "300px",
                      maxHeight: "90px"
                    }
                  }} /> 
              </div>
              <div className="column"></div>
            </div>

          </form>
          </div>
        </div>
        <button onClick={this.handleClose} className="modal-close is-large" aria-label="close"></button>
      </div>
      </div>
    );
  }

  render() {
    if(this.props.currentStep !== 8) {
      return null
    }

    return (
      <div>
        {this.state.succeeded ? this.renderSuccess() : this.renderForm()}
      </div>
    )
  }
}

OrderReview.propTypes = {
  currentStep: PropTypes.number,
  onSuccess: PropTypes.func
}

const InjectedOrderReview = (props) => {
  return (
    <ElementsConsumer>
      {({elements, stripe}) => (
        <OrderReview 
          elements={elements} 
          stripe={stripe} 
          currentStep={props.currentStep} 
          shape={props.shape}
          edge={props.edge}
          stone={props.stone}
          options={props.options} 
          sinkOffsets={props.sinkOffsets}
          quantity={props.quantity}
          deliveryOption={props.deliveryOption}
          onSuccess={props.onSuccess}
          />
      )}
    </ElementsConsumer>
  )
}

export default InjectedOrderReview