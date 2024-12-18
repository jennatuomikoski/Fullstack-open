/* eslint-disable react/prop-types */
import { useState } from 'react'
const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>
}

const Random = ({ text, votes }) => {
  return (
    <div>
      <p>{text}</p>
      <p>has {votes} votes</p>
    </div>
  )
}
const Titles = ({ text }) => {
  return <h1>{text}</h1>
}
const Winner = ({ anecdote, votes }) => {
  return (
    <div>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </div>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const handleNextClick = () => {
    const random = Math.floor(Math.random() * anecdotes.length)
    setSelected(random)
  }

  const handleVoteClick = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  const maxVotes = Math.max(...votes)
  const mostVotedAnecdote = anecdotes[votes.indexOf(maxVotes)]

  return (
    <div>
      <Titles text='Anecdote of the day' />
      <Random text={anecdotes[selected]} votes={votes[selected]}/>
      <Button handleClick={handleVoteClick} text='Vote'/>
      <Button handleClick={handleNextClick} text='Next anecdote'/>
      <Titles text='Anecdote with most votes' />
      {maxVotes > 0 && <Winner anecdote={mostVotedAnecdote} votes={maxVotes}/>}
    </div>
  )
}

export default App