import React from 'react'
import PropTypes from 'prop-types'
import DrawShape from './DrawShape'
import ShapeTypes from './ShapeTypes'

class Shapes extends React.Component {
  render() {
    if(this.props.currentStep !== 1) {
      return null
    }

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Choose a counter top shape</h1>
            <h2 className="subtitle">We have a variety of options to fit your needs</h2>
          </div>
        </section>
        <section className="section">
        <progress className="progress is-large" value="14" max="100">14%</progress>

          <div className="columns is-mobile is-centered">
            <div className="column is-half-desktop">
              <div className="columns is-multiline is-mobile">
                { ShapeTypes.shapeTypes.map( (shape) => (
                  <div className="column" key={shape.apiId}>
                    <div className={this.props.currentShape === shape.apiId ? "selected" : "none"}>
                      <label className="radioImage">
                        <input type="radio" name="shape" value={shape.apiId} onChange={this.props.handleChange} checked={this.props.currentShape === shape.apiId} />
                        <DrawShape id={shape.apiId} 
                          rawDef={shape} 
                          width={128} height={128} 
                          />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

Shapes.propTypes = {
  currentStep: PropTypes.number,
  currentShape: PropTypes.string
}

export default Shapes