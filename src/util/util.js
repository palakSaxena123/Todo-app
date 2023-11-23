 export const getLocalData = () => {
    const list = localStorage.getItem('myTodo');
    if (list) {
      const parsedList = JSON.parse(list);
      return parsedList;
    } else {
      return [];
    }
  };


