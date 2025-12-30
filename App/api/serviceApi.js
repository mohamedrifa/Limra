import { ref, onValue, set, get, update} from 'firebase/database';
import { database } from '../../firebase';
import moment from 'moment';
import { Alert, Keyboard } from 'react-native';

export const selectCustomerByMobile = (mobileNo) =>
  new Promise((resolve, reject) => {
    const customerRef = ref(database, 'ServiceList');
    onValue(
      customerRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) return resolve(null);

        const customerData = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .find((item) => item.mobile === mobileNo);

        if (!customerData) return resolve(null);

        delete customerData.billItems;
        delete customerData.isAddedToProfile;
        delete customerData.billTotals;

        resolve({
          ...customerData,
          date: moment().format('YYYY-MM-DD'),
          serviceType: '',
        });
      },
      reject,
      { onlyOnce: true }
    );
  });

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

export const fetchServiceById = (customerId, callback) => {
  if (!customerId) return () => {};
  const customerRef = ref(database, `/ServiceList/${customerId}`);
  const unsubscribe = onValue(customerRef, (snapshot) => {
    callback(snapshot.val());
  });
  return unsubscribe;
};

export const saveCustomerService = ({
  customer,
  customerId,
  billItems,
  billTotals,
  setBillItems,
  setIsSaved,
  setShowSuggestion,
}) => {
  setShowSuggestion(false);
  if (
    !customer.name?.trim() &&
    !customer.mobile?.trim() &&
    !customer.city?.trim() &&
    !customer.address?.trim()
  ) {
    alert('Please Enter All the Credentials');
    return;
  }
  if (!customer.name?.trim()) return alert('Please Enter Name');
  if (!customer.mobile?.trim()) return alert('Please Enter Mobile No');
  if (!customer.city?.trim()) return alert('Please Enter City');
  if (!customer.serviceType || customer.serviceType === 'Select type')
    return alert('choose a Service type');
  if (!customer.address?.trim()) return alert('Please Enter Address/Notes');
  const lastItem = billItems[billItems.length - 1];
  if (
    !lastItem.particulars?.trim() &&
    !lastItem.rate?.trim() &&
    !lastItem.originalPrice?.trim()
  ) {
    billItems = billItems.slice(0, -1);
    setBillItems(billItems);
  }
  const isBillEmpty =
    !billItems[0]?.particulars?.trim() &&
    !billItems[0]?.rate?.trim() &&
    !billItems[0]?.originalPrice?.trim();
  const payload = isBillEmpty
    ? { ...customer }
    : { ...customer, billItems, billTotals };
  set(ref(database, `/ServiceList/${customerId}`), payload)
    .then(() => {
      Alert.alert('Success', 'Customer details saved!');
      setIsSaved(true);
      Keyboard.dismiss();
    })
    .catch((error) => alert(`Error: ${error.message}`));
};

export const fetchMergedCustomer = (setCustomers) => {
  const customerRef = ref(database, 'ServiceList');
  const unsubscribe = onValue(
    customerRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setCustomers([]);
        return;
      }
      const customerList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      const mergedCustomers = Object.values(
        customerList.reduce((acc, customer) => {
          const mobile = customer.mobile;
          if (!acc[mobile]) {
            acc[mobile] = { ...customer, ids: [customer.id] };
          } else {
            acc[mobile].ids.push(customer.id);
          }
          return acc;
        }, {})
      );
      setCustomers(mergedCustomers);
    },
    { onlyOnce: false }
  );
  return unsubscribe;
};

export const listenCustomersByMobile = (mobile, setCustomers) => {
  const customerRef = ref(database, 'ServiceList');
  const unsubscribe = onValue(customerRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      setCustomers([]);
      return;
    }
    const customers = Object.keys(data)
      .filter((key) => data[key]?.mobile === mobile)
      .map((key) => ({
        id: key,
        ...data[key],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setCustomers(customers);
  });

  return unsubscribe;
};

export const fetchServiceList = (setCustomers) => {
  const customerRef = ref(database, "ServiceList");

  const unsubscribe = onValue(customerRef, (snapshot) => {
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
  });

  return unsubscribe;
};