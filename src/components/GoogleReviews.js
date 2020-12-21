import React from 'react'
import { Link, graphql, StaticQuery } from 'gatsby'

class GoogleReview extends React.Component {
  render() {
    const { data } = this.props
    const place = data.googlePlacesPlace;
    for( const[index, value] of place.childrenGooglePlacesReview.entries()) {
      value.stars = []
      for(var i=1; i<=5; i++) {
        if(value.rating >= i) {
          value.stars.push(<i key={`${index}${i}`} className="fas fa-star" />)
        } else {
          value.stars.push(<i key={`${index}${i}`} className="far fa-start" />)
        }
      }
    }
    return (
      <div>
        {place.childrenGooglePlacesReview.map(r => (
          <div key={r.author_name}>
          <div className="card">
            <div className="card-content">
              <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48">
                    <img src={r.profile_photo_url} alt="Image" height="64" width="64" className="review-img" />
                  </figure>
                </div>
                <div className="media-content">
                  <p className="title is-4">{r.author_name}</p>
                  <p className="subtitle is-6">{r.stars}</p>
                </div>
              </div>
              <div className="content">
                  { r.text.length > 275 ? `${r.text.substring(0, 275)} ...` : r.text }
                </div>
            </div>
          </div>
          <br/><br/>
          </div>
        ))}
      </div>
    )
  }
}

export default () => (
  <StaticQuery
    query={graphql`
      query GoogleReviewsQuery {
        googlePlacesPlace {
          name
          rating
          childrenGooglePlacesReview {
            author_name
            text
            rating
            profile_photo_url
          }
          user_ratings_total
        }
      }
    `}
    render={(data, count) => <GoogleReview data={data} count={count} />}
  />
)