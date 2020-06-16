import React from 'react'
import PropTypes from 'prop-types'
import PreviewCompatibleImage from './PreviewCompatibleImage'
import {  graphql, StaticQuery } from 'gatsby'
import SinkTypes from '../../content/sink-types.json'

class Options extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }
  render() {
    if(this.props.currentStep !== 3) {
      return null
    }

    const { allFile: nodes } = this.props.data
    const images = nodes.nodes
    let currentOption = this.props.currentOption
    let quantity = this.props.quantity

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Optional</h1>
            <h2 className="subtitle">Select the number and type of sink cutouts needed</h2>
          </div>
        </section>
        <section className="section">
        <progress className="progress is-large" value="43" max="100">43%</progress>
        <div className="columns is-multiline">

              
                {images &&
                  images.map(image => (
                    SinkTypes.items.map( (type, index) => (
                      type.imageName === image.name ?
                        <div className="column is-4" key={image.name}>
                          <label className="radioImage">
                            <input type="radio" name="currentOption" value={image.name} onChange={this.props.onChange} checked={currentOption === image.name} />
                            <PreviewCompatibleImage
                              imageInfo={{
                                alt: image.name,
                                image: image,
                                style: {
                                  maxWidth: "300px",
                                  maxHeight: "225px"
                                }
                              }} /> 
                              <div className="select" style={{ visibility: currentOption === image.name ? "visible" : "hidden" }}>
                                <select name="quantity" onChange={this.props.onChange}>
                                  <option value={0} selected={currentOption === image.name && quantity === "0"}>Select quantity</option>
                                  <option value={1} selected={currentOption === image.name && quantity === "1"}>1</option>
                                  <option value={2} selected={currentOption === image.name && quantity === "2"}>2</option>
                                </select>
                              </div>
                          </label>
                        </div>
                        : ""
                    ))
                  ))}
                  <div className="column is-4">
                    <label className="radioImage">
                      <input type="radio" name="currentOption" value="byo" onChange={this.props.onChange} checked={currentOption === "byo"} />
                      <div className="has-text-centered" style={{
                        padding: "30px"
                      }}>
                        <span className="icon is-large">
                          <i className="fas fa-3x fa-user-alt"></i>
                        </span>
                        <h4>Bring Your Own</h4>
                      </div>
                    </label>
                  </div>
                  <div className="column is-4">
                    <label className="radioImage">
                      <input type="radio" name="currentOption" value="none" onChange={this.props.onChange} checked={currentOption === "none"} />
                      <div className="has-text-centered" style={{
                        padding: "30px"
                      }}>
                        <span className="icon is-large">
                          <i className="fas fa-3x fa-ban"></i>
                        </span>
                        <h4>None</h4>
                      </div>
                    </label>
                  </div>
        </div>   
        </section>
      </div>
    )
  }
}

Options.propTypes = {
  onChange: PropTypes.func,
  quantity: PropTypes.number
}

export default (props) => (
  <StaticQuery
    query={graphql`
    {
      allFile(
        filter: {sourceInstanceName: {eq: "images"}, relativePath: {regex: "/sinks/"}}
        sort: { fields: [name], order: DESC }
      ) {
        nodes {
          childImageSharp {
            fluid(maxWidth: 400, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
          name
        }
      }
    }
  `}
  render={(data, count) => <Options data={data} count={count} currentStep={props.currentStep} currentOption={props.currentOption} quantity={props.quantity} onChange={props.onChange} />}
  />
)