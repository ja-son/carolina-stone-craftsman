import React from 'react'
import PropTypes from 'prop-types'
import PreviewCompatibleImage from './PreviewCompatibleImage'
import {  graphql, StaticQuery } from 'gatsby'
import StoneTypes from '../../content/stone-types.json'

class Stones extends React.Component {
  render() {
    if(this.props.currentStep !== 5) {
      return null
    }

    const { allFile: nodes } = this.props.data
    const images = nodes.nodes
    let currentStone = this.props.currentStone
    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Choose your stone</h1>
            <h2 className="subtitle">We have a variety of colors to choose from</h2>
          </div>
        </section>
        <section className="section">
        {/* <div className="columns"> */}
          {/* <div className="column"></div> */}
            {/* <div className="column is-7"> */}
              <div className="columns is-multiline">
                {/* <div className="column"></div> */}
                {images &&
                  images.map(image => (
                    StoneTypes.items.map( (type, index) => (
                      type.imageName === image.name ?
                        <div className="column is-4" key={image.name}>
                          {/* <div className="card">
                            <div className="card-image"> */}
                              <figure className="image" style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}>
                                <label className="radioImage">
                                  <input type="radio" name="currentStone" value={image.name} onChange={this.props.onChange} checked={currentStone === image.name} />
                                  <PreviewCompatibleImage
                                    imageInfo={{
                                      image: image,
                                      style: {
                                        maxWidth: "300px"
                                      }
                                    }} /> 
                                </label>
                              </figure>
                            {/* </div>
                            <div className="card-content">
                              <div className="content">
                              </div>
                            </div> 
                          </div>*/}
                        </div>
                        : ""
                    ))
                  ))}
                  <div className="column"></div>
              </div>
            {/* </div> */}
            {/* <div className="column"></div> */}
          {/* </div> */}
        </section>
      </div>
    )
  }
}

Stones.propTypes = {
  currentStep: PropTypes.number,
  currentStone: PropTypes.string,
  data: PropTypes.shape({
    allFile: PropTypes.shape({
      nodes: PropTypes.array
    })
  }),
}

export default (props) => (
  <StaticQuery
    query={graphql`
    {
      allFile(filter: {sourceInstanceName: {eq: "images"}, relativePath: {regex: "/stones/"}}) {
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
  render={(data, count) => <Stones data={data} count={count} currentStep={props.currentStep} currentStone={props.currentStone} onChange={props.onChange} />}
  />
)