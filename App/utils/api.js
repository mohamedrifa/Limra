import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase';

export const fetchTasks = () => {
  return new Promise((resolve) => {
    const customerRef = ref(database, 'Tasks');

    onValue(
      customerRef,
      (snapshot) => {
        const data = snapshot.val() || {};

        const { overallTasks = 0, completedTasks = 0, ...taskEntries } = data;

        const customerList = Object.keys(taskEntries)
          .filter((key) => taskEntries[key] && typeof taskEntries[key] === 'object')
          .map((key) => ({
            id: key,
            ...taskEntries[key],
          }));

        resolve({ customerList, overallTasks, completedTasks });
      },
      { onlyOnce: true }
    );
  });
};


export const fetchTaskById = (taskId) => {
        const taskRef = ref(database, `Tasks/${taskId}`);
        onValue(taskRef, (snapshot) => {
          if (snapshot.exists()) {
            const detail = snapshot.val();
            return detail;
          }
        }, { onlyOnce: true });
        return null;
};
