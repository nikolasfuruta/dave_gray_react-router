//static components
import Header from './static/Header';
import Nav from './static/Nav';
import Footer from './static/Footer';

import {Outlet} from 'react-router-dom';
import { DataProvider } from './context/DataContext';

const Layout = () => {
  return (
    <div className='App'>
			<Header title='React JS Blog' />
			<Nav/>
      <DataProvider>
        <Outlet />
      </DataProvider>
      <Footer />
		</div>
  )
}

export default Layout