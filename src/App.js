import React from 'react';
//dynamic components
import Home from './dynamic/home/Home';
import NewPost from './dynamic/NewPost';
import PostPage from './dynamic/PostPage';
import About from './dynamic/About';
import Missing from './dynamic/Missing';
import EditPost from './dynamic/EditPost';

import Layout from './Layout';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {format} from 'date-fns';
import api from './api/posts';
import useWindowSize from './hooks/useWindowSize';
import useAxiosFetch from './hooks/useAxiosFetch';

function App() {
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
	const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const {width} = useWindowSize();

  const {data,fetchError, isLoading} = useAxiosFetch('http://localhost:3500/posts');

  // useEffect(()=>{
  //   const fetchPosts = async () => {
  //     try{
  //       const response = await api.get('/posts');
  //       if(response && response.data) setPosts(response.data);
  //     }
  //     catch(e){
  //       if(e.response){
  //         //get a response different from 200
  //         console.log(e.response.data);
  //         console.log(e.response.status);
  //         console.log(e.response.headers);
  //       }
  //       else {
  //         //get no response
  //         console.log(`Error: ${e.message}`)
  //       }
  //     }
  //   }
  //   fetchPosts();
  // },[]);

  useEffect(()=>{
    setPosts(data);
  },[data]);

  useEffect(()=>{
    const filteredResults = posts.filter(post => 
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase())) 
      
    setSearchResult(filteredResults.reverse());
  },[posts,search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = {
      id,
      title:postTitle,
      datetime,
      body:postBody
    };
    try{
      const response = await api.post('/posts',newPost)
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/');
    }
    catch(e){
      console.log(`Error: ${e.message}`);
    }
  }

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = {
      id,
      title:editTitle,
      datetime,
      body:editBody
    };
    try{
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map(post=>post.id===id?{...response.data}:post))
      setEditTitle('')
      setEditBody('')
      navigate('/')
    }
    catch(e){
      console.log(`Error: ${e.message}`);
    }
  }

	const handleDelete = async (id) => {
    try{
      await api.delete(`/posts/${id}`)
      const postsList = posts.filter(post => post.id !== id)
      setPosts(postsList)
      navigate('/')
    }
    catch(e){
      console.log(`Error: ${e.message}`);
    }
  }

  return (
		<Routes>
				<Route path='/' 
          element={
            <Layout search={search} setSearch={setSearch} width={width}/>
          }>
					<Route index element={
            <Home 
              posts={searchResult}
              fetchError = {fetchError}
              isLoading = {isLoading}
              />
            } 
          />
          <Route path='post'>
            <Route index element={<NewPost
              handleSubmit = {handleSubmit}
              postTitle = {postTitle}
              postBody={postBody}
              setPostTitle={setPostTitle}
              setPostBody = {setPostBody}
              />}/>
            <Route path=':id' element={<PostPage 
              posts={posts} 
              handleDelete={handleDelete}
              />}/>
          </Route>
          <Route path='edit/:id' element={<EditPost
              posts={posts}
              handleEdit = {handleEdit}
              editTitle = {editTitle}
              editBody={editBody}
              setEditTitle={setEditTitle}
              setEditBody = {setEditBody}
              />}/>
          <Route path='about' element={<About/>} />
          <Route path='*' element={<Missing/>} />
        </Route>
    </Routes>
	);
}

export default App;
