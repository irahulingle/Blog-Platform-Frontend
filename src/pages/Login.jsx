import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import auth from "../assets/auth.jpg";

// ✅ Axios base URL and token
axios.defaults.baseURL = "https://blog-platform-backend-crkc.onrender.com/api/v1";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/user/login", input);

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);

        // ✅ Confirm token was saved before navigating
        setTimeout(() => {
          const storedToken = localStorage.getItem("token");
          if (storedToken) {
            navigate("/");
          } else {
            toast.error("Token not saved. Please try again.");
          }
        }, 100);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center h-screen md:pt-14 md:h-[760px]">
      <div className="hidden md:block">
        <img src={auth} alt="auth" className="h-[700px]" />
      </div>
      <div className="flex justify-center items-center flex-1 px-4 md:px-0">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              Login into your account
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm font-serif text-center">
              Enter your details below to login your account
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={input.email}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
              </div>
              <div className="relative">
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Your Password"
                  value={input.password}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Don&apos;t have an account?{" "}
                <Link to="/signup">
                  <span className="underline cursor-pointer hover:text-gray-800">Sign up</span>
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
