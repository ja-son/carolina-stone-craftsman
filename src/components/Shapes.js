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
          <div className="columns">
            <div className="column"></div>
            <div className="column is-7">
              <div className="columns is-multiline">
                { ShapeTypes.shapeTypes.map( (shape) => (
                  <div className="column" key={shape.apiId}>
                    <div className={this.props.currentShape === shape.apiId ? "card selected" : "card"} style={{
                      maxHeight: "200px"
                    }}>
                      <div className="card-image">
                        <figure className="image" style={{
                           marginLeft: "auto",
                           marginRight: "auto",
                          width: "70%"
                        }}>
                          <label className="radioImage">
                            <input type="radio" name="shape" value={shape.apiId} onChange={this.props.handleChange} checked={this.props.currentShape === shape.apiId} />
                            <DrawShape id={shape.apiId} 
                              rawDef={shape} 
                              width={200} height={200} 
                              />
                          </label>
                        </figure>
                      </div>
                      <div className="card-content">
                        <div className="content">
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="column"></div>
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