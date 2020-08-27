import React from 'react'
import Gallery from '@browniebroke/gatsby-image-gallery'
import '@browniebroke/gatsby-image-gallery/dist/style.css'
import Layout from '../../components/Layout'
import image from '../../../static/img/gallery/home-jumbotron3.jpg'

const GalleryPage = ({ data }) => {
  const fullSize = data.images.edges.map((edge) => edge.node.full.fluid.src)
  const thumbs = data.images.edges.map((edge) => edge.node.thumb.fluid)
  return (
    <Layout title="Granite, Marble, Quartz Countertops Gallery | Columbia, SC">
      <div className="content">
        <div
              className="full-width-image-container margin-top-0"
              style={{
                backgroundImage: `url(${
                  !!image.childImageSharp ? image.childImageSharp.fluid.src : image
                })`,
                backgroundRepeat: `no-repeat`
              }}
            >
              <h2
                className="has-text-weight-bold is-size-1">
                Our Past Projects
              </h2>
            </div>
        <Gallery images={fullSize} thumbs={thumbs} imgClass="imgGallery" />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ImagesForGallery {
    images: allFile(
      filter: { sourceInstanceName: {eq: "uploads"}, relativeDirectory: { eq: "gallery" }, name: { regex: "/IMG/"} }
      sort: { fields: name }
    ) {
      edges {
        node {
          id
          thumb: childImageSharp {
            fluid(maxWidth: 270, maxHeight: 270) {
              ...GatsbyImageSharpFluid
            }
          }
          full: childImageSharp {
            fluid(
              maxWidth: 1024
              quality: 85
              srcSetBreakpoints: [576, 768, 992, 1200]
            ) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
export default GalleryPage