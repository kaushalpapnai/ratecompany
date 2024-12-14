import { createSlice } from "@reduxjs/toolkit";

const repliesSlice = createSlice({
    name:"replies",
    initialState: {
        replies:[]
    },
    reducers:{
        addReplies:(state,action)=>{
            if (Array.isArray(action.payload)) {
                state.replies = action.payload;
              }
        },
        removeReplies: (state)=>{
           state.replies =  null
        }
    }
})

export const {addReplies,removeReplies} = repliesSlice.actions
export default repliesSlice.reducer