import {  ref, onValue, set, update, get, remove} from 'firebase/database';
import { database } from '../../firebase';
import moment from "moment";

export const fetchTasks = (onUpdate) => {
  const tasksRef = ref(database, "Tasks");
  const unsubscribe = onValue(tasksRef, (snapshot) => {
    const data = snapshot.val() || {};
    const {
      overallTasks = 0,
      completedTasks = 0,
      ...taskEntries
    } = data;
    const customerList = Object.keys(taskEntries)
      .filter(
        (key) => taskEntries[key] && typeof taskEntries[key] === "object"
      )
      .map((key) => ({
        id: key,
        ...taskEntries[key],
      }));
    onUpdate({ customerList, overallTasks, completedTasks });
  });
  return unsubscribe;
};


export const fetchTaskById = async (taskId) => {
  try {
    const taskRef = ref(database, `Tasks/${taskId}`);
    const snapshot = await get(taskRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Fetch task error:", error);
    return null;
  }
};

export const saveTaskToDB = async ({ taskId, customer, toAdd, overallTasks }) => {
  try {
    await set(ref(database, `Tasks/${taskId}`), customer);
    if (toAdd) {
      await update(ref(database, "Tasks"), {
        overallTasks: overallTasks + 1,
      });
      return { success: true, type: "add" };
    }
    return { success: true, type: "edit" };
  } catch (error) {
    console.error("Save task error:", error);
    return { success: false, error };
  }
};


export const updateCompletedTasks = async ({ taskId, completedTasks }) => {
  try {
    const snapshot = await get(
      ref(database, `Tasks/${taskId}/isAddedToProfile`)
    );
    if (snapshot.exists() && snapshot.val()) {
      await update(ref(database, "Tasks"), {
        completedTasks: completedTasks + 1,
      });
      return { success: true };
    }

    return { success: false, skipped: true };
  } catch (error) {
    console.error("Update completed tasks error:", error);
    return { success: false, error };
  }
};


export const deleteTaskAtDB = async (tasksObject, overallTasks, completedTasks) => {
  try {
    await set(ref(database, "Tasks"), {
      ...tasksObject,
      overallTasks,
      completedTasks,
    });
    console.log("Task deleted & Tasks updated");
  } catch (error) {
    console.error("Delete failed:", error);
  }
}

export const fetchCustomerByMobile = async (mobileNo, taskId) => {
  try {
    const snapshot = await get(ref(database, "ServiceList"));
    const data = snapshot.val();

    if (!data) return null;

    const customerData = Object.keys(data)
      .map((key) => ({ id: key, ...data[key] }))
      .find((item) => item.mobile === mobileNo);

    if (!customerData) return null;

    delete customerData.billItems;
    delete customerData.billTotals;

    return {
      ...customerData,
      id: taskId,
      isAddedToProfile: false,
      date: moment().format("YYYY-MM-DD"),
      serviceType: "",
    };
  } catch (error) {
    console.error("Fetch customer by mobile error:", error);
    return null;
  }
};


export const addTaskToProfile = async (item) => {
  try {
    const profileId = moment().format("YYYYMMDDHHmmss");
    await set(ref(database, `ServiceList/${profileId}`), {
      ...item,
    });
    await update(ref(database, `Tasks/${item.id}`), {
      isAddedToProfile: true,
    });
    return { success: true };
  } catch (error) {
    console.error("Add task to profile error:", error);
    return { success: false, error };
  }
};