import axios, { AxiosResponse } from 'axios'
import { fetchJwt } from '.'
import { UploadFile, UsersPermissionsUser } from '../generated/graphql'

const BASE = process.env.REACT_APP_API_HOST || ''

export type StrapiLoginPayload = {
  jwt: string
  user: UsersPermissionsUser
}

const forgotPassword = async (email: string): Promise<AxiosResponse<any>> => {
  try {
    return await axios.post(BASE + '/auth/forgot-password', {
      email
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

const resetPassword = async (code: string, password: string, passwordConfirmation: string) => {
  try {
    return await axios.post(BASE + '/auth/reset-password', {
      code,
      password,
      passwordConfirmation
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

const login = async (
  email: string,
  password: string
): Promise<AxiosResponse<StrapiLoginPayload>> => {
  try {
    return await axios.post(BASE + '/auth/local', {
      identifier: email,
      password
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

const register = async (
  email: string,
  password: string
): Promise<AxiosResponse<StrapiLoginPayload>> => {
  try {
    return await axios.post(BASE + '/auth/local/register', {
      email,
      password
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

const providerAuth = async (provider: string): Promise<AxiosResponse<StrapiLoginPayload>> => {
  try {
    return await axios.get(BASE + `/connect/${provider}/callback`)
  } catch (error) {
    return Promise.reject(error)
  }
}

const upload = async (
  file: File,
  onUploadProgress?: (progressEvent: ProgressEvent, file: File) => void
): Promise<AxiosResponse<UploadFile[]>> => {
  const formData = new FormData()
  formData.append('files', file)
  try {
    return await axios.post(BASE + '/upload', formData, {
      onUploadProgress: (event) => onUploadProgress && onUploadProgress(event, file),
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${fetchJwt()}`
      }
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

export default { forgotPassword, resetPassword, login, register, providerAuth, upload }
