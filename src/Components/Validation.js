import { object, string } from 'yup';

const userSchema = object({
  todo: string()
    .required('Todo is required')
    .test('is-unique', 'This task already exists', function (value) {
      const todos = this.options.context.todos;
      return !todos.some((task) => task.text === value);
    }),
});

export default userSchema;
