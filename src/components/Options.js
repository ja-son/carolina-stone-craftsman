import React from 'react'
import PropTypes from 'prop-types'
import PreviewCompatibleImage from './PreviewCompatibleImage'
import Overmount from '../img/overmount-bowl.jpg'
import Undermount from '../img/undermount-bowl.jpg'

class Options extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }
  render() {
    if(this.props.currentStep !== 3) {
      return null
    }

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Optional</h1>
            <h2 className="subtitle">Select the number and type of sink cutouts needed</h2>
          </div>
        </section>
        <section className="section">
        <div className="columns is-centered">
          <div className="column"></div>

              <div className="column is-narrow">
                <div className="card">
                  <div className="card-header">
                    <p className="card-header-title">
                      Overmount Bowl
                    </p>
                  </div>
                  <div className="card-image">
                    <figure className="image">
                      <PreviewCompatibleImage 
                        imageInfo={{
                          image: Overmount,
                          alt: "overmount bowl",
                          style: {
                            maxWidth: "275px",
                            marginLeft: "auto",
                            marginRight: "auto"
                          }
                        }} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      <div className="select">
                        <select name="overmountQty" onChange={this.props.onChange} value={this.props.overmountQty} >
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="column is-narrow">
                <div className="card">
                  <div className="card-header">
                    <p className="card-header-title">
                      Undermount Bowl
                    </p>
                  </div>
                  <div className="card-image">
                    <figure className="image">
                      <PreviewCompatibleImage 
                        imageInfo={{
                          image: Undermount,
                          alt: "undermount bowl",
                          style: {
                            maxWidth: "275px",
                            marginLeft: "auto",
                            marginRight: "auto"
                          }
                        }} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      <div className="select">
                        <select name="undermountQty" onChange={this.props.onChange} value={this.props.undermountQty}>
                          <option value={0}>0</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            <div className="column"></div>
        </div>   
        </section>
      </div>
    )
  }
}

Options.propTypes = {
  overmountQty: PropTypes.number,
  undermountQty: PropTypes.number
}

export default Options