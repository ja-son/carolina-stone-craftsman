import React from 'react'
import { Link } from 'gatsby'
import Layout from '../../components/Layout'
import Photo from '../contact/thanks.jpg'

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
      <h2 className="subtitle">We have received your request for a free consultation &amp; estimate</h2>
      </div>
    </section>
    <section className="section">
        <div className="columns">
          <div className="column is-4">
            <p>
              One of our representatives will call you within the next 24 hours to schedule your appointment.
              We look forward to speaking with you and hope to meet your stone and counter top needs.
            </p>
            <br/>
            <p>
              In the mean time, please take a look at some examples other <Link to="/gallery/show">counter tops </Link> 
              and <Link to="/gallery/show">vanities</Link> we have fabricated and installed for our customers. If your
              are a builder, contractor, or do-it-yourself (DIY) you can <Link to="/products/order">
              order countertops and vanities</Link> cut to your dimensions <Link to="/products/order">here</Link>.
            </p>
          </div>
          <div className="column">
            <img src={Photo} alt="kitchen countertop"/>
          </div>
        </div>
    </section>
    {/* <!-- Event snippet for Submit lead form conversion page --> */}
    <script>
      { injectGA() }
    </script>
  </Layout>
)
