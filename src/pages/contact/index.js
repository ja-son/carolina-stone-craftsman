import React from 'react'
import { navigate } from 'gatsby-link'
import Layout from '../../components/Layout'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input/input'

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isValidated: false }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handlePhoneChange = e => {
    this.setState({phone: e})
  }

  handleSubmit = e => {
    e.preventDefault()
    const form = e.target
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': form.getAttribute('name'),
        ...this.state,
      }),
    })
      .then(() => navigate(form.getAttribute('action')))
      .catch(error => alert(error))
  }

  render() {
    return (
      <Layout>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Schedule Consultation</h1>
            <h2 className="subtitle">Please fill the form out below to schedule your free consultation with
                one of our professionals.</h2>
          </div>
        </section>
        <section className="section">
          <div className="columns">
            <div className="column is-4">
              <p>
                We will contact you within 24 hours of receiving
                your submission.
              </p>
              <form
                name="consultation"
                method="post"
                action="/contact/thanks/"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={this.handleSubmit}
              >
                {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
                <input type="hidden" name="form-name" value="contact" />
                <div hidden>
                  <label>
                    Don’t fill this out:{' '}
                    <input name="bot-field" onChange={this.handleChange} />
                  </label>
                </div>
                <div className="field">
                  <label className="label" htmlFor={'name'}>
                    Your name
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type={'text'}
                      name={'name'}
                      onChange={this.handleChange}
                      id={'name'}
                      required={true}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor={'email'}>
                    Email
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type={'email'}
                      name={'email'}
                      onChange={this.handleChange}
                      id={'email'}
                      required={true}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor={'phone'}>
                    Phone
                  </label>
                  <div className="control">
                    <PhoneInput
                      className="input"
                      country="US"
                      name={'phone'}
                      onChange={this.handlePhoneChange}
                      id={'phone'}
                      required={true}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor={'bestTime'}>
                    Best time to contact
                  </label>
                  <div className="control">
                    <label className="radio">
                      <input type="radio" name={'bestTime'} value="morning"
                      onChange={this.handleChange}
                      style={{ 
                        margin: "6px"
                      }}/>
                      Morning
                    </label>
                    <label className="radio">
                      <input type="radio" name={'bestTime'} value="day"
                      onChange={this.handleChange}
                      style={{
                        margin: "6px"
                      }}/>
                      Day
                    </label>
                    <label className="radio">
                      <input type="radio" name={'bestTime'} value="evening"
                      onChange={this.handleChange}
                      style={{
                        margin: "6px"
                      }}/>
                      Evening
                    </label>
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor={'comments'}>
                    Please describe your project
                  </label>
                  <textarea className="textarea" onChange={this.handleChange} name={'comments'}></textarea>
                </div>
                <div className="field">
                  <button className="button is-link" type="submit">
                    Send
                  </button>
                </div>
              </form>
            </div>
            <div className="column"></div>
          </div>
        </section>
      </Layout>
    )
  }
}
