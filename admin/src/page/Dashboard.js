import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {

    const [skinTypes, setSkinTypes] = useState([
        { skinType: 'berminyak' },
        { skinType: 'kering' },
        { skinType: 'jerawat' },
    ])

    const getSkinTypes = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/skinTypes`);
          setSkinTypes(response.data);
        } catch (error) {
          console.log(error.message);
        }
      };

  return (
    <div>
    <div>Jenis kulit</div>
    <ul>
    {skinTypes.map((item, index) =>(
        <li>
            <Link to={`/products/${item.skinType}`}>{item.skinType}</Link>
        </li>    
    ))}
    </ul>
    </div>
  )
}

export default Dashboard