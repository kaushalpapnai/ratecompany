import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice"
import repliesSlice from "./slices/repliesSlice"

const store = configureStore(
    {
        reducer:{
            user : userSlice,
            replies : repliesSlice,
        },
    }
)

export default store