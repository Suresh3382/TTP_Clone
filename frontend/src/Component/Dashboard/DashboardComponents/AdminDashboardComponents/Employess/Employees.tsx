import { Button, Input, Pagination, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { Search, Filter, AlignJustify, LayoutGrid, RotateCw, Download, Plus } from 'lucide-react';
import { ESelected } from '../../EmployeeComponents/Reports';
import { useState } from 'react';

const Employees = () => {
  const [selected, setSelected] = useState<ESelected>(ESelected.Table);
  const [refresh, setRefresh] = useState<boolean>();

  const columns: TableProps['columns'] = [
    {
      title: 'S.NO.',
      dataIndex: 'S.NO.',
      key: 'sno',
      render: (index) => <a>{index}</a>,
    },
    {
      title: '',
      dataIndex: 'image',
      key: 'image',
      width: '5%',
      render: (_: any, record: any) =>

        <div className="rounded-full w-8 h-8 flex justify-center items-center bg-gray-100">
          {record?.user?.contactFeilds?.image ? (
            <img src={record?.user?.contactFeilds?.image} className='rounded-full' alt="User Avatar" />
          ) : (
            <div className="flex justify-center items-center text-blue-600 font-semibold text-md">
              <span>{record?.User?.username.charAt(0)?.toUpperCase() || '?'}</span>
            </div>
          )}
        </div>
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name - b.name,
    },
    {
      title: 'WORK EMAIL',
      dataIndex: 'workEmail',
      key: 'workEmail',
    },
    {
      title: 'PHONE',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'DEPARTMENT',
      dataIndex: 'depertment',
      key: 'depertment',
    },
    {
      title: 'DESIGNATION',
      key: 'DESIGNATION',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

  return (
    <div>
      <div>
        <div className="flex bg-white py-2.5 flex gap-2 justify-end items-center">
          <Input suffix={<Search size={16} />} placeholder='Search Employee...' className='w-72' />
          <Button className='themed-bt flex gap-1 py-1.5 font-[outfit]'><Plus size={16}/> Employee</Button>
          <button className='flex gap-1 items-center cursor-pointer py-1 px-2 rounded bg-blue-100 text-blue-500' onClick={() => { setRefresh(prevRefresh => !prevRefresh) }}><Download size={18} /> CSV</button>
          <RotateCw size={32} className='cursor-pointer p-1.5 rounded bg-blue-100 text-blue-500' onClick={() => { setRefresh(prevRefresh => !prevRefresh) }} />
          <LayoutGrid size={32} strokeWidth={1.5} onClick={() => setSelected(ESelected.Layout)} className={selected === ESelected.Layout ? 'cursor-pointer p-0.5 text-blue-500' : 'cursor-pointer p-0.5 text-gray-500'} />
          <AlignJustify size={32} onClick={() => setSelected(ESelected.Table)} className={selected === ESelected.Table ? 'cursor-pointer p-0.5 text-blue-500' : 'cursor-pointer p-0.5 text-gray-500'} />
        </div>
      </div>
      <div>
        <Table
          className="my-table-styling2"
          columns={columns} dataSource={data}
          rowKey={(record: any) => record._id || record.key}
          pagination={false}
        />
        <div className='w-full flex justify-end mt-4 gap-2'>
          {/* <p className='text-xs flex items-center mt-1'>Total {total} Items</p>  */}
          <Pagination size="small"
            pageSize={14}
            // total={total}  
            // onChange={handleChange}  
            showQuickJumper
          />
        </div>
      </div>
    </div>
  )
}

export default Employees