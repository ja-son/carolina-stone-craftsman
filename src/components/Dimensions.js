import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery, useStaticQuery } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'

export default class Dimensions extends React.Component {
  componentDidMount() {
    document.getElementById('backBtn').style.display = 'block';
  }

  render() {
    if(this.props.currentStep !== 2) {
      return null
    }

    const { data } = this.props

    return (
      <div>
        <div>
          {data &&
          data.map((dimension) => (
            <div className="field is-horizontal" key={`${dimension.name}-length`}>
              <div className="field-label">
              </div>
              <div className="field-body">
                <div className="field is-expanded">
                  <div className="field has-addons">
                    <p className="control">
                      <a className="button is-static">{dimension.name}</a>
                    </p>
                    <p className="control">
                      { dimension.enabled === false
                        ? <input 
                            id={`${dimension.name}-length`} 
                            name={`${dimension.name}-length`} 
                            value={dimension.length}
                            className="input" 
                            type="number" 
                            disabled style={{ width: "100px" }} />
                        : <input 
                            id={`${dimension.name}-length`} 
                            name={`${dimension.name}-length`} 
                            value={dimension.length}
                            className="input" 
                            type="number" 
                            min={0}
                            placeholder="[inches]" 
                            style={{ width: "100px" }} 
                            onChange={this.props.handleChange} />
                      }
                    </p>
                    <p className="control">
                      { dimension.sideType == 'wall'
                      ? <button 
                          id={`${dimension.name}-wall`} 
                          name={`${dimension.name}-wall`} 
                          value="wall" 
                          className="button is-link" 
                          onClick={this.props.onClick}>wall</button>
                      : <button 
                          id={`${dimension.name}-wall`} 
                          name={`${dimension.name}-wall`} 
                          value="wall" 
                          className="button" 
                          onClick={this.props.onClick}>wall</button>
                      }
                    </p>
                    <p className="control">
                    { dimension.sideType == 'app'
                      ? <button 
                          id={`${dimension.name}-app`} 
                          name={`${dimension.name}-app`} 
                          value="appliance" 
                          className="button is-link" 
                          onClick={this.props.onClick}>appliance</button>
                      : <button 
                          id={`${dimension.name}-app`} 
                          name={`${dimension.name}-app`} 
                          value="appliance" 
                          className="button" 
                          onClick={this.props.onClick}>appliance</button>
                    }
                    </p>
                    <p className="control">
                    { dimension.sideType == 'edge'
                      ? <button 
                          id={`${dimension.name}-edge`} 
                          name={`${dimension.name}-edge`} 
                          value="edge" 
                          className="button is-link" 
                          onClick={this.props.onClick}>edge</button>
                      : <button 
                          id={`${dimension.name}-edge`} 
                          name={`${dimension.name}-edge`} 
                          value="edge" 
                          className="button" 
                          onClick={this.props.onClick}>edge</button>
                    }
                    </p>
                    <p className="control">
                    { dimension.hasBacksplash == true
                      ? <button 
                          id={`${dimension.name}-back`} 
                          name={`${dimension.name}-back`} 
                          value="backsplash" 
                          className="button is-link" 
                          onClick={this.props.onClick}>backsplash</button>
                      : <button 
                          id={`${dimension.name}-back`} 
                          name={`${dimension.name}-back`} 
                          value="backsplash" 
                          className="button" 
                          onClick={this.props.onClick}>backsplash</button>
                    }
                    </p>
                    <span 
                      id={`${dimension.name}-warn`} 
                      name={`${dimension.name}-warn`}
                      className="tag is-danger is-medium"
                      style={{
                        visibility: "hidden"
                      }}>Select side type</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}