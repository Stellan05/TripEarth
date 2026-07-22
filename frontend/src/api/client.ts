/**
 * Axios 实例 — 统一的 HTTP 客户端
 */
import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

/* ── 请求拦截器 ── */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.set('Content-Type', 'application/json')
    return config
  },
  (error) => Promise.reject(error),
)

/* ── 响应拦截器 ── */
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => Promise.reject(error),
)

export { api }
