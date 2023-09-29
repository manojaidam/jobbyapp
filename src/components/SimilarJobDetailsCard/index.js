import './index.css'

const SimilarJobDetailsCard = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    jobDescription,
    employmentType,
    id,
    location,
    rating,
    title,
  } = similarJobDetails
  return (
    <div className="similar-job-card-container">
      <div className="website-logo-container">
        <img
          src={companyLogoUrl}
          className="similarJob-image"
          alt="similar job company logo"
        />
        <div className="similar-heading-container">
          <h1 className="similar-job-title">{title}</h1>
          <p className="similar-job-para">Front</p>
        </div>
      </div>
      <div className="similar-description-container">
        <h1 className="similar-jobs-description-heading">Description</h1>
        <p className="similar-jobs-description">{jobDescription}</p>
      </div>
      <div className="similar-location-container">
        <p>{location}</p>
        <p>{employmentType}</p>
      </div>
    </div>
  )
}

export default SimilarJobDetailsCard
