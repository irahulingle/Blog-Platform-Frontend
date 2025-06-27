import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart, FaEdit, FaTrash } from "react-icons/fa";

const CommentBox = ({ postId }) => {
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const token = localStorage.getItem("token");

  const fetchComments = async () => {
    if (!postId) return;
    try {
      const res = await axios.get(`/comment/${postId}`);
      setComments(res.data.comments);
    } catch (err) {
      toast.error("Failed to fetch comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !postId) return;

    try {
      await axios.post(
        `/comment/${postId}`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Comment added");
      setNewComment("");
      fetchComments();
    } catch (err) {
      toast.error("Error posting comment");
    }
  };

  const handleLike = async (commentId) => {
    try {
      await axios.patch(
        `/comment/like/${commentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments();
    } catch (err) {
      toast.error("Failed to like comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Comment deleted");
      fetchComments();
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const handleEdit = async (commentId) => {
    try {
      await axios.put(
        `/comment/${commentId}`,
        { content: editedContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Comment updated");
      setEditingCommentId(null);
      fetchComments();
    } catch (err) {
      toast.error("Failed to update comment");
    }
  };

  if (!postId) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
        ⚠️ Error: Missing post ID for comments
      </div>
    );
  }

  return (
    <div className="p-4 dark:bg-gray-900 rounded-xl border dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">Comments</h2>

      <div className="mb-4 flex items-center gap-2">
        <input
          className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleAddComment}
        >
          Post
        </button>
      </div>

      {comments.map((comment) => (
        <div
          key={comment._id}
          className="border-b py-3 flex justify-between items-start"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={comment.userId?.photoUrl || "/user.jpg"}
                className="w-8 h-8 rounded-full"
                alt="user"
              />
              <span className="font-medium dark:text-white">
                {comment.userId?.firstName} {comment.userId?.lastName}
              </span>
            </div>

            {editingCommentId === comment._id ? (
              <div className="flex gap-2 mt-2">
                <input
                  className="border px-2 py-1 flex-1 rounded dark:bg-gray-800 dark:text-white"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button
                  onClick={() => handleEdit(comment._id)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="dark:text-gray-300">{comment.content}</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => handleLike(comment._id)}
              className="text-red-600 flex items-center"
              title="Like/Unlike"
            >
              {comment.likes.includes(user?._id) ? <FaHeart /> : <FaRegHeart />}
              <span className="ml-1 text-sm text-gray-500">
                {comment.numberOfLikes}
              </span>
            </button>

            {comment.userId?._id === user?._id && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCommentId(comment._id);
                    setEditedContent(comment.content);
                  }}
                  className="text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentBox;
