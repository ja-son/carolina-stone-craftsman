import React from 'react'
import { Link } from 'gatsby'
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import Layout from '../../components/Layout'
import Shapes from '../../components/Shapes'
import Dimensions from '../../components/Dimensions'
import Options from '../../components/Options'
import SinkPlacement from '../../components/SinkPlacement'
import Edges from '../../components/Edges'
import ShapeTypes from '../../components/ShapeTypes'
import Stones from '../../components/Stones'
import Checkout from '../../components/Checkout'
import InjectedOrderReview from '../../components/OrderReview'
import api from '../../components/api'

const stripePromise = api.getPublicStripeKey().then(key => loadStripe(key))

export default class OrderPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStep: 1,
      shape: '',
      options: [],
      quantity: "0",
      sinkOffsets: [],
      currentEdge: '',
      currentStone: '',
      deliveryOption: '',
      canDeliver: false
    }

    this.backBtn = React.createRef()
    this.nextBtn = React.createRef()
    this.consultBtn = React.createRef()
    this.checkOutBtn = React.createRef()
    this.handleShapeChange = this.handleShapeChange.bind(this)
    this.handleLengthChange = this.handleLengthChange.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleShapeGeneration = this.handleShapeGeneration.bind(this)
    this.handleSideTypeChange = this.handleSideTypeChange.bind(this)
    this.handleOptionsChange = this.handleOptionsChange.bind(this)
    this.handleStoneChange = this.handleStoneChange.bind(this)
    this.handleCheckOutClick = this.handleCheckOutClick.bind(this)
    this.handleSuccess = this.handleSuccess.bind(this)
    this.handleDelivery = this.handleDelivery.bind(this)
    this.handleSinkPlacement = this.handleSinkPlacement.bind(this)
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
    let shapeType = {}

    ShapeTypes.shapeTypes.map( (type) => {
      if(type.apiId === value) {
        shapeType = type
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

    if(shapeType.canOrderOnline) {
      this.consultBtn.current.style.display = 'none'
      this.nextBtn.current.style.display =  'block'
      this.nextBtn.current.scrollIntoView({behavior: "smooth"})
    } else {
      this.consultBtn.current.style.display = 'block'
      this.consultBtn.current.scrollIntoView({behavior: "smooth"})
      this.nextBtn.current.style.display =  'none'
    }
  }

  handleLengthChange = event => {
    const {name, value} = event.target
    
    const vals = name.split('-')
    const dimensionName = vals[0]
    const index = this.state.currentShapeType.params.indexOf(dimensionName)
    this.state.currentShape.params[index].value = parseFloat(value);
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
          dimension.isBacksplash = parseInt(value) === 4
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
    if(value === "byo") {
      this.consultBtn.current.style.display = 'block'
      this.nextBtn.current.style.display =  'none'
      this.consultBtn.current.scrollIntoView({behavior: "smooth"})
    } else {
      this.consultBtn.current.style.display = 'none'
      if( (name === "currentOption" && value === "none") ||
        (name === "quantity" && value > 0 ) ) {
          this.nextBtn.current.style.display =  'block'
      } else {
        this.nextBtn.current.style.display =  'none'
      }

      if(name === "currentOption" && this.state.currentOption !== value) {
        this.setState({
          quantity: "0"
        })
      }
      //this.nextBtn.current.scrollIntoView({behavior: "smooth"})
    }
    this.setState({
      [name]: value
    })
  }

  handleEdgeTypeChange = event => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })

    this.nextBtn.current.style.display =  'block'
    this.nextBtn.current.scrollIntoView({behavior: "smooth"})
  }

  handleStoneChange = event => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
    this.nextBtn.current.style.display =  'block'
    this.nextBtn.current.scrollIntoView({behavior: "smooth"})
  }

  performEdgeValidation() {
    let isValid = this.state.currentStep == 2
    if (!isValid) return false

      try {
        this.state.currentShape.params.forEach(element => {
          if(element.isValidEdge) {
            document.getElementById(`${element.label}-sideTypeDiv`).classList.remove('is-danger')
          } else {
            isValid = false
            document.getElementById(`${element.label}-sideTypeDiv`).classList.add('is-danger')
          }
  
          if(element.isValidValue) {
            document.getElementById(`${element.label}-length`).classList.remove('is-danger')
            if(element.isValidEdge) {
              document.getElementById(`${element.label}-warn`).style = "visibility: hidden; display: none"
            }
            document.getElementById(`${element.label}-warn`).firstChild.innerHTML = "Select side type"
            this.consultBtn.current.style.display = 'none'
            this.nextBtn.current.style.display =  'block'
          } else {
            isValid = false
            document.getElementById(`${element.label}-warn`).firstChild.innerHTML = element.errorStr
            document.getElementById(`${element.label}-warn`).style = "visibility: visible; display: block"
            document.getElementById(`${element.label}-length`).classList.add('is-danger')
            this.consultBtn.current.style.display = 'block'
            this.nextBtn.current.style.display =  'none'
            throw element.errorStr
          }
        });  
      } catch (error) {
        console.log(error)
      }
    return isValid
  }

  handleValidation() {
    if(this.state.currentStep === 2) {
      return this.performEdgeValidation()
    } else {
      return true
    }
  }

  handleNext = event => {
    let increment = 1;
    if(this.handleValidation()) {
      this.backBtn.current.style.display = 'block'
      if(this.state.currentStep === 3 &&
        this.state.currentOption === "none") {
          increment++;
      }
      this.setState({
        currentStep: this.state.currentStep + increment
      })
    }

    if(this.state.currentStep + 1 >= 3 &&
      (this.state.currentEdge === "" ||
        this.state.currentStone === "" ||
        this.state.canDeliver === false)) {
      this.nextBtn.current.style.display = 'none'
    }

    if(this.state.currentStep + 1 === 8) {
      this.nextBtn.current.style.display = 'none'
      this.checkOutBtn.current.style.display = 'block'
    }
    window.scrollTo(0,0)
  }

  handleBack = event => {
    this.checkOutBtn.current.style.display = 'none'
    let increment = 1;

    if(this.state.currentStep !== 1) {
      if(this.state.currentStep === 5 &&
        this.state.currentOption === "none") {
          increment++;
      }
      this.setState({
        currentStep: this.state.currentStep - increment
      })
    } 
    if(this.state.currentStep - 1 <= 1) {
      this.backBtn.current.style.display = 'none'
    }

    this.nextBtn.current.style.display = 'block'
    this.consultBtn.current.style.display = "none"
    window.scrollTo(0,0)
  }

  handleCheckOutClick = event => {
    let el = document.getElementById("checkOutModal")
    if(el) {
      el.classList.add('is-active')
    }
  }

  handleSuccess = event => {
    try {
    this.checkOutBtn.current.style = "display: none"
    this.backBtn.current.style = "display: none"
    } catch (e) {}
  }

  handleDelivery = event => {
    this.setState({
      deliveryOption: event.deliveryOption,
      canDeliver: event.canDeliver
    })
    if(event.canDeliver) {
      this.nextBtn.current.style.display = 'block'
      this.consultBtn.current.style.display = 'none'
    } else if (event.deliveryOption === 'installed') {
      this.nextBtn.current.style.display = 'none'
      this.consultBtn.current.style.display = 'block'
    } else {
      this.nextBtn.current.style.display = 'none'
      this.consultBtn.current.style.display = 'none'
    }
  }

  handleSinkPlacement = event => {
    console.log(event)
    this.nextBtn.current.style.display = 'block'
    this.setState({
      sinkOffsets: event.items
    })
  }

  render() {
    const { currentShape } = this.state

    return (
      <Layout>
        <Shapes 
          currentStep={this.state.currentStep}
          currentShape={this.state.shape}
          handleChange={this.handleShapeChange} />

        <Dimensions 
          currentShape={currentShape}
          currentShapeType={this.state.currentShapeType}
          currentStep={this.state.currentStep}
          handleChange={this.handleLengthChange}
          handleShapeGeneration={this.handleShapeGeneration}
          onClick={this.handleSideTypeChange} />

        <Options
          currentStep={this.state.currentStep}
          currentOption={this.state.currentOption}
          quantity={this.state.quantity}
          onChange={this.handleOptionsChange}
          />
        
        <SinkPlacement
          currentStep={this.state.currentStep}
          quantity={this.state.quantity}
          items={this.state.sinkOffsets}
          onChange={this.handleSinkPlacement}
          />

        <Edges
          currentStep={this.state.currentStep}
          currentEdge={this.state.currentEdge}
          onChange={this.handleEdgeTypeChange}
          />

        <Stones
          currentStep={this.state.currentStep}
          currentStone={this.state.currentStone}
          onChange={this.handleStoneChange}
          />

        <Checkout
          currentStep={this.state.currentStep}
          onChange={this.handleDelivery}
          />

        <Elements stripe={stripePromise}>
          <InjectedOrderReview
            currentStep={this.state.currentStep}
            shape={this.state.currentShape}
            edge={this.state.currentEdge}
            stone={this.state.currentStone}
            options={this.state.currentOption}
            sinkOffsets={this.state.sinkOffsets}
            quantity={this.state.quantity}
            deliveryOption={this.state.deliveryOption}
            onSuccess={this.handleSuccess}
            />
        </Elements>

        <section className="section">
          <div className="columns">
            <div className="column"></div>
            <div className="column">
            <a id="backBtn" ref={this.backBtn}
              className="button is-large" 
              style={{
                display: "none",
                maxWidth: "331px"
              }}
              onClick={this.handleBack}>Back</a>
            </div>
            <div className="column">
            <a id="nextBtn" ref={this.nextBtn}
              className="button is-large is-success" 
              style={{
                display: "none",
                maxWidth: "331px"
              }}
              onClick={this.handleNext}>Next</a>
            <a id="checkOutBtn" ref={this.checkOutBtn}
              className="button is-large is-success" 
              style={{
                display: "none",
                maxWidth: "331px"
              }}
              onClick={this.handleCheckOutClick}>Checkout</a>
            <Link className="button is-large is-success"
              ref={this.consultBtn}
              to="/contact">Schedule Consultation</Link>
            </div>
            <div className="column"></div>
          </div>
        </section>
       
      </Layout>
    )
  }
}