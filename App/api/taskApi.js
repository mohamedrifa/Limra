import { ref, onValue, set, update, get } from "firebase/database";
import { database } from "../../firebase";
import moment from "moment";
import { setCache, getCache } from "../utils/cache";

/* ---------------- FETCH TASKS (REALTIME + CACHE) ---------------- */

export const fetchTasks = (onUpdate) => {
  getCache("TASKS_CACHE").then((cached) => {
    if (cached) {
      onUpdate(cached);
    }
  });

  const tasksRef = ref(database, "Tasks");
  const unsubscribe = onValue(tasksRef, (snapshot) => {
    const data = snapshot.val() || {};
    const {
      overallTasks = 0,
      completedTasks = 0,
      ...taskEntries
    } = data;
    const customerList = Object.keys(taskEntries)
      .filter((key) => typeof taskEntries[key] === "object")
      .map((key) => ({
        id: key,
        ...taskEntries[key],
      }));
    const result = { customerList, overallTasks, completedTasks };
    setCache("TASKS_CACHE", result);
    onUpdate(result);
  });
  return unsubscribe;
};

/* ---------------- FETCH TASK BY ID ---------------- */

export const fetchTaskById = async (taskId, setCustomer) => {
  const cacheKey = `TASK_${taskId}`;
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log('FROM CACHE');
      setCustomer(cached);
    }
    const snapshot = await get(ref(database, `Tasks/${taskId}`));
    if (!snapshot.exists()) return;
    const data = snapshot.val();
    console.log('FROM FIREBASE');
    await setCache(cacheKey, data);
    setCustomer(data);
  } catch (error) {
    console.error('Fetch task error:', error);
  }
};


/* ---------------- SAVE TASK ---------------- */

export const saveTaskToDB = async ({ taskId, customer, toAdd, overallTasks }) => {
  try {
    const { id, ...payload } = item;
    await set(ref(database, `Tasks/${taskId}`), payload);
    // 💾 update cache
    setCache(`TASK_${taskId}`, customer);
    console.log(customer);

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

/* ---------------- UPDATE COMPLETED TASKS ---------------- */

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

/* ---------------- DELETE TASK ---------------- */

export const deleteTaskAtDB = async (
  tasksObject,
  overallTasks,
  completedTasks
) => {
  try {
    await set(ref(database, "Tasks"), {
      ...tasksObject,
      overallTasks,
      completedTasks,
    });

    // 💾 refresh cache
    setCache("TASKS_CACHE", {
      customerList: Object.values(tasksObject),
      overallTasks,
      completedTasks,
    });

  } catch (error) {
    console.error("Delete failed:", error);
  }
};

/* ---------------- FETCH CUSTOMER BY MOBILE ---------------- */

export const fetchCustomerByMobile = async (mobileNo, taskId) => {
  const cacheKey = `CUSTOMER_${mobileNo}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  try {
    const snapshot = await get(ref(database, "ServiceList"));
    const data = snapshot.val();
    if (!data) return null;

    const customerData = Object.values(data).find(
      (item) => item.mobile === mobileNo
    );

    if (!customerData) return null;

    delete customerData.billItems;
    delete customerData.billTotals;

    const result = {
      ...customerData,
      id: taskId,
      isAddedToProfile: false,
      date: moment().format("YYYY-MM-DD"),
      serviceType: "",
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Fetch customer by mobile error:", error);
    return null;
  }
};

/* ---------------- ADD TASK TO PROFILE ---------------- */

export const addTaskToProfile = async (item) => {
  try {
    const profileId = moment().format("YYYYMMDDHHmmss");
    const { id, ...payload } = item;
    await set(ref(database, `ServiceList/${profileId}`), payload);
    await update(ref(database, `Tasks/${item.id}`), {
      isAddedToProfile: true,
    });

    // 💾 update cached task
    setCache(`TASK_${item.id}`, {
      ...item,
      isAddedToProfile: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Add task to profile error:", error);
    return { success: false, error };
  }
};
