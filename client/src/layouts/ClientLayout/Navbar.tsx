import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as categoryApi from '../../apis/categoryApi';
import { Category } from '../../models/Category';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const res = await categoryApi.getAllPublic();
        setCategories(res.data as Category[]);
      } catch (error: any) {
        const { data } = error.response;

        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getAllCategory();
  }, [navigate]);

  return (
    <ul style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '10px 0' }}>
      {categories.map((category, index) => (
        <li key={`category-item-${index}`}>
          <Link to={category.slug} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <img src={category.imageUrl} alt={category.name} style={{ width: '25px', height: '25px' }} />
            <Typography>{category.name}</Typography>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Navbar;
