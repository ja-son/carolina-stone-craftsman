import React from 'react'
import PropTypes from 'prop-types'
import PreviewCompatibleImage from './PreviewCompatibleImage'


class Shapes extends React.Component {
  componentDidMount() {
    let backBtnEl = document.getElementById('backBtn')
    if(backBtnEl !== null) {
      backBtnEl.style.display = 'none'
    }
  }
  render() {
    if(this.props.currentStep !== 1) {
      return null
    }

    const { data } = this.props
    const { edges: shapes } = data
    return (
      <div className="columns">
        {shapes &&
        shapes.map(({node: shape}) => (
          <div key={shape.id} className="column">
            <label className="radioImage">
              { this.props.currentShape == shape.id
                ? <input type="radio" name="shape" value={shape.id} onChange={this.props.handleChange} checked />
                : <input type="radio" name="shape" value={shape.id} onChange={this.props.handleChange} />
              }
              <PreviewCompatibleImage
                imageInfo={{
                  image: shape.frontmatter.image,
                  alt: shape.frontmatter.title,
                  style: {
                    maxWidth: '200px'
                  }
                }}
              />
            </label>
          </div>
        ))}
        <div className="column is-10"></div>
      </div>
    )
  }
}

Shapes.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
  currentStep: PropTypes.number,
  currentShape: PropTypes.string
}

export default Shapes