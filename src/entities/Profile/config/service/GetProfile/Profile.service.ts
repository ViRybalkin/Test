import {createAsyncThunk} from "@reduxjs/toolkit";
import {handleError} from "shared/config/helpers/error";
import {ThunkConfig} from "app";
import {ProfileDataTypes} from "../../types/Profile.types";

export const getProfile = createAsyncThunk<ProfileDataTypes, void, ThunkConfig<string>>(
  'profile/profileThunk',
  async (payload, {extra: {api}, rejectWithValue}) => {
    try {
      const {data} = await api.get<ProfileDataTypes>('/profile')


      return data
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }

      const {data} = handleError(error);

      return rejectWithValue(data.message)
    }
  }
)