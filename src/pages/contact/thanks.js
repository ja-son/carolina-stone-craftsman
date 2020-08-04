import React from 'react'
import Layout from '../../components/Layout'
const injectGA = () => {
  if (typeof window == 'undefined') {
    return;
  }
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('config', 'UA-43401338-8', {'page_path': '/contact/thanks/'})
  gtag('event', 'conversion', {'send_to': 'AW-945612695/7xKvCPP7jNYBEJfP88ID'});
}
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
    {/* <!-- Event snippet for Submit lead form conversion page --> */}
    <script>
      { injectGA() }
    </script>
  </Layout>
)
