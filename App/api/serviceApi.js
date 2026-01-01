import {
  ref,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  endBefore,
  onValue
} from 'firebase/database';
import { database } from '../../firebase';
import { getCache, setCache, clearCache } from '../utils/cache';

const CACHE_KEYS = {
  SERVICE_LIST: 'serviceList',
  MOBILE_SUGGESTIONS: 'mobileSuggestions',
  CUSTOMER_PREFIX: 'customer_',
};

export const selectCustomerByMobile = async (mobileNo, setCustomer) => {
  try {
    const cacheKey = `${CACHE_KEYS.CUSTOMER_PREFIX}${mobileNo}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      setCustomer(cached.data);
    }
    const snapshot = await get(ref(database, "ServiceList"));
    if (!snapshot.exists()) return;
    const data = snapshot.val();
    const customerData = Object.keys(data)
      .map((key) => ({ id: key, ...data[key] }))
      .find((item) => item.mobile === mobileNo);
    if (!customerData) return;
    delete customerData.billItems;
    delete customerData.billTotals;
    delete customerData.isAddedToProfile;
    const result = {
      ...customerData,
      date: moment().format("YYYY-MM-DD"),
      serviceType: "",
    };
    setCustomer(result);
    await setCache(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.log("Error in selectCustomerByMobile:", error);
  }
};

export const MobileNumbersSuggest = (setSuggestions) => {
  getCache(CACHE_KEYS.MOBILE_SUGGESTIONS).then((cached) => {
    if (cached) {
      setSuggestions(cached.data);
    }
  });
  const customerRef = ref(database, 'ServiceList');
  const unsubscribe = onValue(customerRef, async (snapshot) => {
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
      await setCache(CACHE_KEYS.MOBILE_SUGGESTIONS, {
        data: mobileNumbers,
        timestamp: Date.now(),
      });
    } else {
      setSuggestions([]);
      await clearCache(CACHE_KEYS.MOBILE_SUGGESTIONS);
    }
  });
  return unsubscribe;
};

let lastKeyMap = {}; 
export const fetchServices = async (
  selectedDate,
  setCustomers,
  setLoading,
  searchActive = false,
  loadMore = false
) => {
  setLoading(true);
  if (searchActive) {
    const cached = await getCache(CACHE_KEYS.SERVICE_LIST);
    if (cached?.data && !loadMore) {
      setCustomers(cached.data);
      setLoading(false);
    }
    const q = query(
      ref(database, 'ServiceList'),
      orderByKey(),
      limitToLast(50) 
    );
    const unsubscribe = onValue(
      q,
      async (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setCustomers([]);
          setLoading(false);
          return;
        }
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setCustomers(list);
        await setCache(CACHE_KEYS.SERVICE_LIST, {
          data: list,
          timestamp: Date.now(),
        });
        setLoading(false);
      },
      { onlyOnce: true }
    );
    return unsubscribe;
  }
  const cacheKey = `${CACHE_KEYS.SERVICE_LIST}_${selectedDate}`;
  if (!loadMore) {
    lastKeyMap[selectedDate] = null;

    const cached = await getCache(cacheKey);
    if (cached?.data) {
      setCustomers(cached.data);
      setLoading(false);
    }
  }
  let q;
  if (loadMore && lastKeyMap[selectedDate]) {
    q = query(
      ref(database, 'ServiceList'),
      orderByChild('date'),
      equalTo(selectedDate),
      endBefore(lastKeyMap[selectedDate]),
      limitToLast(10)
    );
  } else {
    q = query(
      ref(database, 'ServiceList'),
      orderByChild('date'),
      equalTo(selectedDate),
      limitToLast(10)
    );
  }
  const unsubscribe = onValue(
    q,
    async (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        if (!loadMore) {
          setCustomers([]);
          await clearCache(cacheKey);
        }
        setLoading(false);
        return;
      }
      const list = Object.keys(data)
        .sort()
        .map((key) => ({
          id: key,
          ...data[key],
        }));
      lastKeyMap[selectedDate] = list[0].id;
      setCustomers((prev) =>
        loadMore ? [...prev, ...list] : list
      );
      if (!loadMore) {
        await setCache(cacheKey, {
          data: list,
          timestamp: Date.now(),
        });
      }
      setLoading(false);
    },
    { onlyOnce: true }
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
    const overallTasks = overallSnapshot.exists() ? overallSnapshot.val() : 0;
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
    await clearCache(CACHE_KEYS.SERVICE_LIST);
    Alert.alert('Success', 'Task Added');
    return({success: true});
  } catch (error) {
    Alert.alert('Error', error.message);
    console.log(error);
    return({success: false, error: error});
  }
};

export const fetchServiceById = (customerId, callback) => {
  if (!customerId) return () => {};
  const cacheKey = `${CACHE_KEYS.CUSTOMER_PREFIX}id_${customerId}`;
  getCache(cacheKey).then((cached) => {
    if (cached) {
      callback(cached.data);
    }
  });
  const customerRef = ref(database, `/ServiceList/${customerId}`);
  const unsubscribe = onValue(customerRef, async (snapshot) => {
    const data = snapshot.val();
    callback(data);
    if (data) {
      await setCache(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    } else {
      await clearCache(cacheKey);
    }
  });
  return unsubscribe;
};

export const saveCustomerService = async ({
  customer,
  customerId,
  billItems,
  billTotals,
  setBillItems,
  setIsSaved,
  setShowSuggestion,
}) => {
  setShowSuggestion(false);
  if (!customer.name?.trim() && !customer.mobile?.trim() && !customer.city?.trim() && !customer.address?.trim()) {
    alert('Please Enter All the Credentials');
    return;
  }
  if (!customer.name?.trim()) return alert('Please Enter Name');
  if (!customer.mobile?.trim()) return alert('Please Enter Mobile No');
  if (!customer.city?.trim()) return alert('Please Enter City');
  if (!customer.serviceType || customer.serviceType === 'Select type') return alert('choose a Service type');
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
  try {
    await set(ref(database, `/ServiceList/${customerId}`), payload);
    await clearCache(CACHE_KEYS.SERVICE_LIST);
    await clearCache(CACHE_KEYS.MOBILE_SUGGESTIONS);
    await clearCache(`${CACHE_KEYS.CUSTOMER_PREFIX}${customer.mobile}`);
    await clearCache(`${CACHE_KEYS.CUSTOMER_PREFIX}id_${customerId}`);
    Alert.alert('Success', 'Customer details saved!');
    setIsSaved(true);
    Keyboard.dismiss();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

export const fetchMergedCustomer = (setCustomers) => {
  const cacheKey = 'mergedCustomers';
  getCache(cacheKey).then((cached) => {
    if (cached) {
      setCustomers(cached.data);
    }
  });
  const customerRef = ref(database, 'ServiceList');
  const unsubscribe = onValue(
    customerRef,
    async (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setCustomers([]);
        await clearCache(cacheKey);
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
      await setCache(cacheKey, {
        data: mergedCustomers,
        timestamp: Date.now(),
      });
    },
    { onlyOnce: false }
  );
  return unsubscribe;
};

export const listenCustomersByMobile = (mobile, setCustomers) => {
  const cacheKey = `customersByMobile_${mobile}`;
  getCache(cacheKey).then((cached) => {
    if (cached) {
      setCustomers(cached.data);
    }
  });
  const customerRef = ref(database, 'ServiceList');
  const unsubscribe = onValue(customerRef, async (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      setCustomers([]);
      await clearCache(cacheKey);
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
    await setCache(cacheKey, {
      data: customers,
      timestamp: Date.now(),
    });
  });

  return unsubscribe;
};

export const fetchServiceList = (setCustomers) => {
  getCache(CACHE_KEYS.SERVICE_LIST).then((cached) => {
    if (cached) {
      setCustomers(cached.data);
    }
  });
  const customerRef = ref(database, 'ServiceList');
  const unsubscribe = onValue(customerRef, async (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const customerList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setCustomers(customerList);
      await setCache(CACHE_KEYS.SERVICE_LIST, {
        data: customerList,
        timestamp: Date.now(),
      });
    } else {
      setCustomers([]);
      await clearCache(CACHE_KEYS.SERVICE_LIST);
    }
  });
  return unsubscribe;
};