import './index.css'
import {BiSearch} from 'react-icons/bi'
import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import JobCardItem from '../JobCardItem'
import SideBarEmploymentTypeList from '../SideBarEmploymentTypeList'
import SalaryRangeList from '../SalaryRangeList'

import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

const profileDetailsStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    salaryRange: salaryRangesList[0].salaryRangeId,
    employmentType: [],
    apiStatus: apiStatusConstants.initial,
    profileDetails: profileDetailsStatus.initial,
    profile: {},
  }

  componentDidMount() {
    this.getJobsList()
    this.getProfileListView()
  }

  getJobsList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {searchInput, employmentType, salaryRange} = this.state
    const employmentTypeValue = employmentType.join(',')
    const searchInputValue = searchInput.toLowerCase()

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeValue}&minimum_package=${salaryRange}&search=${searchInputValue}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        const updatedData = data.jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          packagePerAnnum: each.package_per_annum,
          rating: each.rating,
          title: each.title,
        }))
        this.setState({
          jobsList: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure, jobsList: []})
      }
    }
  }

  getProfileListView = async () => {
    this.setState({
      profileDetails: profileDetailsStatus.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const userUrl = 'https://apis.ccbp.in/profile'
    const userOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const userResponse = await fetch(userUrl, userOptions)
    if (userResponse.ok === true) {
      const userData = await userResponse.json()
      const profileDetails = userData.profile_details
      const userLoginData = {
        profileImageUrl: profileDetails.profile_image_url,
        name: profileDetails.name,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileDetails: profileDetailsStatus.success,
        profile: userLoginData,
      })
    } else {
      this.setState({profileDetails: profileDetailsStatus.failure})
    }
  }

  onEmploymentTypeChange = id => {
    const {employmentType} = this.state

    const updatedValue = employmentType.includes(id)
    if (updatedValue) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType],
        }),
        this.getJobsList,
      )
    } else {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, id],
        }),
        this.getJobsList,
      )
    }
  }

  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchEnterButton = () => {
    this.getJobsList()
  }

  renderTypeOfEmploymentList = () => {
    const {employmentType} = this.state
    return (
      <ul className="employment-type-container">
        <h1 className="employment-heading">Type of Employment</h1>
        {employmentTypesList.map(eachItem => (
          <SideBarEmploymentTypeList
            employmentDetails={eachItem}
            key={eachItem.employmentTypeId}
            employmentType={employmentType}
            onEmploymentTypeChange={this.onEmploymentTypeChange}
          />
        ))}
      </ul>
    )
  }

  onSalaryRangeType = id => {
    this.setState({salaryRange: id}, this.getJobsList)
  }

  renderSalaryRangeList = () => {
    const {salaryRange} = this.state
    return (
      <ul className="employment-type-container">
        <h1 className="employment-heading">Salary Range</h1>
        {salaryRangesList.map(eachItem => (
          <SalaryRangeList
            key={eachItem.salaryRangeId}
            salaryRangeDetails={eachItem}
            salaryRange={salaryRange}
            onSalaryRangeType={this.onSalaryRangeType}
          />
        ))}
      </ul>
    )
  }

  renderSuccessView = () => {
    const {jobsList} = this.state
    const noJobs = jobsList.length === 0
    return noJobs ? (
      <div className="failure-page-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="failure-page"
        />
        <h1 className="not-found-heading">No Jobs Found</h1>
        <p className="not-found-para">
          We could not find any jobs. Try other filters
        </p>
        <button type="button" onClick={this.onClickGetView}>
          Retry
        </button>
      </div>
    ) : (
      <ul className="job-Items-list-container">
        {jobsList.map(eachItem => (
          <JobCardItem key={eachItem.id} jobListItem={eachItem} />
        ))}
      </ul>
    )
  }

  onClickGetView = () => {
    this.getJobsList()
  }

  renderGetFailureView = () => (
    <div className="failure-page-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-page"
      />
      <h1 className="not-found-heading">Oops! Something Went Wrong</h1>
      <p className="not-found-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.onClickGetView}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfileSuccessView = () => {
    const {profile} = this.state
    const {name, shortBio, profileImageUrl} = profile
    return (
      <div className="user-details-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="username-heading">{name}</h1>
        <p className="user-paragraph">{shortBio}</p>
      </div>
    )
  }

  onProfileClickGetView = () => {
    this.getProfileListView()
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.onProfileClickGetView}
      >
        Retry
      </button>
    </div>
  )

  renderProfileLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderPageStatusView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderGetFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfilePageView = () => {
    const {profileDetails} = this.state
    switch (profileDetails) {
      case profileDetailsStatus.success:
        return this.renderProfileSuccessView()
      case profileDetailsStatus.failure:
        return this.renderProfileFailureView()
      case profileDetailsStatus.inProgress:
        return this.renderProfileLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-responsive-container">
          <div className="side-details-container">
            {this.renderProfilePageView()}

            <hr />
            {this.renderTypeOfEmploymentList()}
            <hr />
            {this.renderSalaryRangeList()}
          </div>
          <div className="jobs-list-container">
            <div className="search-input-container">
              <input
                className="search-input"
                type="search"
                placeholder="Search"
                value={searchInput}
                onChange={this.onSearchInput}
              />
              <button
                type="button"
                className="inputButton"
                data-testid="searchButton"
                onClick={this.onSearchEnterButton}
              >
                <BiSearch className="search-icon" />
              </button>
            </div>
            {this.renderPageStatusView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
