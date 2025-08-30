import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8082/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('Adding Authorization header:', `Bearer ${token.substring(0, 20)}...`)
  } else {
    console.warn('No token found in localStorage')
  }
  console.log('Making request to:', config.method?.toUpperCase(), config.url)
  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    })
    
    // Handle 401/403 errors - token might be invalid
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Authentication error - token might be invalid or expired')
      // Optionally clear the token and redirect to login
      // localStorage.removeItem('token')
      // window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api


