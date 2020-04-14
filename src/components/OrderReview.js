import React from 'react'
import PropTypes, { element } from 'prop-types'
import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";
import api from "./api";
import "./OrderReview.css"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input/input'

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
      lineItems: []
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidUpdate() {
    if(this.props.currentStep != 6) {
      return
    }

    if(this.state.error || this.state.amount > 0) {
      return
    }

    let order = {
      stone: this.props.stone,
      edge: this.props.edge,
      options: this.props.options,
      area: this.props.shape.getArea(),
      edgeLength: this.props.shape.getTotalEdgeLength(),
      backsplashLength: this.props.shape.getTotalBacksplashLength(),
      shape: this.props.shape.rawDef.name,
      sides: []
    }

    this.props.shape.params.forEach(element => {
      order.sides.push({
        label: element.label,
        length: element.value,
        isBacksplash: element.isBacksplash,
        edgeType: element.edgeType
      })
    })

    api.createPaymentIntent({
      payment_method_types: ["card"],
      details: order
    })
    .then(data => {
      this.setClientSecret(data.clientSecret)
      this.setAmount(data.amount)
      this.setLineItems(data.lineItems)
    })
    .catch(err => {
      this.setError(err.message)
    })
  }

  handleClose = event => {
    event.preventDefault()
    document.getElementById('checkOutModal').classList.toggle('is-active')
  }

  handlePhoneChange = e => {
    
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
    this.setState({
      succeeded: value
    })
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
      }
    });

    if (payload.error) {
      this.setError(`Payment failed: ${payload.error.message}`);
      this.setProcessing(false);
      console.log("[error]", payload.error);
    } else {
      this.setError(null);
      this.setSucceeded(true);
      this.setProcessing(false);
      this.setMetadata(payload.paymentIntent);
      console.log("[PaymentIntent]", payload.paymentIntent);
    }
  }

  renderSuccess = () => {
    return (
      <div className="sr-field-success message">
        <h1>Your test payment succeeded</h1>
        <p>View PaymentIntent response:</p>
        <pre className="sr-callout">
          <code>{JSON.stringify(this.state.metadata, null, 2)}</code>
        </pre>
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
                  Primar lorem ipsum dolor sit amet, consectetur
                  adipiscing elit lorem ipsum dolor. Pellentesque risus mi, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Sit amet,
                  consectetur adipiscing elit
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
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  autoComplete="cardholder"
                />
              </div>
            </div>
              
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="email"
                  name="email"
                  placeholder="your-email@gmail.com"
                  autoComplete="emailr"
                />
              </div>
            </div>

            <div className="field">
              <div className="control">
              <PhoneInput
                      className="input"
                      country="US"
                      name={'phone'}
                      id={'phone'}
                      required={true}
                      placeholder={'Phone number'}
                      onChange={this.handlePhoneChange}
                    />
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

            {this.state.error && <div className="notification is-danger is-light">{this.state.error}</div>}

            <button
              className="button is-primary"
              disabled={this.state.processing || !this.state.clientSecret }
            >
              {this.state.processing ? "Processing…" : "Pay"}
            </button>
          </form>
          </div>
        </div>
        <button onClick={this.handleClose} className="modal-close is-large" aria-label="close"></button>
      </div>
      </div>
    );
  }

  render() {
    if(this.props.currentStep !== 6) {
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
  currentStep: PropTypes.number
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
          />
      )}
    </ElementsConsumer>
  )
}

export default InjectedOrderReview