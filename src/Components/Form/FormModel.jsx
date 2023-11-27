import { useFormik } from 'formik';
import {userSchema} from "../Validation/Validation";

export const FormikData = (todos, handleAdd, handleSaveEdit) => {
  
  const todoFormik = useFormik({
    initialValues: {
      todo: '',
    },
    validationSchema: userSchema(todos),
    onSubmit: async (values, {  resetForm }) => {
      handleAdd(values.todo);
      resetForm();
    },
  });

  const editFormik = useFormik({
    initialValues: {
      task: '',
      status: 'false',
    },
    validationSchema: userSchema(todos),
    onSubmit: (values) => {
      if (todos.some((task) => task.text === values.task)) {
        editFormik.setFieldError('task', 'This task already exists');
        return;
      }
      handleSaveEdit(values);
      editFormik.resetForm();
    },
  });

  return { todoFormik, editFormik };
};
