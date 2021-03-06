import React from 'react'
import PropTypes from 'prop-types'
import DrawShape from './DrawShape'

export default class Dimensions extends React.Component {
  render() {
    if(this.props.currentStep !== 2) {
      return null
    }

    let { currentShape, currentShapeType } = this.props
    let maxLength = currentShapeType.maxSideLength
    if(currentShape != null && currentShape.rawDef != null) {
      currentShapeType = currentShape
      maxLength = currentShape.rawDef.maxSideLength
    }

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Enter dimension and select side type</h1>
            <h2 className="subtitle">Be sure to watch our video on how to correctly measure your counter top or vanity</h2>
          </div>
        </section>
        <section className="section">
        <progress className="progress is-large" value="29" max="100">29%</progress>
          <div className="columns ">
            {/* <div className="column"></div> */}
            <div className="column is-4">
              <div className="notification is-info is-light">
                  <strong>How to measure your counter top</strong>
                  <figure className="image is-16by9">
                  <iframe className="has-ratio" src="https://www.youtube.com/embed/kqdV5f9aUH8" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </figure>
                  <p>
                    Watch this video to learn exactly how to measure the dimensions of your
                    next kitchen counter or bathroom vanity. We recommend taking measurements
                    more than once to ensure your dimensions are accurate.
                  </p>
                </div>
            </div>
            <div className="column">
              <DrawShape 
                rawDef={currentShapeType}
                handleChange={this.props.handleShapeGeneration} 
                withGuides={true} 
                width={325} 
                height={325}
                margin={20}
                style={{
                  margin: "auto",
                  display: "block"
                }} />
            </div>
            <div className="column is-4">
            {currentShape &&
            currentShape.params.map((dimension, idx) => (
              <div className="field has-addons" key={`${dimension.label}-length`}>
                  <div className="control">
                        <button className="button is-static">{dimension.label}</button>
                  </div>
                  <div className="control">
                        { !dimension.isEditable
                          ? <input 
                              id={`${dimension.label}-length`} 
                              name={`${dimension.label}-length`} 
                              value={dimension.value ? dimension.value : ''}
                              className="input" 
                              type="number" 
                              disabled />
                          : <input 
                              id={`${dimension.label}-length`} 
                              name={`${dimension.label}-length`} 
                              value={dimension.value ? dimension.value > maxLength ? '' : dimension.value : ''}
                              className="input" 
                              type="number" 
                              step="any"
                              min={0}
                              placeholder="[inches]" 
                              onChange={this.props.handleChange}
                              tabIndex={10+idx} />
                        }
                  </div>
                  <div className="control">
                        <div 
                          className="select"
                          id={`${dimension.label}-sideTypeDiv`}>
                          <select 
                            id={`${dimension.label}-sideType`} 
                            name={`${dimension.label}-sideType`} 
                            onChange={this.props.onClick}
                            tabIndex={10+idx}
                            value={dimension.edgeType ? dimension.edgeType : ''}>
                            <option value="">Select side</option>
                            <option value="1">Wall</option>
                            <option value="2">Appliance</option>
                            <option value="3">Polished Edge</option>
                            <option value="4">Backsplash</option>
                          </select>
                        </div>
                      <article 
                        id={`${dimension.label}-warn`} 
                        name={`${dimension.label}-warn`}
                        className="message is-warning is-medium"
                        style={{
                          visibility: "hidden",
                          display: "none"
                        }}>
                          <div className="message-body">
                          Select side type
                          </div>
                        </article>
                  </div>
                </div>
            ))}
            </div>
            <div className="column"></div>
          </div>
        </section>
      </div>
    )
  }
}