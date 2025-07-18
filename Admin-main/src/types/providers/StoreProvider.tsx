"use client";
import { AppStore, persistor, store } from "@/redux/store/store";
// import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const storeRef = useRef<AppStore>();
  // if (!storeRef.current) {
    // Create the store instance the first time this renders
    // storeRef.current = store();
  // }

  return (<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>)
}
