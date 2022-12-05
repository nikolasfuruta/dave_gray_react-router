import React from 'react';
//dynamic components
import Home from './dynamic/home/Home';
import NewPost from './dynamic/NewPost';
import PostPage from './dynamic/PostPage';
import About from './dynamic/About';
import Missing from './dynamic/Missing';
import EditPost from './dynamic/EditPost';

import Layout from './Layout';
import { Route, Routes} from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path='post'>
          <Route index element={<NewPost/>}/>
          <Route path=':id' element={<PostPage/>}/>
        </Route>
        <Route path='edit/:id' element={<EditPost/>}/>
        <Route path='about' element={<About/>} />
        <Route path='*' element={<Missing/>} />
      </Route>
    </Routes>
	);
}

export default App;
