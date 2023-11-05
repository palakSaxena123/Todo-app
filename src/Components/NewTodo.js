import React from 'react'

const NewTodo = () => {
  const [todoData, setTodoData] = useState({
    todos: [],

  })
  function handleChange(e) {
    setTodoData({
      ...todoData,
      searchValue: e.target.value,
      
    });
  }
  

  return (
    <div>
    <input type='text' placeholder='Enter Your task' value={todo} onChange={handleChange}/>
    <button onClick={HandleAddTodo}>Add</button>
    
    </div>
  )
}

export default NewTodo;