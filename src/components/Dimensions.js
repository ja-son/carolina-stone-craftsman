import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery, useStaticQuery } from 'gatsby'
import ShapeTypes from './ShapeTypes'
import Shapes from './Shapes'
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
          </div>
        </section>
        <div className="columns is-centered is-mobile is-multiline">
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
          <div className="column">
          {currentShape &&
           currentShape.params.map((dimension) => (
            <div className="buttons has-addons" key={`${dimension.label}-length`}>
                      <button className="button is-static">{dimension.label}</button>
                      { !dimension.isEditable
                        ? <input 
                            id={`${dimension.label}-length`} 
                            name={`${dimension.label}-length`} 
                            value={dimension.value ? dimension.value : ''}
                            className="input is-small" 
                            type="number" 
                            style={{ maxWidth: "70px" }}
                            disabled />
                        : <input 
                            id={`${dimension.label}-length`} 
                            name={`${dimension.label}-length`} 
                            value={dimension.value ? dimension.value : ''}
                            className="input is-small" 
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
                          {/* {dimension.edgeType == 1
                            ? <option value="1" selected>Wall</option>
                            : <option value="1">Wall</option>
                          }
                          {dimension.edgeType == 2
                            ? <option value="2" selected>Applicance</option>
                            : <option value="2">Applicance</option>
                          }
                          {dimension.edgeType == 3
                            ? <option value="3" selected>Edge</option>
                            : <option value="3">Edge</option>
                          }
                          {dimension.edgeType == 4
                            ? <option value="4" selected>Backsplash</option>
                            : <option value="4">Backsplash</option>
                          } */}
                        </select>
                      </div>
                      {/* { dimension.edgeType == 1
                      ? <button 
                          id={`${dimension.label}-wall`} 
                          name={`${dimension.label}-wall`} 
                          value={1} 
                          className="button is-link is-small" 
                          onClick={this.props.onClick}
                          tabIndex={20}>wall</button>
                      : <button 
                          id={`${dimension.label}-wall`} 
                          name={`${dimension.label}-wall`} 
                          value={1}
                          className="button is-small" 
                          onClick={this.props.onClick}
                          tabIndex={20}>wall</button>
                      }
                    { dimension.edgeType == 2
                      ? <button 
                          id={`${dimension.label}-app`} 
                          name={`${dimension.label}-app`} 
                          value={2}
                          className="button is-link is-small" 
                          onClick={this.props.onClick}
                          tabIndex={30}>appliance</button>
                      : <button 
                          id={`${dimension.label}-app`} 
                          name={`${dimension.label}-app`} 
                          value={2} 
                          className="button is-small" 
                          onClick={this.props.onClick}
                          tabIndex={30}>appliance</button>
                    }
                    { dimension.edgeType == 3
                      ? <button 
                          id={`${dimension.label}-edge`} 
                          name={`${dimension.label}-edge`} 
                          value={3}
                          className="button is-link is-small" 
                          onClick={this.props.onClick}
                          tabIndex={40}>edge</button>
                      : <button 
                          id={`${dimension.label}-edge`} 
                          name={`${dimension.label}-edge`} 
                          value={3} 
                          className="button is-small" 
                          onClick={this.props.onClick}
                          tabIndex={40}>edge</button>
                    }
                    { dimension.isBacksplash == true
                      ? <button 
                          id={`${dimension.label}-back`} 
                          name={`${dimension.label}-back`} 
                          value={4} 
                          className="button is-link is-small" 
                          onClick={this.props.onClick}
                          tabIndex={50}>backsplash</button>
                      : <button 
                          id={`${dimension.label}-back`} 
                          name={`${dimension.label}-back`} 
                          value={4} 
                          className="button is-small" 
                          onClick={this.props.onClick}
                          tabIndex={50}>backsplash</button>
                    } */}
                    <span 
                      id={`${dimension.label}-warn`} 
                      name={`${dimension.label}-warn`}
                      className="tag is-danger is-medium"
                      style={{
                        visibility: "hidden"
                      }}>Select side type</span>
                </div>
          ))}
          </div>
        </div>
      </div>
    )
  }
}