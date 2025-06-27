import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { setUser } from '@/redux/authSlice'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import userLogo from "../assets/user.jpg"
import { FaFacebook, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa"
import TotalProperty from '@/components/TotalProperty'

const Profile = () => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(store => store.auth)

  const [input, setInput] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    occupation: user?.occupation,
    bio: user?.bio,
    facebook: user?.facebook,
    linkedin: user?.linkedin,
    github: user?.github,
    instagram: user?.instagram,
    file: null
  })

  const changeEventHandler = (e) => {
    const { name, value } = e.target
    setInput(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] })
  }

  const submitHandler = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("firstName", input.firstName || "");
  formData.append("lastName", input.lastName || "");
  formData.append("bio", input.bio || "");
  formData.append("occupation", input.occupation || "");
  formData.append("facebook", input.facebook || "");
  formData.append("linkedin", input.linkedin || "");
  formData.append("instagram", input.instagram || "");
  formData.append("github", input.github || "");
  if (input?.file) {
    formData.append("avatar", input.file);
  }

  try {
    setLoading(true);
    
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    const response = await axios.put(
      "http://localhost:8000/api/v1/user/profile/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      dispatch(setUser(response.data.user));
      toast.success(response.data.message || "Profile updated successfully!");
      setOpen(false);
    } else {
      toast.error("Something went wrong!");
    }
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Update failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className='pt-20 md:ml-[320px] md:h-screen'>
      <div className='max-w-6xl mx-auto mt-8 '>
        <Card className="flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
          {/* Profile Image */}
          <div className='flex flex-col items-center justify-center md:w-[400px]'>
            <Avatar className="w-40 h-40 border-2">
              <AvatarImage src={user?.photoUrl || userLogo} />
            </Avatar>
            <h1 className='text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3'>
              {user?.occupation || "MERN Stack Developer"}
            </h1>
            <div className='flex gap-4 items-center'>
              <Link to={user?.facebook || "#"} target="_blank"><FaFacebook className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
              <Link to={user?.linkedin || "#"} target="_blank"><FaLinkedin className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
              <Link to={user?.github || "#"} target="_blank"><FaGithub className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
              <Link to={user?.instagram || "#"} target="_blank"><FaInstagram className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
            </div>
          </div>

          {/* Profile Info */}
          <div>
            <h1 className='font-bold text-center md:text-start text-4xl mb-7'>
              Welcome {user?.firstName}!
            </h1>
            <p><span className='font-semibold'>Email : </span>{user?.email}</p>
            <div className='flex flex-col gap-2 items-start justify-start my-5'>
              <Label className="">About Me</Label>
              <p className='border dark:border-gray-600 p-6 rounded-lg'>
                {user?.bio || "I'm a passionate developer who loves building web apps with MERN stack."}
              </p>
            </div>

            {/* Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <Button onClick={() => setOpen(true)}>Edit Profile</Button>
              <DialogContent className="md:w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-center">Edit Profile</DialogTitle>
                  <DialogDescription className="text-center">
                    Make changes to your profile here.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='flex gap-2'>
                    <div>
                      <Label>First Name</Label>
                      <Input name="firstName" value={input.firstName} onChange={changeEventHandler} />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input name="lastName" value={input.lastName} onChange={changeEventHandler} />
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <div>
                      <Label>Facebook</Label>
                      <Input name="facebook" value={input.facebook} onChange={changeEventHandler} />
                    </div>
                    <div>
                      <Label>Instagram</Label>
                      <Input name="instagram" value={input.instagram} onChange={changeEventHandler} />
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <div>
                      <Label>Linkedin</Label>
                      <Input name="linkedin" value={input.linkedin} onChange={changeEventHandler} />
                    </div>
                    <div>
                      <Label>Github</Label>
                      <Input name="github" value={input.github} onChange={changeEventHandler} />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea name="bio" value={input.bio} onChange={changeEventHandler} />
                  </div>
                  <div>
                    <Label>Picture</Label>
                    <Input type="file" accept="image/*" onChange={changeFileHandler} />
                  </div>
                </div>
                <DialogFooter>
                  {loading ? (
                    <Button disabled><Loader2 className='mr-2 w-4 h-4 animate-spin' />Please wait</Button>
                  ) : (
                    <Button onClick={submitHandler}>Save Changes</Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>

      {/* Dashboard Stats */}
      <TotalProperty />
    </div>
  )
}

export default Profile
