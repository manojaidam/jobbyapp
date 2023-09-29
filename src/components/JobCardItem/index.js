import './index.css'
import {Link} from 'react-router-dom'
import {AiOutlineStar} from 'react-icons/ai'

import {BsFillEnvelopeFill} from 'react-icons/bs'

const JobCardItem = props => {
  const {jobListItem} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobListItem

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-Card-list-item">
        <div className="list-logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="list-heading-container">
            <h1 className="list-heading">{title}</h1>
            <p className="list-paragraph">
              <AiOutlineStar className="icon" />
              {rating}
            </p>
          </div>
        </div>
        <div className="list-center-details-container">
          <div className="location-container">
            <p className="location-para">
              <AiOutlineStar className="icon" /> {location}
            </p>
          </div>
          <div className="location-container">
            <p className="type-para">
              <BsFillEnvelopeFill className="type-icon" /> {employmentType}
            </p>
          </div>
          <p className="salary-package">{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="list-description-container">
          <h1 className="list-description-heading">Description</h1>
          <p className="list-description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobCardItem
