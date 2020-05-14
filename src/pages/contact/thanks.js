import React from 'react'
import Layout from '../../components/Layout'

export default () => (
  <Layout>
    <section className="hero is-primary">
      <div className="hero-body">
      <h1 className="title">Thank you!</h1>
      <h2 className="subtitle">We have received your request for a free consultation</h2>
      </div>
    </section>
    <section className="section">
        <div className="columns">
          <div className="column is-4">
            One of our representatives will call you within the next 24 hours to schedule your appointment.
            We lookf forward to speaking with you and hope to meet your stone and counter top needs.
          </div>
          <div className="column"></div>
        </div>
    </section>
  </Layout>
)
