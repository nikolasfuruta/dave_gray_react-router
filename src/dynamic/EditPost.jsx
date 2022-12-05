import React, {useState, useContext}from 'react';
import DataContext from '../context/DataContext';
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/posts'

const EditPost = () => {
  const [editTitle, setEditTitle] = useState('');
	const [editBody, setEditBody] = useState('');
  const {posts, setPosts, format} = useContext(DataContext)
  const {id} =  useParams();
  let navigate = useNavigate()
  const post = posts.find(post => (post.id).toString() === id)
  
  useEffect(()=>{
    if(post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
  },[post,setEditBody,setEditTitle]);

  const handleEdit = async (id) => {
		const datetime = format(new Date(), 'MMMM dd, yyyy pp');
		const updatedPost = {
			id,
			title: editTitle,
			datetime,
			body: editBody,
		};
		try {
			const response = await api.put(`/posts/${id}`, updatedPost);
			setPosts(
				posts.map((post) => (post.id === id ? { ...response.data } : post))
			);
			setEditTitle('');
			setEditBody('');
			navigate('/');
		} catch (e) {
			console.log(`Error: ${e.message}`);
		}
	};

  return (
    <main className='NewPost'>
    {editTitle && 
      <>
        <h2>EditPost</h2>
        <form className='newPostForm' onSubmit={(e)=>e.preventDefault()}>
          <label htmlFor="postTitle">Title:</label>
          <input 
            type="text" 
            id='postTitle'
            required
            value={editTitle}
            onChange = {(e) => setEditTitle(e.target.value)}
            />
          <label htmlFor="postBody">Body:</label>
          <textarea 
            id='postBody'
            required
            value={editBody}
            onChange = {(e) => setEditBody(e.target.value)}
          />
          <button onClick={() => handleEdit(post.id)} type="submit">Submit</button>
        </form>
      </>  
    }
    {!editTitle &&
      <>
      <h2>Post Not Found</h2>
      <p>Well, that`s disappointing...</p>
      <p>
        <Link to='/'>Visit Our Homepage</Link>
      </p>
      </>
    }
    </main>
  )
}

export default EditPost