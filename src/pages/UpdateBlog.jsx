import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useRef, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import JoditEditor from 'jodit-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/services/api'; // Axios instance with Authorization header
import { toast } from 'sonner';
import { setBlog } from '@/redux/blogSlice';

const UpdateBlog = () => {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState('');
  const [publish, setPublish] = useState(false);
  const params = useParams();
  const id = params.blogId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);

  const selectBlog = blog.find((b) => b._id === id);

  const [blogData, setBlogData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    thumbnail: null,
  });

  useEffect(() => {
    if (selectBlog) {
      setContent(selectBlog.description || '');
      setBlogData({
        title: selectBlog.title || '',
        subtitle: selectBlog.subtitle || '',
        description: selectBlog.description || '',
        category: selectBlog.category || '',
        thumbnail: selectBlog.thumbnail,
      });
      setPreviewThumbnail(selectBlog.thumbnail || '');
      setPublish(selectBlog.isPublished || false);
    }
  }, [selectBlog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectCategory = (value) => {
    setBlogData((prev) => ({ ...prev, category: value }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData((prev) => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const updateBlogHandler = async () => {
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('subtitle', blogData.subtitle);
    formData.append('description', content);
    formData.append('category', blogData.category);

    if (blogData.thumbnail && typeof blogData.thumbnail !== 'string') {
      formData.append('file', blogData.thumbnail);
    }

    try {
      setLoading(true);
      const res = await api.put(`/blog/edit/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/dashboard/your-blog');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update blog');
    } finally {
      setLoading(false);
    }
  };

  const togglePublishUnpublish = async (action) => {
    try {
      const res = await api.patch(`/blog/action/${id}/publish?action=${action}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setPublish((prev) => !prev);
        navigate('/dashboard/your-blog');
      } else {
        toast.error('Failed to update publish status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error toggling publish status');
    }
  };

  const deleteBlog = async () => {
    try {
      const res = await api.delete(`/blog/delete/${id}`);
      if (res.data.success) {
        const updated = blog.filter((b) => b._id !== id);
        dispatch(setBlog(updated));
        toast.success(res.data.message);
        navigate('/dashboard/your-blog');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting blog');
    }
  };

  return (
    <div className='pb-10 px-3 pt-20 md:ml-[320px]'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className='w-full bg-white dark:bg-gray-800 p-5 space-y-2'>
          <h1 className='text-4xl font-bold'>Edit Blog</h1>
          <p>Make changes to your blog here. Click publish when you're done.</p>

          <div className='space-x-2'>
            <Button onClick={() => togglePublishUnpublish(selectBlog?.isPublished ? 'false' : 'true')}>
              {selectBlog?.isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <Button variant='destructive' onClick={deleteBlog}>
              Delete Blog
            </Button>
          </div>

          <div className='pt-10'>
            <Label>Title</Label>
            <Input
              type='text'
              name='title'
              value={blogData.title}
              onChange={handleChange}
              placeholder='Enter a title'
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Input
              type='text'
              name='subtitle'
              value={blogData.subtitle}
              onChange={handleChange}
              placeholder='Enter a subtitle'
            />
          </div>

          <div>
            <Label>Description</Label>
            <JoditEditor
              ref={editor}
              value={content}
              onChange={(newContent) => {
                setContent(newContent);
                setBlogData((prev) => ({ ...prev, description: newContent }));
              }}
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={blogData.category} onValueChange={selectCategory}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select a category' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value='Web Development'>Web Development</SelectItem>
                  <SelectItem value='Digital Marketing'>Digital Marketing</SelectItem>
                  <SelectItem value='Blogging'>Blogging</SelectItem>
                  <SelectItem value='Photography'>Photography</SelectItem>
                  <SelectItem value='Cooking'>Cooking</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Thumbnail</Label>
            <Input id='file' type='file' onChange={selectThumbnail} accept='image/*' className='w-fit' />
            {previewThumbnail && (
              <img src={previewThumbnail} className='w-64 my-2' alt='Blog Thumbnail' />
            )}
          </div>

          <div className='flex gap-3'>
            <Button variant='outline' onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button onClick={updateBlogHandler} disabled={loading}>
              {loading ? 'Please wait...' : 'Save'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UpdateBlog;
