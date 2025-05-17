// src/layouts/StudentLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const StudentLayout = () => {
  return (
    <div className="">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
