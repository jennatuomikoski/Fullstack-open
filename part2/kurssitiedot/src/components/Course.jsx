/* eslint-disable react/prop-types */
const Course = ({ courses }) => {
    return (
        <div>
            {courses.map((course) => (
                <div key={course.id}>
                    <Header course={course}/>
                    <Content parts={course.parts} />
                    <Total parts={course.parts} />
                </div>
            ))}      
        </div>

    )
}

const Header = ({ course }) => {
    return (
        <h1>{course.name}</h1>
    )
}
const Part = ({ part }) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
}
const Content = ({ parts }) => {
    return (
        <div>
            {parts.map((part) => (
                <Part key={part.id} part={part} />
            ))}
        </div>
    )
}

const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <p><b>Total of {total} exercises</b></p>
    )
}

export default Course