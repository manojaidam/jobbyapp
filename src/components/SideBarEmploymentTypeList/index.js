import './index.css'

const SideBarEmploymentTypeList = props => {
  const {employmentDetails, employmentType, onEmploymentTypeChange} = props
  const {label, employmentTypeId} = employmentDetails

  const onChangeEmploymentType = () => {
    onEmploymentTypeChange(employmentTypeId)
  }
  return (
    <li className="list-employment-item" onChange={onChangeEmploymentType}>
      <input
        type="checkbox"
        className="input-checkbox"
        id={employmentTypeId}
        value={employmentType}
        selected={employmentTypeId === employmentType}
      />
      <label htmlFor={employmentTypeId} className="employment-label">
        {label}
      </label>
    </li>
  )
}

export default SideBarEmploymentTypeList
