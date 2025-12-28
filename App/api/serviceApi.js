import { getDatabase, ref, onValue, set, get, update} from 'firebase/database';
import { database } from '../../firebase';
import moment from 'moment';
import { Alert } from 'react-native';

export const MobileNumbersSuggest = (setSuggestions) => {
  const customerRef = ref(database, "ServiceList");
  const unsubscribe = onValue(customerRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const mobileNumbers = Array.from(
        new Set(
          Object.keys(data)
            .filter((key) => data[key]?.mobile)
            .map((key) => data[key].mobile)
        )
      );
      setSuggestions(mobileNumbers);
    } else {
      setSuggestions([]);
    }
  });
  return unsubscribe;
};

export const fetchServices = (setCustomers) => {
  const customerRef = ref(database, 'ServiceList');
  const unsubscribe = onValue(
    customerRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const customerList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setCustomers(customerList);
      } else {
        setCustomers([]);
      }
    },
    { onlyOnce: false }
  );
  return unsubscribe;
};

export const addToTask = async (customerId) => {
  try {
    const customerRef = ref(database, `/ServiceList/${customerId}`);
    const snapshot = await get(customerRef);
    if (!snapshot.exists()) return;
    const taskRef = ref(database, 'Tasks/overallTasks');
    const overallSnapshot = await get(taskRef);
    const overallTasks = overallSnapshot.exists()
      ? overallSnapshot.val()
      : 0;
    const { billItems, billTotals, ...filteredData } = snapshot.val();
    filteredData.isAddedToProfile = false;
    filteredData.date = moment().format('YYYY-MM-DD');
    const autoId = moment().format('YYYYMMDDHHmmss');
    await set(ref(database, `/Tasks/${autoId}`), filteredData);
    const taskCheck = await get(ref(database, `/Tasks/${autoId}`));
    if (taskCheck.exists()) {
      await update(ref(database, 'Tasks'), {
        overallTasks: overallTasks + 1,
      });
    }
    Alert.alert('Success', 'Task Added');
  } catch (error) {
    Alert.alert('Error', error.message);
    console.log(error);
  }
};