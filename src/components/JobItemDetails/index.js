import './index.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Header from '../Header'

import SimilarJobDetailsCard from '../SimilarJobDetailsCard'

const jobsApiConstents = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class JobItemDetails extends Component {
  state = {
    jobsDetailsObject: {},
    similarJobDetails: [],
    skills: [],
    lifeAtCompany: {},
    jobsApiStatus: jobsApiConstents.initial,
  }

  componentDidMount() {
    this.getJobItemList()
  }

  getJobItemList = async () => {
    this.setState({
      jobsApiStatus: jobsApiConstents.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      const lifeAtCompany = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }
      const skills = data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const similarJobs = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        jobDescription: eachItem.job_description,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        jobsDetailsObject: jobDetails,
        similarJobDetails: similarJobs,
        skills,
        lifeAtCompany,
        jobsApiStatus: jobsApiConstents.success,
      })
    } else {
      this.setState({
        jobsApiStatus: jobsApiConstents.failure,
      })
    }
  }

  renderSkillsListItem = () => {
    const {skills, jobsDetailsObject} = this.state
    const {id} = jobsDetailsObject

    return (
      <ul className="card-list-container">
        {skills.map(eachItem => {
          const {imageUrl, name} = eachItem
          return (
            <li className="list-item" key={id}>
              <img src={imageUrl} alt={name} className="skills-images" />
              <p className="card-item-para">{name}</p>
            </li>
          )
        })}
      </ul>
    )
  }

  renderLifeAtCompany = () => {
    const {lifeAtCompany} = this.state
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="life-at-company-card-container">
        <div className="life-at-company-container">
          <h1 className="life-at-company-heading">Life at Company</h1>
          <p className="life-at-company-para">{description}</p>
        </div>
        <img src={imageUrl} alt="logo" className="life-at-company-image" />
      </div>
    )
  }

  onClickRetryButton = () => {
    this.getJobItemList()
  }

  renderSuccessView = () => {
    const {jobsDetailsObject, similarJobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      title,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
    } = jobsDetailsObject
    return (
      <div className="job-details-container">
        <div className="job-details-card-container">
          <div className="job-details-card-heading-container">
            <img
              src={companyLogoUrl}
              alt="website logo"
              className="job details company logo"
            />
            <div className="job-card-heading-container">
              <h1 className="card-heading">{title}</h1>
              <p className="card-para">{rating}</p>
            </div>
          </div>
          <div className="location-details-container">
            <p className="location-para">{location}</p>
            <p className="location-para">{employmentType}</p>
            <p className="location-para">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="description-container">
            <h1 className="card-description">Description</h1>
            <a className="visit-link" href={companyWebsiteUrl}>
              Visit
            </a>
          </div>
          <p className="card-description-content">{jobDescription}</p>
          <h1 className="card-list-heading">Skills</h1>
          {this.renderSkillsListItem()}
          {this.renderLifeAtCompany()}
        </div>
        <ul className="similar-job-details-list-container">
          <h1>Similar Jobs</h1>
          {similarJobDetails.map(eachItem => (
            <SimilarJobDetailsCard
              similarJobDetails={eachItem}
              key={eachItem.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-page-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="failure view"
        className="failure-page"
      />
      <h1 className="not-found-heading">Oops! Something Went Wrong</h1>
      <p className="not-found-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.onClickRetryButton}>
        Retry
      </button>
    </div>
  )

  renderInProgressView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderPageStatusView = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case jobsApiConstents.success:
        return this.renderSuccessView()
      case jobsApiConstents.failure:
        return this.renderFailureView()
      case jobsApiConstents.inProgress:
        return this.renderInProgressView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderPageStatusView()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
