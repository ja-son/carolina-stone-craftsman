import React from 'react'
import PropTypes from 'prop-types'

class SinkPlacement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sinkCenter1: '',
      sinkCenter2: '',
      sinkDistance1: 0,
      sinkDistance2: 0
    }
    this.sinkCenterLeft1 = React.createRef()
    this.sinkCenterLeft2 = React.createRef()
    this.sinkCenterRight1 = React.createRef()
    this.sinkCenterRight2 = React.createRef()

    this.state.sinkCenter1 = this.props.items && this.props.items.length > 0 ? this.props.items[0].from : ''
    this.state.sinkDistance1 = this.props.items && this.props.items.length > 0 ? this.props.items[0].distance : 0
    this.state.sinkCenter2 = this.props.items && this.props.items.length > 1 ? this.props.items[1].from : ''
    this.state.sinkDistance2 = this.props.items && this.props.items.length > 1 ? this.props.items[1].distance : 0
    
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  notifyController() {
    if(this.props.quantity === "1" &&
        this.state.sinkCenter1 !== '' &&
        this.state.sinkDistance1 > 0) {
        
        this.props.onChange({
          quantity: 1,
          items: [
            { 
              distance: this.state.sinkDistance1,
              from: this.state.sinkCenter1
            }
          ]
        })
    } else if(this.props.quantity === "2" &&
      this.state.sinkCenter1 !== '' &&
      this.state.sinkCenter2 !== '' &&
      this.state.sinkDistance1 > 0 &&
      this.state.sinkDistance2 > 0) {
        
        this.props.onChange({
          quantity: 2,
          items: [
            { 
              distance: this.state.sinkDistance1,
              from: this.state.sinkCenter1
            },
            {
              distance: this.state.sinkDistance2,
              from: this.state.sinkCenter2
            }
          ]
        })
    }
  }

  handleUpdate = ev => {
    const {name, value} = ev.target
    if(name === 'sinkCenter2') {
      if(value === "Left") {
        this.sinkCenterRight1.current.checked = true
        this.setState({
          sinkCenter2: 'Left',
          sinkCenter1: 'Right'
        })
      } else {
        this.sinkCenterLeft1.current.checked = true
        this.setState({
          sinkCenter2: 'Right',
          sinkCenter1: 'Left'
        })
      }
    } else if (name === 'sinkCenter1'){
      if(value === "Left") {
        this.sinkCenterRight2.current.checked = true
        this.setState({
          sinkCenter1: 'Left',
          sinkCenter2: 'Right'
        })
      } else {
        this.sinkCenterLeft2.current.checked = true
        this.setState({
          sinkCenter1: 'Right',
          sinkCenter2: 'Left'
        })
      }
    } else if (name === 'sinkDistance1') {
      this.state.sinkDistance1 = value
      this.setState({
        sinkDistance1: value
      })
    } else if (name === 'sinkDistance2') {
      this.state.sinkDistance2 = value
      this.setState({
        sinkDistance2: value
      })
    }
    this.notifyController()
  }

  render() {
    if(this.props.currentStep !== 4) {
      return null
    }

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">{this.props.quantity === "1" ? "Sink" : "Sinks"} Placement</h1>
            <h2 className="subtitle">Tell us where your {this.props.quantity === "1" ? "sink center is" : "sinks centers are"} located</h2>
          </div>
        </section>
        <section className="section">
          <progress className="progress is-large" value="49" max="100">49%</progress>
          <div className="columns is-multiline">
            {/* sink one */}
            <div className="column is-one-fifth">
              <label className="label is-large">Sink One</label>
              <div className="field">
                <label className="label">Sink center from</label>
                <div className="control">
                  <label className="radio">
                    <input type="radio" ref={this.sinkCenterLeft1} name="sinkCenter1" value="Left" onClick={this.handleUpdate} 
                      checked={this.state.sinkCenter1 === "Left"}/> Left wall
                  </label>
                  <label className="radio">
                    <input type="radio" ref={this.sinkCenterRight1} name="sinkCenter1" value="Right" onClick={this.handleUpdate}
                      checked={this.state.sinkCenter1 === "Right"}/> Right wall
                  </label>
                </div>
              </div>
              <div className="field">
                <label className="label">Distance from wall</label>
                <div className="control">
                  <input className="input" name="sinkDistance1" type="number" step="any" placeholder="[inches]" onChange={this.handleUpdate} style={{
                      maxWidth: "120px"
                    }}
                    value={this.state.sinkDistance1}/>               
                </div>
              </div>
            </div>
            {/* sink 2 */}
            <div className="column is-one-fifth" style={{
              visibility: this.props.quantity === "1" ? "hidden" : "visible",
              display: this.props.quantity === "1" ? "hidden" : "block"

            }}>
              <div className="label is-large">Sink Two</div>
              <div className="field">
                <label className="label">Sink center from</label>
                <div className="control">
                  <label className="radio">
                    <input type="radio" ref={this.sinkCenterLeft2} name="sinkCenter2" value="Left" onClick={this.handleUpdate}
                      checked={this.state.sinkCenter2 === "Left"}/> Left wall
                  </label>
                  <label className="radio">
                    <input type="radio" ref={this.sinkCenterRight2} name="sinkCenter2" value="Right" onClick={this.handleUpdate}
                      checked={this.state.sinkCenter2 === "Right"}/> Right wall
                  </label>
                </div>
              </div>
              <div className="field">
                <label className="label">Distance from wall</label>
                <div className="control">
                  <input className="input" name="sinkDistance2" type="number" step="any" placeholder="[inches]" onChange={this.handleUpdate} style={{
                      maxWidth: "120px"
                    }}
                    value={this.state.sinkDistance2}/>               
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

SinkPlacement.propTypes = {
  onChange: PropTypes.func,
  currentStep: PropTypes.number,
  quantity: PropTypes.number,
  items: PropTypes.array
}

export default SinkPlacement