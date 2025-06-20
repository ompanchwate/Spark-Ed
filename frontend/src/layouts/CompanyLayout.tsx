import { Outlet } from 'react-router-dom';
import CompanyNavbar from '@/components/company/CompanyNavbar';

const CompanyLayout = () => {
  return (
    <div className="">
      <CompanyNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CompanyLayout;
