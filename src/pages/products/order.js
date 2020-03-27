import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import Layout from '../../components/Layout'
import Shapes from '../../components/Shapes'
import Dimensions from '../../components/Dimensions'
import Edges from '../../components/Edges'

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

    this.handleShapeChange = this.handleShapeChange.bind(this)
    this.handleLengthChange = this.handleLengthChange.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }

  handleShapeChange = event => {
    const {name, value} = event.target
    const data = this.props.data
    const { edges: shapes } = data.allMarkdownRemark
    
    shapes.map(({node: shape}) => {
      if(shape.id === value) {
        this.setState({
          dimensions: shape.frontmatter.shapeEdges
        })
      }
    })

    this.setState({
      [name]: value
    })

    document.getElementById('nextBtn').style.display = 'block';
  }

  handleLengthChange = event => {
    const {name, value} = event.target
    this.state.dimensions.map(dimension => {
      if(`${dimension.name}-length` === name) {
        dimension.length = parseInt(value)
      }
    })

    this.performEdgeValidation()
  }

  handleEdgeChange = event => {
    event.preventDefault()
    const { name, value } = event.target;
    const vals = name.split('-')
    const dimensionName = vals[0]
    const buttonType = vals[1]
    
    document.getElementById(name).classList.toggle('is-link')

    const isToggled = document.getElementById(name).classList.contains('is-link');
    
    this.state.dimensions.map(dimension => {
      if(dimension.name === dimensionName) {
        if(buttonType === 'back') {
          dimension.sideType = isToggled ? 'wall' : null;
          dimension.hasBacksplash = isToggled
        } else {
          dimension.sideType = isToggled ? value : null
        }
      }
    })

    if(buttonType == 'wall') {
      document.getElementById(`${dimensionName}-app`).classList.remove('is-link')
      document.getElementById(`${dimensionName}-edge`).classList.remove('is-link')
    } else if(buttonType == 'app') {
      document.getElementById(`${dimensionName}-wall`).classList.remove('is-link')
      document.getElementById(`${dimensionName}-edge`).classList.remove('is-link')
      document.getElementById(`${dimensionName}-back`).classList.remove('is-link')
    } else if(buttonType == 'edge') {
      document.getElementById(`${dimensionName}-wall`).classList.remove('is-link')
      document.getElementById(`${dimensionName}-app`).classList.remove('is-link')
      document.getElementById(`${dimensionName}-back`).classList.remove('is-link')
    } else if(buttonType == 'back') {
      document.getElementById(`${dimensionName}-edge`).classList.remove('is-link')
      document.getElementById(`${dimensionName}-app`).classList.remove('is-link')
      document.getElementById(`${dimensionName}-wall`).classList.add('is-link')
    }

    this.performEdgeValidation()
  }

  performEdgeValidation() {
    let isValid = this.state.currentStep == 2
    if (!isValid) return false

    this.state.dimensions.forEach(element => {
      if(element.sideType == null) {
        isValid = false
        document.getElementById(`${element.name}-warn`).style = "visibility: visible"
      } else {
        document.getElementById(`${element.name}-warn`).style = "visibility: hidden"
      }

      if( (element.length == null || element.length < 1) && element.enabled == null) {
        isValid = false
        document.getElementById(`${element.name}-length`).classList.add('is-danger')
      } else {
        document.getElementById(`${element.name}-length`).classList.remove('is-danger')
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
      this.setState({
        currentStep: this.state.currentStep + 1
      })
    }
  }

  handleBack = event => {
    if(this.state.currentStep !== 1) {
      this.setState({
        currentStep: this.state.currentStep - 1
      })
    }
  }

  render() {
    const { data } = this.props
    return (
      <Layout>
        <Shapes 
          data={data.allMarkdownRemark} 
          currentStep={this.state.currentStep}
          currentShape={this.state.shape}
          handleChange={this.handleShapeChange} />

        <Dimensions 
          data={this.state.dimensions} 
          currentStep={this.state.currentStep}
          handleChange={this.handleLengthChange}
          onClick={this.handleEdgeChange} />

        <Edges
          data={this.state.dimensions} 
          currentStep={this.state.currentStep}
          />

        <a id="backBtn" 
          className="button is-large" 
          style={{
            display: "none"
          }}
          onClick={this.handleBack}>Back</a>
        <a id="nextBtn" 
          className="button is-large is-success" 
          style={{
            display: "none"
          }}
          onClick={this.handleNext}>Next</a>
      </Layout>
    )
  }
}

export default () => (
  <StaticQuery
    query={graphql`
    query OrderPageQuery {
      allMarkdownRemark(filter: {frontmatter: {productKey: {eq: "shape"}}}) {
        edges {
          node {
            frontmatter {
              title
              image {
                childImageSharp {
                  fluid(maxWidth: 120, quality: 100) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
              shapeEdges {
                name
                enabled
              }
            }
            id
          }
        }
      }
    }
    `}
    render={(data, count) => <OrderPage data={data} count={count} />}
  />
)