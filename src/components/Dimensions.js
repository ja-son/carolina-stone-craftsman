import React from 'react'
import PropTypes from 'prop-types'
import DrawShape from './DrawShape'

export default class Dimensions extends React.Component {
  render() {
    if(this.props.currentStep !== 2) {
      return null
    }

    let { currentShape, currentShapeType } = this.props
    if(currentShape != null && currentShape.rawDef != null) {
      currentShapeType = currentShape
    }

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Enter dimension and select side type</h1>
            <h2 className="subtitle">Be sure to watch your video on how to correctly measure your counter top</h2>
          </div>
        </section>
        <section className="section">
          <div className="columns ">
            {/* <div className="column"></div> */}
            <div className="column is-4">
              <div className="notification is-info is-light">
                  <strong>How to measure your counter top</strong>
                  <figure className="image is-16by9">
                  <iframe className="has-ratio" src="https://www.youtube.com/embed/8sLQpMKJoQ8" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </figure>
                  <p>
                    Primar lorem ipsum dolor sit amet, consectetur
                    adipiscing elit lorem ipsum dolor. Pellentesque risus mi, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Sit amet,
                    consectetur adipiscing elit
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
                style={{
                  margin: "auto",
                  display: "block"
                }} />
            </div>
            <div className="column is-4">
            {currentShape &&
            currentShape.params.map((dimension) => (
              <div className="buttons has-addons" key={`${dimension.label}-length`}>
                <div className="columns is-mobile">
                  <div className="column"></div>
                  <div className="column is-10">
                        <button className="button is-static">{dimension.label}</button>
                        { !dimension.isEditable
                          ? <input 
                              id={`${dimension.label}-length`} 
                              name={`${dimension.label}-length`} 
                              value={dimension.value ? dimension.value : ''}
                              className="input" 
                              type="number" 
                              style={{ maxWidth: "70px" }}
                              disabled />
                          : <input 
                              id={`${dimension.label}-length`} 
                              name={`${dimension.label}-length`} 
                              value={dimension.value ? dimension.value : ''}
                              className="input" 
                              type="number" 
                              min={0}
                              placeholder="[inches]" 
                              style={{ maxWidth: "70px" }} 
                              onChange={this.props.handleChange}
                              tabIndex={10} />
                        }
                        <div 
                          className="select"
                          id={`${dimension.label}-sideTypeDiv`}>
                          <select 
                            id={`${dimension.label}-sideType`} 
                            name={`${dimension.label}-sideType`} 
                            onChange={this.props.onClick}
                            value={dimension.edgeType ? dimension.edgeType : ''}>
                            <option value="">Select side</option>
                            <option value="1">Wall</option>
                            <option value="2">Appliance</option>
                            <option value="3">Edge</option>
                            <option value="4">Backsplash</option>
                          </select>
                        </div>
                      <span 
                        id={`${dimension.label}-warn`} 
                        name={`${dimension.label}-warn`}
                        className="tag is-danger is-medium"
                        style={{
                          visibility: "hidden"
                        }}>Select side type</span>
                  </div>
                  <div className="column"></div>
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