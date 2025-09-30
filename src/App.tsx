import './App.css'
import { MidSection } from './components/mid-section/mid-section'
import { OpenedSecton } from './components/opened'
import { Sidebar } from './components/sidebar/sidebar'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className='flex'>
      <Sidebar />
      <MidSection />
      <OpenedSecton />
      <ToastContainer />
    </div>
  )
}

export default App
