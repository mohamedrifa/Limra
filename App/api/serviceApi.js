import {  ref, onValue } from 'firebase/database';
import { database } from '../../firebase';

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