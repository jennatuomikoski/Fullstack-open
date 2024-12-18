/* eslint-disable react/prop-types */
import { useState } from 'react'
const Button = ({ handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
const FeedbackStats = ({text}) => (
  <h1>{text}</h1>
)
const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)
const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = (good * 1 + neutral * 0 + bad * -1) / (good + neutral + bad || 1)
  const positive = (good / (total || 1)) * 100

  if (total === 0) {
    return <p>No feedback given</p>
  }

  return (
      <table>
        <tbody>
            <StatisticLine text='Good' value={good} />
            <StatisticLine text='Neutral' value={neutral} />
            <StatisticLine text='Bad' value={bad} />
            <StatisticLine text='All ' value={total} />
            <StatisticLine text='Average ' value={average.toFixed(1)} />
            <StatisticLine text='Positive ' value={`${positive.toFixed(1)} %`} />
        </tbody>
      </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = (newValue) => {
    setGood(newValue)
  }

  const setToNeutral = (newValue) => {
    setNeutral(newValue)
  }
  const setToBad = (newValue) => {
    setBad(newValue)
  }

  return (
    <div>
      <div>
        <FeedbackStats text='Give feedback'/>
        <Button handleClick={() => setToGood(good + 1)} text='Good' />
        <Button handleClick={() => setToNeutral(neutral + 1)} text='Neutral' />
        <Button handleClick={() => setToBad(bad + 1)} text='Negative' />
        <FeedbackStats text='Statistics' />
        <Statistics good={good} neutral={neutral} bad={bad}/>
      </div>
    </div>
  )
}

export default App