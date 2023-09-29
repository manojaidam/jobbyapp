import './index.css'

const SalaryRangeList = props => {
  const {salaryRangeDetails, salaryRange, onSalaryRangeType} = props
  const {salaryRangeId, label} = salaryRangeDetails
  const onChangeSalaryRangeType = () => {
    onSalaryRangeType(salaryRangeId)
  }
  return (
    <li
      key={salaryRangeId}
      className="list-employment-item"
      onChange={onChangeSalaryRangeType}
    >
      <input
        type="radio"
        className="input-checkbox"
        id={salaryRangeId}
        value={salaryRange}
        name="salary"
      />
      <label htmlFor={salaryRangeId} className="employment-label">
        {label}
      </label>
    </li>
  )
}
export default SalaryRangeList
