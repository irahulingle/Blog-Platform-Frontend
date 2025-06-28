import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { setBlog } from '@/redux/blogSlice'

const CreateBlog = () => {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { blog } = useSelector(state => state.blog)

  const handleCategoryChange = value => {
    setCategory(value)
  }

  const createBlogHandler = async () => {
    if (!title.trim() || !category) {
      toast.error('Title and Category are required.')
      return
    }

    try {
      setLoading(true)

      console.log('Sending blog data:', { title, category })

      const res = await axios.post(
        `https://blog-platform-backend-crkc.onrender.com/api/v1/blog/`,
        { title, category },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      )

      if (res.data.success) {
        dispatch(setBlog([...blog, res.data.blog]))
        toast.success(res.data.message)
        navigate(`/dashboard/write-blog/${res.data.blog._id}`)
      } else {
        toast.error('Something went wrong.')
      }
    } catch (error) {
      console.error('Create Blog Error:', error)
      toast.error(error?.response?.data?.message || 'Failed to create blog.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4 md:pr-20 h-screen md:ml-[320px] pt-20'>
      <Card className='md:p-10 p-4 dark:bg-gray-800'>
        <h1 className='text-2xl font-bold'>Let’s create a blog</h1>
        <p className='text-muted-foreground text-sm mb-6'>
          Start by giving your blog a title and selecting a category.
        </p>

        <div className='space-y-6'>
          <div>
            <Label>Title</Label>
            <Input
              type='text'
              placeholder='Your Blog Title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='bg-white dark:bg-gray-700'
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className='w-[240px] bg-white dark:bg-gray-700'>
                <SelectValue placeholder='Select a category' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value='Web Development'>Web Development</SelectItem>
                  <SelectItem value='Digital Marketing'>Digital Marketing</SelectItem>
                  <SelectItem value='Blogging'>Blogging</SelectItem>
                  <SelectItem value='Photography'>Photography</SelectItem>
                  <SelectItem value='Cooking'>Cooking</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='flex gap-2'>
            <Button className='' disabled={loading} onClick={createBlogHandler}>
              {loading ? (
                <>
                  <Loader2 className='mr-1 h-4 w-4 animate-spin' /> Please wait
                </>
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CreateBlog
