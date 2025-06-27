import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { MessageSquare, Bookmark, Share2 } from 'lucide-react';
import CommentBox from '@/components/CommentBox';
import axios from 'axios';
import { setBlog } from '@/redux/blogSlice';
import { toast } from 'sonner';

const BlogView = () => {
  const { blogId } = useParams();
  const dispatch = useDispatch();
  const { blog } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);
  const { comment } = useSelector((state) => state.comment);

  const selectedBlog = blog.find((b) => b._id === blogId);

  const [blogLike, setBlogLike] = useState(selectedBlog?.likes?.length || 0);
  const [liked, setLiked] = useState(selectedBlog?.likes?.includes(user?._id) || false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(
        `http://localhost:8000/api/v1/blog/action/${selectedBlog._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
        setBlogLike(updatedLikes);
        setLiked(!liked);

        const updatedBlogData = blog.map((p) =>
          p._id === selectedBlog._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Error while liking blog');
    }
  };

  const handleShare = (blogId) => {
    const blogUrl = `${window.location.origin}/blogs/${blogId}`;
    if (navigator.share) {
      navigator
        .share({
          title: 'Check out this blog!',
          text: 'Read this amazing blog post.',
          url: blogUrl,
        })
        .then(() => console.log('Shared successfully'))
        .catch((err) => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(blogUrl).then(() => {
        toast.success('Blog link copied to clipboard!');
      });
    }
  };

  const changeTimeFormat = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!selectedBlog) return <p className="p-10 text-center">Blog not found.</p>;

  return (
    <div className="pt-14">
      <div className="max-w-6xl mx-auto p-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/blogs">Blogs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Blog Header */}
        <div className="my-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{selectedBlog.title}</h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={selectedBlog.author.photoUrl} alt="Author" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {selectedBlog.author.firstName} {selectedBlog.author.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedBlog.author.occupation}
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Published on {changeTimeFormat(selectedBlog.createdAt)} • 8 min read
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={selectedBlog?.thumbnail}
            alt={selectedBlog?.title}
            className="w-full object-cover"
          />
          <p className="text-sm text-muted-foreground mt-2 italic">
            {selectedBlog.subtitle}
          </p>
        </div>

        <div dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />

        {/* Tags */}
        <div className="mt-10">
          <div className="flex flex-wrap gap-2 mb-8">
            {selectedBlog.tags?.map((tag, idx) => (
              <Badge key={idx} variant="secondary">{tag}</Badge>
            ))}
          </div>

          {/* Engagement */}
          <div className="flex items-center justify-between border-y py-4 mb-8">
            <div className="flex items-center space-x-4">
              <Button onClick={likeOrDislikeHandler} variant="ghost" size="sm">
                {liked ? (
                  <FaHeart size={20} className="text-red-600" />
                ) : (
                  <FaRegHeart size={20} />
                )}
                <span className="ml-1">{blogLike}</span>
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4" />
                <span className="ml-1">{comment?.length || 0} Comments</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handleShare(selectedBlog._id)}
                variant="ghost"
                size="sm"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* ✅ Pass correct postId to CommentBox */}
        <CommentBox postId={selectedBlog._id} />

      </div>
    </div>
  );
};

export default BlogView;
