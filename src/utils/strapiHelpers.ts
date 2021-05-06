import axios, { AxiosResponse } from 'axios'
import { fetchJwt } from '.'
import { CartProduct } from '../containers/Cart';
import { ComponentLocationAddress, UploadFile, UsersPermissionsUser } from '../generated/graphql'

const BASE = process.env.REACT_APP_API_HOST || ''
const CLIENT_BASE = window.location.origin || '';

export type StrapiLoginPayload = {
  jwt: string
  user: UsersPermissionsUser
}

const forgotPassword = async (email: string): Promise<AxiosResponse<any>> => {
  try {
    return await axios.post(BASE + '/auth/forgot-password', {
      email,
      url: `${CLIENT_BASE}/reset-password`
    });
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
      username: email,
      email,
      password
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

const providerAuth = async (
  provider: string,
  token: string
): Promise<AxiosResponse<StrapiLoginPayload>> => {
  try {
    return await axios.get(BASE + `/auth/${provider}/callback${token}`)
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

const sendOrderSummaryEmail = async (
  cartProducts: CartProduct[], 
  user: UsersPermissionsUser | undefined, 
  address: ComponentLocationAddress | undefined, 
  selectedDeliveryDate: Date | Date[]) => {
  const data = {
    products: cartProducts,
    username: user?.firstName,
    email: user?.email,
    address,
    date: selectedDeliveryDate
  };
  try {
    return await axios.post(`${BASE}/carts/orderSummaryEmail`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${fetchJwt()}`
      }
    })
  } catch (error) {
    return Promise.reject(error)
  }

};

export default { forgotPassword, resetPassword, login, register, providerAuth, upload, sendOrderSummaryEmail }
