import React, { useContext, useState } from 'react'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { CgSpinner } from 'react-icons/cg'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [aadhaarNo, setAadhaarNo] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [currentStep, setCurrentStep] = useState('password') // password → otp

  const [loading, setLoading] = useState(false)

  const generateOtp = async () => {
    try {
      await axios.get(`/api/v1/auth/generate-otp/${aadhaarNo}`)
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message)
    }
  }

  const verifyPassword = async () => {
    if (aadhaarNo.length !== 12) {
      toast.error('Enter 12 digit Aadhaar number.')
      return
    }
    if (!password) {
      toast.error('Enter the password.')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post('/api/v1/auth/login', {
        aadhaarNo,
        password
      })
      if (data?.success) {
        toast.success(data.message)
        setCurrentStep('otp')
        await generateOtp()
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Invalid OTP.')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post('/api/v1/auth/verify-otp', {
        aadhaarNo,
        otp
      })

      if (data?.success) {
        toast.success(data?.message)
        login(data?.token)
        navigate('/admin/complaints/phone')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className='bg-gray-50 p-6 text-gray-800 min-h-screen flex justify-center items-center'>
        <div className='bg-white shadow-xl rounded-lg p-8 w-full max-w-md'>
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Admin Login 👮‍♂️</h1>

          <div className='mb-4'>
            <label className='block mb-1 font-medium'>Aadhaar Number</label>
            <input
              type='text'
              value={aadhaarNo}
              inputMode='numeric'
              maxLength={12}
              onChange={e => {
                const onlyNums = e.target.value.replace(/\D/g, '') // remove non-digits
                setAadhaarNo(onlyNums)
              }}
              placeholder='Enter 12 digit Aadhaar number'
              className='w-full border rounded px-3 py-2'
              disabled={currentStep === 'otp'}
            />
          </div>

          {currentStep === 'password' && (
            <>
              <div className='mb-4'>
                <label className='block mb-1 font-medium'>Password</label>
                <input
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder='Enter password'
                  className='w-full border rounded px-3 py-2'
                />
              </div>
              <button
                onClick={verifyPassword}
                disabled={loading}
                className='bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition duration-200 flex justify-center items-center'
              >
                {loading ? <CgSpinner className='animate-spin text-xl' /> : 'Verify'}
              </button>
            </>
          )}

          {currentStep === 'otp' && (
            <>
              <div className='mb-4'>
                <label className='block mb-1 font-medium'>Enter OTP</label>
                <input
                  type='text'
                  value={otp}
                  inputMode='numeric'
                  maxLength={6}
                  onChange={e => {
                    const onlyNums = e.target.value.replace(/\D/g, '') // replace the charecters
                    setOtp(onlyNums)
                  }}
                  placeholder='Enter OTP sent to your phone'
                  className='w-full border rounded px-3 py-2'
                />
              </div>
              <button
                onClick={verifyOtp}
                disabled={loading}
                className='bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition duration-200 flex justify-center items-center'
              >
                {loading ? <CgSpinner className='animate-spin text-xl' /> : 'Submit OTP'}
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Login
