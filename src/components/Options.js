import React from 'react'
import PropTypes from 'prop-types'
import PreviewCompatibleImage from './PreviewCompatibleImage'

class Options extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }
  render() {
    if(this.props.currentStep !== 3) {
      return null
    }

    const { nodes } = this.props.data
    const { currentOptions} = this.props

    nodes.map( image => {
      currentOptions.map( option => {
        if(image.name == option.name) {
          image.qty = option.qty
        }
      })
    })
    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Optional</h1>
            <h2 className="subtitle">Select the number and type of sink cutouts needed</h2>
          </div>
        </section>
        <section className="section">
        <div className="columns is-mobile is-centered">
          <div className="column"></div>
            {nodes.map(image => (
              <div key={image.name} className="column is-narrow">
                <div className="card">
                  <div className="card-header">
                    <p className="card-header-title">
                      {image.name}
                    </p>
                  </div>
                  <div className="card-image">
                    <figure className="image">
                      <PreviewCompatibleImage 
                        imageInfo={{
                          image: image,
                          alt: image.name,
                          style: {
                            maxWidth: "275px"
                          }
                        }} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      <div className="select">
                        <select name={image.name} onChange={this.props.onChange} value={image.qty}>
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="column"></div>
        </div>   
        </section>
      </div>
    )
  }
}

Options.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default Options