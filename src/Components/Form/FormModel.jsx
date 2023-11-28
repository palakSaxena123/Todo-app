import { useFormik } from 'formik';
import { useState } from 'react';
// import {userSchema} from "../Validation/Validation";
import TodoForm from './Form';

 const FormModel = () => {
  const [todos, setTodos] = useState([]);

  const addTaskToList = (newTask) => {
    setTodos([...todos, newTask]);
  };

  function handleAdd(values) {
    console.log(values)

    const newTask = {
      text: values.todo,
      status: false,
      created: new Date().toISOString(),
      modified: false,
    };
    addTaskToList(newTask);
    // formik.resetForm();
  };
  // const handleInputKeyUp = (event) => {
  //   if (event.key === 'Enter') {
  //     const trimmedValue = formik.values.todo.trim();
  //     console.log(trimmedValue);
  //     if (trimmedValue !== '') {
  //       handleAdd();
  //  }}}
  
  const formik = useFormik({
    initialValues: {
      todo: '',
    },
  
     onSubmit: (values) => {
      console.log(values);
      handleAdd(values);
    },
  });

  // const editFormik = useFormik({
  //   initialValues: {
  //     task: '',
  //     status: 'false',
  //   },
  //   validationSchema: userSchema(todos),
  //   onSubmit: (values) => {
  //     if (isDuplicateTask(values.task)) {
  //       editFormik.setFieldError('task', 'This task already exists');
  //       return;
  //     }
  //     handleSaveEdit(values);
  //   },
  // })

  return (
    <>

     <TodoForm {...formik}/>
      {todos.map((item,index)=>(
        <div key={index}>{item.text}
        
        <li>{item.created}</li>
        <li>{item.modified}</li>

        </div>

      ))}

    </>
  )
};
export default FormModel;

