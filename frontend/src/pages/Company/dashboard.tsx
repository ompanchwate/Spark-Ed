
import React, { useContext } from 'react'
import { useUser } from '../../context/UserContext'
const CompanyDashBoard = () => {
    // const details = cookies.get('details')
    const { userDetails, setUserDetails } = useUser();
    console.log("userDetails", userDetails)

  return (
    <div>dashboard</div>
  )
}

export default CompanyDashBoard