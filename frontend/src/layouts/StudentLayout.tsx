import { Outlet } from 'react-router-dom';
import StudentNavbar from '../components/student/StudentNavbar';

const StudentLayout = () => {
  return (
    <div className="">
      <StudentNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
