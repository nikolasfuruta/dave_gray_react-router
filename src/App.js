import React from 'react';
//dynamic components
import Home from './dynamic/home/Home';
import NewPost from './dynamic/NewPost';
import PostPage from './dynamic/PostPage';
import About from './dynamic/About';
import Missing from './dynamic/Missing';

import Layout from './Layout';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {format} from 'date-fns';

import { listPosts } from './listPosts';

function App() {
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
	const [posts, setPosts] = useState(listPosts);
  const navigate = useNavigate();

  useEffect(()=>{
    const filteredResults = posts.filter(post => 
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase())) 
      
    setSearchResult(filteredResults.reverse());
  },[posts,search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = {
      id,
      title:postTitle,
      datetime,
      body:postBody
    };
    const allPosts = [...posts, newPost];
    setPosts(allPosts);
    setPostTitle('');
    setPostBody('');
    navigate('/');
  }

	const handleDelete = (id) => {
    const postsList = posts.filter(post => post.id !== id)
    setPosts(postsList)
    navigate('/')
  }

  return (
		<Routes>
				<Route path='/' element={<Layout search={search} setSearch={setSearch}/>}>
					<Route index element={<Home posts={searchResult}/>} />
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
          <Route path='about' element={<About/>} />
          <Route path='*' element={<Missing/>} />
        </Route>
    </Routes>
	);
}

export default App;
