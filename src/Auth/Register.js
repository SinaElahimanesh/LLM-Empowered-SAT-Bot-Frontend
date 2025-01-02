import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/register/", formData);
            setMessage("ثبت نام انجام شد. درحال انتقال به صفحه ورود... sr   ");
            // Automatically log in the user after registration
            console.log("res: ", response);
            // if (onRegister) onRegister();          
            setTimeout(() => {
                navigate('/login'); // Redirect to the login page
            }, 1500);
        } catch (error) {
            console.log("reg err: ", error);
            setMessage(error.response.data.username || error.response.data.email || error.response.data.error || 'Error: Registration failed. ');
        }
    };

    return (
        <div className="flex items-center text-right justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full  max-w-md bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">ثبت‌ نام</h2>
                {message && <p className="text-red-500">{message}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">نام‌کاربری</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">ایمیل</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">رمزعبور</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    ثبت‌ نام
                </button>
                <div className="text-center mt-3" dir='rtl'>
                    قبلا حساب ساخته‌اید؟
                    <a
                        className="text-blue-500 hover:text-blue-700 transition duration-200 mr-1"
                        href="/login"
                    >
                        ورود!
                    </a>
                </div>
            </form>
        </div>
    );
};

export default Register;
