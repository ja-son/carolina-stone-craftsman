import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import Layout from '../../components/Layout'
import Shapes from '../../components/Shapes'
import Dimensions from '../../components/Dimensions'
import Options from '../../components/Options'
import Edges from '../../components/Edges'
import ShapeTypes from '../../components/ShapeTypes'

class OrderPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStep: 1,
      shape: '',
      dimensions: [],
      options: [],
      edge: '',
      stone: ''
    }

    this.backBtn = React.createRef()
    this.nextBtn = React.createRef()
    this.handleShapeChange = this.handleShapeChange.bind(this)
    this.handleLengthChange = this.handleLengthChange.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleShapeGeneration = this.handleShapeGeneration.bind(this)
    this.handleSideTypeChange = this.handleSideTypeChange.bind(this)
    this.handleOptionsChange = this.handleOptionsChange.bind(this)
  }

  handleShapeGeneration = event => {
    if(this.state.currentShape == null ||
        (this.state.currentShape.rawDef != null &&
          event != null && event.rawDef != null &&
          this.state.currentShape.rawDef.apiId !== event.rawDef.apiId)) {
          this.setState({
            currentShape: event
          })
      }
  }

  handleShapeChange = event => {
    const {name, value} = event.target
    ShapeTypes.shapeTypes.map( (type) => {
      if(type.apiId === value) {
        this.setState({
          currentShapeType: type,
          currentShape: null,
          options: [],
          edge: null
        })
      }
    });

    this.setState({
      [name]: value
    })

    this.nextBtn.current.style.display =  'block'
  }

  handleLengthChange = event => {
    const {name, value} = event.target
    
    const vals = name.split('-')
    const dimensionName = vals[0]
    const index = this.state.currentShapeType.params.indexOf(dimensionName)
    this.state.currentShape.params[index].value = parseInt(value);
    this.setState({
      currentShape: this.state.currentShape
    })

    this.performEdgeValidation()
  }

  handleSideTypeChange = event => {
    event.preventDefault()
    const { name, value } = event.target;
    const vals = name.split('-')
    const dimensionName = vals[0]
    
    this.state.currentShape.params.map(dimension => {
      if(dimension.label === dimensionName) {
        if(value === '') {
          dimension.edgeType = null
        } else {
          dimension.edgeType = parseInt(value)
          dimension.isBacksplash = value === '4'
        }
      }
    })

    this.setState({
      currentShape: this.state.currentShape
    })

    this.performEdgeValidation()
  }

  handleOptionsChange = event => {
    const {name, value} = event.target
    let foundOption = false
    this.state.options.map(option => {
      if(option && option.name === name) {
        option.qty = parseInt(value)
        foundOption = true
      }
    })

    if (!foundOption) {
      this.state.options.push({
        name: name,
        qty: parseInt(value)
      })
    }

    this.setState({
      options: this.state.options
    })
  }

  handleEdgeTypeChange = event => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })

    this.nextBtn.current.style.display =  'block'
  }

  performEdgeValidation() {
    let isValid = this.state.currentStep == 2
    if (!isValid) return false

    this.state.currentShape.params.forEach(element => {
      try {
        if(element.isValidEdge) {
          document.getElementById(`${element.label}-sideTypeDiv`).classList.remove('is-danger')
        } else {
          isValid = false
          document.getElementById(`${element.label}-sideTypeDiv`).classList.add('is-danger')
        }
  
        if(element.isValidValue) {
          document.getElementById(`${element.label}-length`).classList.remove('is-danger')
          if(element.isValidEdge) {
            document.getElementById(`${element.label}-warn`).style = "visibility: hidden"
          }
          document.getElementById(`${element.label}-warn`).innerHTML = "Select side type"
        } else {
          isValid = false
          document.getElementById(`${element.label}-warn`).innerHTML = element.errorStr
          document.getElementById(`${element.label}-warn`).style = "visibility: visible"
          document.getElementById(`${element.label}-length`).classList.add('is-danger')
        }
      } catch (error) {
        console.log(error)
      }
    });  

    return isValid
  }

  handleValidation() {
    if(this.state.currentStep == 2) {
      return this.performEdgeValidation()
    } else {
      return true
    }
  }

  handleNext = event => {
    if(this.handleValidation()) {
      this.backBtn.current.style.display = 'block'
      this.setState({
        currentStep: this.state.currentStep + 1
      })
    }

    if(this.state.currentStep + 1 >= 4) {
      this.nextBtn.current.style.display = 'none'
    }
    window.scrollTo(0,0)
  }

  handleBack = event => {
    if(this.state.currentStep !== 1) {
      this.setState({
        currentStep: this.state.currentStep - 1
      })
    } 
    if(this.state.currentStep - 1 <= 1) {
      this.backBtn.current.style.display = 'none'
    }

    this.nextBtn.current.style.display = 'block'
    window.scrollTo(0,0)
  }

  render() {
    const { data } = this.props
    const { currentShape } = this.state

    return (
      <Layout>
        <Shapes 
          currentStep={this.state.currentStep}
          currentShape={this.state.shape}
          handleChange={this.handleShapeChange} />

        <Dimensions 
          data={this.state.dimensions} 
          currentShape={currentShape}
          currentShapeType={this.state.currentShapeType}
          currentStep={this.state.currentStep}
          handleChange={this.handleLengthChange}
          handleShapeGeneration={this.handleShapeGeneration}
          onClick={this.handleSideTypeChange} />

        <Options
          data={data.allFile} 
          currentStep={this.state.currentStep}
          currentOptions={this.state.options}
          onChange={this.handleOptionsChange}
          />

        <Edges
          currentStep={this.state.currentStep}
          currentEdge={this.state.currentEdge}
          onChange={this.handleEdgeTypeChange}
          />
        <section className="section">
          <div className="container">
            <a id="backBtn" ref={this.backBtn}
              className="button is-large" 
              style={{
                display: "none"
              }}
              onClick={this.handleBack}>Back</a>
            <a id="nextBtn" ref={this.nextBtn}
              className="button is-large is-success" 
              style={{
                display: "none"
              }}
              onClick={this.handleNext}>Next</a>
          </div>
        </section>
       
      </Layout>
    )
  }
}

export default () => (
  <StaticQuery
    query={graphql`
    query OrderPageQuery {
      allFile(filter: {name: {regex: "/bowl/"}}) {
        nodes {
          childImageSharp {
            fluid(maxWidth: 250, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
          name
        }
      }
    }
    `}
    render={(data, count) => <OrderPage data={data} count={count} />}
  />
)