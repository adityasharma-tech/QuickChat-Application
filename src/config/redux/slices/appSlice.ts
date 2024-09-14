import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AppState {
  rKey: number
}

// Define the initial state using that type
const initialState: AppState = {
  rKey: 0,
}

export const appSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    refreshKey: (state) => {
      state.rKey = Math.random()
    },
  },
})

export const { refreshKey } = appSlice.actions

export default appSlice.reducer