import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AxiosRequestConfig } from 'axios';

import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';

import Pagination from 'components/Pagination';
import { requestBackend } from 'util/requests';

import './styles.css';
import EmployeeCard from 'components/EmployeeCard';
import { hasAnyRoles } from 'util/auth';

type ControlComponentsData = {
  activePage: number;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();
  const [controlComponentsData, setControlComponentsData] =
    useState<ControlComponentsData>({
      activePage: 0,
    });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData({
      activePage: pageNumber,
    });
  };

  const getEmployees = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/employees?sort=name,asc`,
      withCredentials: true,
      params: {
        page: controlComponentsData.activePage,
        size: 4,
      },
    };

    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentsData]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  return (
    <>
      {hasAnyRoles(['ROLE_ADMIN']) &&
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>
      }

      {page?.content.map((employee) => (
        <div key={employee.id}>
          <EmployeeCard employee={employee} />
        </div>
      ))}

      <Pagination
        forcePage={page?.number}
        pageCount={page ? page.totalPages : 0}
        range={4}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
