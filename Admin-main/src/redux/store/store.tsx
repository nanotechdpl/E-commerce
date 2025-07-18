import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // LocalStorage
import { persistReducer, persistStore } from "redux-persist";
import bankReducer from "../fetures/bank/bankSlice";
import adminReducer from "../fetures/admin/adminSlice";
import apiReducer from "../fetures/api/apiSlice";
import authSlice from "../fetures/auth/authSlice";
import userReducer from "../fetures/admin/userSlice";
import agencyReducer from "../fetures/agency/agencySlice";
import orderSlice from "../fetures/order/orderSlice";
import paymentSlice from "../fetures/payment/paymentSlice";
import returnSlice from "../fetures/returns/returnSlice";
import chatPartnerReducer from "../fetures/liveChat/chatPartnerSlice";
import homeSlice from "../fetures/home/homeSlice";
import catSlice from "../fetures/category/categorySlice";
import dashboardSlice from "../fetures/dashboard/dashboardSlice";
import branchReducer from "../fetures/footer/branchSlice";
import footerCompanySlice from "../fetures/footer/footerCompanySlice";
import contactReducer from "../fetures/footer/contactSlice";
import technicalSlice from "../fetures/service/technicalSlice";
import businessSlice from "../fetures/service/businessSlice";
import constructionSlice from "../fetures/service/constructionSlice";
import exportSlice from "../fetures/service/exportSlice";
import visaSlice from "../fetures/service/visaSlice";
import travelingSlice from "../fetures/service/travelingSlice";
import employersSlice from "../fetures/service/employersSlice"
import employeeHiringSlice from "../fetures/service/employeeHiringSlice";
import noticeSlice from "../fetures/service/noticeSlice"
import blogSlice from "../fetures/service/blogSlice";
import realEstateSlice from "../fetures/service/realEstateSlice"
// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  bank: bankReducer,
  users: userReducer,
  admin: adminReducer,
  api: apiReducer,
  orders: orderSlice,
  agency: agencyReducer,
  payment: paymentSlice,
  returns: returnSlice,
  category: catSlice,
  home: homeSlice,
  chatPartner: chatPartnerReducer,
  dashboard: dashboardSlice,
  branch: branchReducer,
  footerCompany:footerCompanySlice,
  contact: contactReducer,
  technical: technicalSlice,
  construction: constructionSlice,
  export: exportSlice,
  employeeHiring:employeeHiringSlice,
  visa: visaSlice,
  traveling: travelingSlice,
  business: businessSlice,
  employers: employersSlice,
  notice: noticeSlice,
  blog: blogSlice,
  realEstate: realEstateSlice,
});

// Redux Persist Config
const persistConfig = {
  key: "root",
  storage, // Uses LocalStorage for persistence
  whitelist: ["auth", "users", "orders", "chatPartner"], // Only persist these reducers
};

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store Configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }),
});

// Persistor for the store
export const persistor = persistStore(store);

// Infer types
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
