import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { applyMiddleware, combineReducers, createAsyncThunk } from "@reduxjs/toolkit";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../baseURL";
import { ILoginInterface } from "../LoginSignUp/Content/LoginSignUpInterface";
import dayjs, { Dayjs } from "dayjs";
import { IcurrentUserDetails } from "../../Interfaces/FulldetailsInterface";

export enum EReportsStatus {
    Present,
    Absent,
    FullLeave,
    HalfLeave,
    WeekOff
}

export interface IAuth {
    id: string;
    user: string;
    role: "ADMIN" | "USER" | "";
    accessToken: string;
    refreshToken: string;
    onBoarding: boolean;
    loading?: boolean;
}

export interface IPanelState {
    isAdminPanel: boolean;
    selectedKey: string;
}

export interface Attendances {
    date: Dayjs;
    dayTrans: string[];
    status: EReportsStatus;
}

export interface ILocal {
    Report: {
        userId: string;
        attendances: Attendances;
        month: string;
        year: string;
    },
    currentReportDate: {
        date: Dayjs;
        status: EReportsStatus;
    },
    selectedUser: IcurrentUserDetails | null;
    dayRecords: {
        date: Dayjs | null,
        onTime: boolean | null;
        requiredHours: string | null;
    }
}

const initialLocalState: ILocal = {
    Report: {
        userId: "",
        attendances: {
            date: dayjs(),
            dayTrans: [],
            status: EReportsStatus.Present,
        },
        month: "",
        year: "",
    },
    currentReportDate: {
        date: dayjs(),
        status: EReportsStatus.Absent
    },
    selectedUser: null,
    dayRecords: {
        date: null,
        onTime: null,
        requiredHours: null
    }
};

const authInitialState: IAuth = {
    id: '',
    user: "",
    role: "",
    accessToken: "",
    refreshToken: "",
    onBoarding: false,
    loading: false,
};

const initialPanelState: IPanelState = {
    isAdminPanel: false,
    selectedKey: "",
};

export const PanelStateSlice = createSlice({
    name: "panelState",
    initialState: initialPanelState,
    reducers: {
        setIsAdminPanel: (state, action: PayloadAction<boolean>) => {
            state.isAdminPanel = action.payload;
        },
        setSelectedKey: (state, action: PayloadAction<string>) => {
            state.selectedKey = action.payload;
        }
    },
});

export const authLogin = createAsyncThunk("auth", async (values: ILoginInterface, thunkAPI) => {
    try {
        const response = await axios.post(`${baseURL}user/Login`, values);
        return { data: response.data };
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const authSlice = createSlice({
    name: "Auth",
    initialState: authInitialState,
    reducers: {
        setUser: (state, action: PayloadAction<string>) => {
            state.user = action.payload;
        },
        setRole: (state, action: PayloadAction<"ADMIN" | "USER">) => {
            state.role = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action: PayloadAction<string>) => {
            state.refreshToken = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(authLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(authLogin.fulfilled, (state, action) => {
                const result = action.payload?.data?.result;
                state.loading = false;
                if (result) {
                    state.user = result.user;
                    state.role = result.role;
                    state.accessToken = result.accessToken;
                    state.refreshToken = result.refreshToken;
                    state.onBoarding = result.Onboarding;
                    state.id = result._id;
                }
            })
            .addCase(authLogin.rejected, (state) => {
                state.loading = false;
                state.accessToken = "";
                state.refreshToken = "";
            });
    },
});

export const localSlice = createSlice({
    name: "local",
    initialState: initialLocalState,
    reducers: {
        setReports: (state, action: PayloadAction<ILocal>) => {
            state.Report.userId = action.payload.Report.userId;
            state.Report.attendances = action.payload.Report.attendances;
            state.Report.month = action.payload.Report.month;
            state.Report.year = action.payload.Report.year;
        },
        setcurrentReportDate: (state, action: PayloadAction<{ date: Dayjs, status: EReportsStatus }>) => {
            state.currentReportDate.date = action.payload.date;
            state.currentReportDate.status = action.payload.status;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setDayRecord: (state, action) => {
            state.dayRecords = action.payload;
        }
    },
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["panelState", "authLogin"],
};

const rootReducer = combineReducers({
    panelState: PanelStateSlice.reducer,
    authLogin: authSlice.reducer,
    localStates: localSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const { setIsAdminPanel, setSelectedKey } = PanelStateSlice.actions;
export const { setUser, setRole, setAccessToken, setRefreshToken } = authSlice.actions;
export const { setReports, setcurrentReportDate, setSelectedUser, setDayRecord } = localSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
