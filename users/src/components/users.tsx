import { useEffect, useState } from 'react';
import Pagination from './pagination';
import User from './user';
import GroupList from './groupList';
import api from '../api';
import SearchStatus from './searchStatus';

export type UserType = {
  bookmark: boolean;
  completedMeetings: number;
  name: string;
  profession: { _id: string; name: string; };
  qualities: { _id: string; name: string; color: string; }[];
  rate: number;
  _id: string;
};

export type ProfessionType = {
  _id: string; name: string;
};

export type ProfessionsObjectType = {
  [key: string]: { _id: string; name: string; };
};

type UsersProps = {
  handleDelete: (id: string) => void;
  onBookMark: (id: string) => void;
  users: UserType[];
};


const Users = ({ users, handleDelete, onBookMark }: UsersProps) => {
  const pageSize = 4;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [professions, setProfessions] = useState<ProfessionsObjectType | ProfessionType[] | null>(null);
  const [selectedProf, setSelectedProf] = useState<ProfessionType | null>(null);

  useEffect(() => {
    api.professions.fetchAll().then((data) => setProfessions(data));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProf]);

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const paginate = (users: UserType[], pageSize: number, pageNumber: number) => {
    const startIndex = (pageNumber - 1) * pageSize;
    return [...users].splice(startIndex, pageSize);
  };

  const handleProfessionSelect = (profession: ProfessionType) => {
    setSelectedProf(profession);
  };




  const filtredUsers = selectedProf
    ? users.filter(user => JSON.stringify(user.profession) === JSON.stringify(selectedProf))
    : users;



  const count = filtredUsers.length;
  const cropUsersArray = paginate(filtredUsers, pageSize, currentPage);

  return (
    <>
      <SearchStatus value={count} />

      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {
          professions
          && (<div style={{ width: '20%' }}>
            <GroupList professions={professions} onItemSelect={handleProfessionSelect} selectedProfession={selectedProf} />
            <button className='btn btn-secondary mt-2 mb-2' onClick={() => setSelectedProf(null)}>Сбросить фильтры</button>
          </div>)
        }

        {
          count > 0 &&
          <div style={{ flexGrow: 1 }}>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Имя</th>
                  <th scope="col">Качества</th>
                  <th scope="col">Профессия</th>
                  <th scope="col">Встретился, раз</th>
                  <th scope="col">Оценка</th>
                  <th scope="col">Избранное</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {
                  cropUsersArray.map(user => <User user={user} handleDelete={handleDelete} onBookMark={onBookMark} key={user._id} />)
                }
              </tbody>
            </table>

            <div className='d-flex justify-content-center'>
              <Pagination itemsCount={count} pageSize={pageSize} onPageChange={handlePageChange} currentPage={currentPage} />
            </div>
          </div>
        }
      </div >
    </>
  );
};

export default Users;