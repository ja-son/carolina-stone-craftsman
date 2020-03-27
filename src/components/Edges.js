import React from 'react'
import PropTypes from 'prop-types'

class Edges extends React.Component {
  render() {
    if(this.props.currentStep !== 3) {
      return null
    }

    return (
      <div className="container">
        <h1>Edges</h1>
      </div>
    )
  }
}

Edges.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default Edges