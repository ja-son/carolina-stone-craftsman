import React from 'react'
import PropTypes from 'prop-types'
import Ridges from './Ridges'
import DrawEdge from './DrawEdge'

class Edges extends React.Component {
  render() {
    if(this.props.currentStep !== 4) {
      return null
    }

    let currentEdge = this.props.currentEdge

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Select an edge type</h1>
            <h2 className="subtitle">We have many edge types to provide the look and feel you want for your project</h2>
          </div>
        </section>
        <section className="section">
          <div className="columns">
            <div className="column"></div>
            <div className="column is-7">
          <div className="columns is-multiline is-vecentered is-centered">
            {/* <div className="column"></div> */}
            {Ridges.popular.map(edge => (
              <div className="column" key={edge.name}>
                <div className={currentEdge === edge.name ? "card selected" : "card"} style={{
                  maxHeight: "200px",
                  minWidth: "150px"
                }}>
                  <div className="card-image">
                    <figure className="image" style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      width: "50%"
                    }}>
                      <label className="radioImage">
                        <input type="radio" name="currentEdge" value={edge.name} onChange={this.props.onChange} checked={currentEdge === edge.name} />
                        <DrawEdge name={edge.name} id={edge.name} />
                      </label>
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      {edge.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="column"></div>
          </div>
            </div>
            <div className="column"></div>
          </div>
        </section>
      </div>
    )
  }
}

Edges.propTypes = {
  currentStep: PropTypes.number,
  currentEdge: PropTypes.string,
}

export default Edges