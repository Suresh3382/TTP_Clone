import { Button, Input, Pagination, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import { Search, Download, Plus, RotateCw, LayoutGrid, AlignJustify } from 'lucide-react';
import { useState, useEffect } from 'react';
import { baseURL } from '../../../../../baseURL';
import { useCallApi } from '../../../../../Utlits/AxiosConifg';
import { IcurrentUserDetails } from '../../../../../Interfaces/FulldetailsInterface';
import { ESelected } from '../../EmployeeComponents/Reports';

const Employees = () => {
  const [selected, setSelected] = useState<ESelected>(ESelected.Table);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [users, setUsers] = useState<IcurrentUserDetails[]>([]);
  const { callApi } = useCallApi();

  useEffect(() => {
    getAllUser();
  }, [refresh]);

  const getAllUser = () => {
    callApi({
      requestEndpoint: `${baseURL}user/getAllUsers`,
      method: "get",
    }).then((res) => {
      setUsers(res.data.response || []);
    });
  };

  const columns: TableProps['columns'] = [
    {
      title: 'S.NO.',
      dataIndex: 'index',
      key: 'sno',
      render: (text: string, record: any, index: number) => <>{index + 1}</>,
      width: 60
    },
    {
      title: '',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (_: any, record: any) =>
        <div className="rounded-full w-8 h-8 flex justify-center items-center bg-gray-100">
          {record?.pfp ? (
            <img src={record?.pfp} className='rounded-full' alt="User Avatar" />
          ) : (
            <div className="flex justify-center items-center text-blue-600 font-semibold text-md">
              <span>{record?.firstName.charAt(0)?.toUpperCase() || '?'}</span>
            </div>
          )}
        </div>
    },
    {
      title: 'Employee Id',
      dataIndex: 'Employee Id',
      key: 'employeeId',
      width: 100,
      render: (text: string, record: any, index: number) => {
        return <span className='rounded-md bg-green-50 text-xs text-blue-700 px-3 py-1.5'>TTP0{index + 67}</span>
      }
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      width: 380,
      render: (text, record) => <a className='text-blue-600'>{`${record.firstName} ${record.lastName}`}</a>,
      sorter: (a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName),
    },
    {
      title: 'WORK EMAIL',
      dataIndex: 'workEmail',
      key: 'workEmail',
      width: 380,
      render: (text, record) => <a>{record.email}</a>,
    },
    {
      title: 'PHONE',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      render: (text, record) => <span>{record.phone || '9929222252'}</span>,
    },
    {
      title: 'DEPARTMENT',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      render: (_, record) => (
        <span>Cyber Security</span>
      ),
    },
    {
      title: 'DESIGNATION',
      key: 'DESIGNATION',
      render: (_, record) => (
        <span>Architect & Designing & Printing</span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex bg-white py-2.5 flex gap-2 justify-end items-center">
        <Input suffix={<Search size={16} />} placeholder='Search Employee...' className='w-72' />
        <Button className='themed-bt flex gap-1 py-1.5 font-[outfit]'><Plus size={16} /> Employee</Button>
        <button onClick={getAllUser} className='flex gap-1 items-center cursor-pointer py-1 px-2 rounded bg-blue-100 text-blue-500'>
          <Download size={18} /> CSV
        </button>
        <RotateCw size={32} className='cursor-pointer p-1.5 rounded bg-blue-100 text-blue-500' onClick={() => setRefresh(prev => !prev)} />
        <LayoutGrid size={28} strokeWidth={1.5} onClick={() => setSelected(ESelected.Layout)} className={selected === ESelected.Layout ? 'cursor-pointer p-0.5 text-blue-500' : 'cursor-pointer p-0.5 text-gray-500'} />
        <AlignJustify size={28} onClick={() => setSelected(ESelected.Table)} className={selected === ESelected.Table ? 'cursor-pointer p-0.5 text-blue-500' : 'cursor-pointer p-0.5 text-gray-500'} />
      </div>

      <div>
        <Table
          className="my-table-styling2"
          columns={columns}
          dataSource={users}
          rowKey={(record: any) => record._id || record.key}
          pagination={{
            size: "small",
            pageSize: 12,
            // total: total,
            showQuickJumper: true,
          }}
        />
        {/* <div className='w-full flex justify-end mt-4 gap-2'>
          <Pagination
            size="small"
            pageSize={14}
            // total={total}
            showQuickJumper
          />
        </div> */}
      </div>
    </div>
  );
};

export default Employees;
