import { object, string } from 'yup';

const userSchema = (todos) => {
  return object({
    todo: string()
      .required('Todo is required')
      .test('is-unique', 'This task already exists', function (value) {
        return !todos?.some((task) => task.text === value);
      }),
  });
};

export { userSchema };
